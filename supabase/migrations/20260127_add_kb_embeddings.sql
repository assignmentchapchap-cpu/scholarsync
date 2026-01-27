-- Enable the pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Knowledge base embeddings table for RAG chatbot
CREATE TABLE IF NOT EXISTS kb_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  embedding VECTOR(384),  -- gte-small produces 384-dimensional vectors
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast similarity search
CREATE INDEX IF NOT EXISTS kb_embeddings_embedding_idx 
  ON kb_embeddings 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Text search index for hybrid search
CREATE INDEX IF NOT EXISTS kb_embeddings_content_idx 
  ON kb_embeddings 
  USING gin (to_tsvector('english', content));

-- Function to search for similar documents
CREATE OR REPLACE FUNCTION match_kb_documents(
  query_embedding VECTOR(384),
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

-- RLS policies (public read, service role write)
ALTER TABLE kb_embeddings ENABLE ROW LEVEL SECURITY;

-- Anyone can read knowledge base
CREATE POLICY "kb_embeddings_select" ON kb_embeddings
  FOR SELECT USING (true);

-- Only service role can insert/update/delete
CREATE POLICY "kb_embeddings_insert" ON kb_embeddings
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "kb_embeddings_update" ON kb_embeddings
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "kb_embeddings_delete" ON kb_embeddings
  FOR DELETE USING (auth.role() = 'service_role');

COMMENT ON TABLE kb_embeddings IS 'Knowledge base embeddings for RAG-powered help chatbot';
