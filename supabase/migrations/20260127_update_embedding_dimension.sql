-- Update vector dimension from 384 (gte-small) to 768 (Gemini text-embedding-004)
-- Run this in Supabase SQL Editor

-- Drop existing index
DROP INDEX IF EXISTS kb_embeddings_embedding_idx;

-- Alter the embedding column to 768 dimensions
ALTER TABLE kb_embeddings 
  ALTER COLUMN embedding TYPE VECTOR(768);

-- Recreate index
CREATE INDEX kb_embeddings_embedding_idx 
  ON kb_embeddings 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Update the match function for new dimensions
CREATE OR REPLACE FUNCTION match_kb_documents(
  query_embedding VECTOR(768),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.content,
    kb.metadata,
    1 - (kb.embedding <=> query_embedding) AS similarity
  FROM kb_embeddings kb
  WHERE 1 - (kb.embedding <=> query_embedding) > match_threshold
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
