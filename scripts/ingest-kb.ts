/**
 * Ingestion script for knowledge base documents
 * Uses gte-small model (384 dimensions) via @xenova/transformers
 * 
 * Run with: npx tsx scripts/ingest-kb.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import { pipeline } from '@xenova/transformers';

// Load env files
function loadEnv(envPath: string) {
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        content.split('\n').forEach((line: string) => {
            const [key, ...vals] = line.split('=');
            if (key && vals.length) {
                process.env[key.trim()] = vals.join('=').trim().replace(/^["']|["']$/g, '');
            }
        });
    }
}

loadEnv(path.join(process.cwd(), 'env.local'));
loadEnv(path.join(process.cwd(), 'apps', 'portal', '.env.local'));

// Configuration
const KB_DIR = path.join(process.cwd(), 'docs', 'knowledge-base');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing SUPABASE env vars');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface Chunk {
    content: string;
    metadata: { file: string; section: string; title: string };
}

function parseMarkdown(filePath: string): Chunk[] {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath, '.md');
    const lines = content.split('\n');
    const chunks: Chunk[] = [];
    let h1 = '', h2 = '', buf: string[] = [];

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
    console.log('=== KB Ingestion (gte-small) ===\n');

    // Clear
    await supabase.from('kb_embeddings').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Initialize embedder
    console.log('Loading model...');
    const embedder = await pipeline('feature-extraction', 'Supabase/gte-small');
    console.log('Model loaded.\n');

    const files = fs.readdirSync(KB_DIR).filter((f: string) => f.endsWith('.md') && f !== 'README.md');
    console.log(`Found ${files.length} files\n`);

    let total = 0;
    for (const file of files) {
        process.stdout.write(`${file}: `);
        const chunks = parseMarkdown(path.join(KB_DIR, file));

        for (const chunk of chunks) {
            try {
                const output = await embedder(chunk.content, { pooling: 'mean', normalize: true });
                const embedding = Array.from(output.data);

                const { error } = await supabase.from('kb_embeddings').insert({
                    content: chunk.content,
                    metadata: chunk.metadata,
                    embedding
                });
                if (error) console.error('✗', error.message);
                else { total++; process.stdout.write('.'); }
            } catch (e: any) {
                console.error('✗', e.message);
            }
        }
        console.log(' ✓');
    }

    console.log(`\nDone: ${total} chunks ingested`);
}

main().catch(console.error);
