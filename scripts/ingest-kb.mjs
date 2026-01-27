/**
 * Ingestion script for knowledge base documents
 * Uses gte-small model (384 dimensions) via @xenova/transformers
 * 
 * Prerequisites:
 * 1. Install deps: pnpm add @xenova/transformers -w
 * 2. Run the 20260127_add_kb_embeddings.sql migration (384 dim version)
 * 
 * Run with: node --experimental-specifier-resolution=node --loader tsx scripts/ingest-kb.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { pipeline } from '@xenova/transformers';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Load env
function loadEnv(envPath) {
    if (fs.existsSync(envPath)) {
        fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
            const [key, ...vals] = line.split('=');
            if (key?.trim() && vals.length) {
                process.env[key.trim()] = vals.join('=').trim().replace(/^["']|["']$/g, '');
            }
        });
    }
}

loadEnv(path.join(ROOT, 'env.local'));
loadEnv(path.join(ROOT, 'apps', 'portal', '.env.local'));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing SUPABASE env vars');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Initialize embedding model (gte-small = 384 dimensions)
console.log('Loading gte-small embedding model...');
const embedder = await pipeline('feature-extraction', 'Supabase/gte-small');
console.log('Model loaded!\n');

async function embed(text) {
    const output = await embedder(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
}

function parseMarkdown(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath, '.md');
    const lines = content.split('\n');
    const chunks = [];
    let h1 = '', h2 = '', buf = [];

    for (const line of lines) {
        if (line.startsWith('# ')) { h1 = line.slice(2).trim(); continue; }
        if (line.startsWith('## ')) {
            if (h2 && buf.length) {
                const text = buf.join('\n').trim();
                if (text.length > 50) {
                    chunks.push({
                        content: `# ${h1}\n\n## ${h2}\n\n${text}`,
                        metadata: { file: fileName, section: h2, title: `${h1} > ${h2}` }
                    });
                }
            }
            h2 = line.slice(3).trim();
            buf = [];
            continue;
        }
        buf.push(line);
    }

    if (h2 && buf.length) {
        const text = buf.join('\n').trim();
        if (text.length > 50) {
            chunks.push({
                content: `# ${h1}\n\n## ${h2}\n\n${text}`,
                metadata: { file: fileName, section: h2, title: `${h1} > ${h2}` }
            });
        }
    }
    return chunks;
}

async function main() {
    const KB_DIR = path.join(ROOT, 'docs', 'knowledge-base');
    console.log('=== KB Ingestion (gte-small) ===\n');

    // Clear existing
    await supabase.from('kb_embeddings').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const files = fs.readdirSync(KB_DIR).filter(f => f.endsWith('.md') && f !== 'README.md');
    console.log(`Found ${files.length} files\n`);

    let total = 0;
    for (const file of files) {
        process.stdout.write(`${file}: `);
        const chunks = parseMarkdown(path.join(KB_DIR, file));

        for (const chunk of chunks) {
            try {
                const embedding = await embed(chunk.content);
                const { error } = await supabase.from('kb_embeddings').insert({
                    content: chunk.content,
                    metadata: chunk.metadata,
                    embedding
                });
                if (error) console.error('✗', error.message);
                else { total++; process.stdout.write('.'); }
            } catch (e) {
                console.error('✗', e.message);
            }
        }
        console.log(' ✓');
    }

    console.log(`\nDone: ${total} chunks ingested with gte-small (384 dim)`);
}

main().catch(console.error);
