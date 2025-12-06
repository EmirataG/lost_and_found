-- Migration: allow NULL message bodies and create message_attachments table
-- Run this in your Supabase SQL editor.

-- Ensure pgcrypto is available for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Allow messages.body to be NULL so attachment-only messages are possible
ALTER TABLE IF EXISTS messages ALTER COLUMN body DROP NOT NULL;

-- Create message_attachments table if it doesn't exist
CREATE TABLE IF NOT EXISTS message_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  url text NOT NULL,
  filename text,
  content_type text,
  created_at timestamptz DEFAULT now()
);

-- Index for fast lookup by message_id
CREATE INDEX IF NOT EXISTS idx_message_attachments_message_id ON message_attachments(message_id);
