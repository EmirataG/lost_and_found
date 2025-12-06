-- Migration: Row-Level Security policies for messages and message_attachments
-- Run this in your Supabase SQL editor.

-- Enable RLS on messages
ALTER TABLE IF EXISTS messages ENABLE ROW LEVEL SECURITY;

-- Allow participants of a conversation to SELECT messages in that conversation
-- Allow participants of a conversation to SELECT messages in that conversation
DROP POLICY IF EXISTS "select_messages_for_participants" ON messages;
CREATE POLICY "select_messages_for_participants" ON messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = messages.conversation_id AND cp.user_id = auth.uid()
    )
  );

-- Allow authenticated users to INSERT messages only when sender_id matches them and they are a participant
-- Allow authenticated users to INSERT messages only when sender_id matches them and they are a participant
DROP POLICY IF EXISTS "insert_own_messages_if_participant" ON messages;
CREATE POLICY "insert_own_messages_if_participant" ON messages
  FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = messages.conversation_id AND cp.user_id = auth.uid()
    )
  );

-- Allow message owners to UPDATE/DELETE their messages
-- Allow message owners to UPDATE/DELETE their messages
DROP POLICY IF EXISTS "modify_own_messages_update" ON messages;
CREATE POLICY "modify_own_messages_update" ON messages
  FOR UPDATE
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

DROP POLICY IF EXISTS "modify_own_messages_delete" ON messages;
CREATE POLICY "modify_own_messages_delete" ON messages
  FOR DELETE
  USING (sender_id = auth.uid());

-- Enable RLS on message_attachments
ALTER TABLE IF EXISTS message_attachments ENABLE ROW LEVEL SECURITY;

-- Allow participants to SELECT attachments when they can see the underlying message
-- Allow participants to SELECT attachments when they can see the underlying message
DROP POLICY IF EXISTS "select_attachments_for_participants" ON message_attachments;
CREATE POLICY "select_attachments_for_participants" ON message_attachments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM messages m
      JOIN conversation_participants cp ON cp.conversation_id = m.conversation_id
      WHERE m.id = message_attachments.message_id AND cp.user_id = auth.uid()
    )
  );

-- Allow inserting attachments only when the attachment's message belongs to the authenticated user (message sender)
-- Allow inserting attachments only when the attachment's message belongs to the authenticated user (message sender)
DROP POLICY IF EXISTS "insert_attachments_for_own_messages" ON message_attachments;
CREATE POLICY "insert_attachments_for_own_messages" ON message_attachments
  FOR INSERT
  WITH CHECK (
    (SELECT sender_id FROM messages WHERE id = message_attachments.message_id) = auth.uid()
  );

-- Allow deleting attachments by message owner
-- Allow deleting attachments by message owner
DROP POLICY IF EXISTS "delete_attachments_by_message_owner" ON message_attachments;
CREATE POLICY "delete_attachments_by_message_owner" ON message_attachments
  FOR DELETE
  USING (
    (SELECT sender_id FROM messages WHERE id = message_attachments.message_id) = auth.uid()
  );
