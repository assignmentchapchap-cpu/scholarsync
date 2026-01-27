/**
 * Vector search utilities for RAG (Retrieval-Augmented Generation)
 */

import { createAdminClient } from '@schologic/database/admin';

export interface SearchResult {
    id: string;
    content: string;
    metadata: {
        file?: string;
        section?: string;
        title?: string;
    };
    similarity: number;
}

/**
 * Search for similar documents in the knowledge base
 */
export async function searchKnowledgeBase(
    queryEmbedding: number[],
    options: {
        matchThreshold?: number;
        matchCount?: number;
    } = {}
): Promise<SearchResult[]> {
    const { matchThreshold = 0.7, matchCount = 5 } = options;

    const supabase = createAdminClient();

    const { data, error } = await supabase.rpc('match_kb_documents', {
        query_embedding: queryEmbedding,
        match_threshold: matchThreshold,
        match_count: matchCount
    });

    if (error) {
        console.error('Search error:', error);
        throw new Error('Failed to search knowledge base');
    }

    return data || [];
}

/**
 * Build context string from search results
 */
export function buildContext(results: SearchResult[]): string {
    if (results.length === 0) {
        return '';
    }

    return results
        .map((r, i) => `[Source ${i + 1}${r.metadata.title ? `: ${r.metadata.title}` : ''}]\n${r.content}`)
        .join('\n\n---\n\n');
}
