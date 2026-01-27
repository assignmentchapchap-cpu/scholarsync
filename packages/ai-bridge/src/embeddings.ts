/**
 * Embedding utilities using Supabase gte-small model
 * via @xenova/transformers (384 dimensions)
 */

import { pipeline, Pipeline } from '@xenova/transformers';

let embedder: any = null;

/**
 * Initialize the embedding pipeline (lazy loaded)
 */
async function getEmbedder(): Promise<any> {
    if (!embedder) {
        // Use Supabase/gte-small model - 384 dimensions
        embedder = await pipeline('feature-extraction', 'Supabase/gte-small');
    }
    return embedder;
}

/**
 * Generate embedding for a single text using gte-small
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    const pipe = await getEmbedder();
    const output = await pipe(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
}

/**
 * Generate embeddings for multiple texts (batched)
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    for (const text of texts) {
        const embedding = await generateEmbedding(text);
        embeddings.push(embedding);
    }
    return embeddings;
}
