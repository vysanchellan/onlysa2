-- OnlySA Supabase Schema
-- Run this in the Supabase SQL Editor after creating your project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

/* ─── POSTS ─── */
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area TEXT NOT NULL,
  category TEXT NOT NULL,
  identity TEXT NOT NULL,
  content TEXT NOT NULL,
  session_token TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  upvotes INT NOT NULL DEFAULT 0,
  comments INT NOT NULL DEFAULT 0,
  upvoted_by TEXT[] NOT NULL DEFAULT '{}',
  gif_url TEXT,
  gif_preview TEXT,
  province TEXT,
  is_hot BOOLEAN NOT NULL DEFAULT false,
  approved BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_area ON posts(area);
CREATE INDEX IF NOT EXISTS idx_posts_upvotes ON posts(upvotes DESC);

/* ─── COMMENTS ─── */
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  identity TEXT NOT NULL,
  content TEXT NOT NULL,
  session_token TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);

/* ─── COMMENT UPVOTES ─── */
CREATE TABLE IF NOT EXISTS comment_upvotes (
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL,
  PRIMARY KEY (comment_id, session_token)
);

/* ─── IDENTITIES (for clout, streak, etc.) ─── */
CREATE TABLE IF NOT EXISTS identities (
  session_token TEXT PRIMARY KEY,
  clout INT NOT NULL DEFAULT 10,
  streak INT NOT NULL DEFAULT 1,
  last_post_date TEXT,
  identity TEXT NOT NULL DEFAULT 'SA Anonymous',
  identity_assigned_at TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

/* ─── BATTLES ─── */
CREATE TABLE IF NOT EXISTS battles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_session TEXT NOT NULL,
  challenger_identity TEXT NOT NULL,
  challenged_session TEXT NOT NULL,
  challenged_identity TEXT NOT NULL,
  topic TEXT NOT NULL,
  challenger_take TEXT NOT NULL,
  challenged_take TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'closed')),
  left_votes INT NOT NULL DEFAULT 0,
  right_votes INT NOT NULL DEFAULT 0,
  voter_sessions TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '2 hours'),
  winner_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_battles_status ON battles(status);

/* ─── COSIGNS ─── */
CREATE TABLE IF NOT EXISTS cosigns (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('cosign', 'cross')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, session_token)
);

CREATE INDEX IF NOT EXISTS idx_cosigns_post_id ON cosigns(post_id);

/* ─── NOTIFICATIONS ─── */
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_session ON notifications(session_token);

/* ─── THRONE ─── */
CREATE TABLE IF NOT EXISTS throne (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT NOT NULL,
  identity TEXT NOT NULL,
  clout INT NOT NULL DEFAULT 0,
  since TIMESTAMPTZ NOT NULL DEFAULT now(),
  best_post_upvotes INT NOT NULL DEFAULT 0
);

/* ─── SEED DEFAULT POSTS ─── */
INSERT INTO posts (id, area, category, identity, content, upvotes, comments, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Umhlanga', 'Hot Take', 'ANON 992', 'Hot take: Woolies water doesn''t even taste that good. You guys are just paying for the aesthetic bottle.', 215, 84, now() - interval '2 hours'),
  ('00000000-0000-0000-0000-000000000002', 'Durban CBD', 'Confession', 'Durban Local', 'I''ve lived in Durban my whole life and I''ve never actually been to uShaka Marine World.', 89, 23, now() - interval '5 hours'),
  ('00000000-0000-0000-0000-000000000003', 'Westville', 'Rant', 'Westville Resident', 'The N3 at 7am should be classified as a form of psychological torture.', 134, 41, now() - interval '8 hours'),
  ('00000000-0000-0000-0000-000000000004', 'PMB', 'Review', 'PMB Voice', 'Genuinely shocked by how good the food at that new spot on Loop Street is.', 28, 7, now() - interval '12 hours'),
  ('00000000-0000-0000-0000-000000000005', 'Ballito', 'Hot Take', 'Ballito Local', 'Ballito is what happens when people from Joburg try to build a Joburg with an ocean.', 62, 19, now() - interval '18 hours'),
  ('00000000-0000-0000-0000-000000000006', 'Durban CBD', 'Neighbourhood Watch', 'SA Anonymous', 'The beachfront at night is actually safe now compared to 5 years ago.', 91, 15, now() - interval '1 day'),
  ('00000000-0000-0000-0000-000000000007', 'Umhlanga', 'Confession', 'KZN Resident', 'I judge people based on which mall they prefer. Gateway people and Pavilion people are fundamentally different.', 203, 67, now() - interval '1.5 days'),
  ('00000000-0000-0000-0000-000000000008', 'Johannesburg', 'Rant', 'Joburg Local', 'Load shedding during a work call is a form of corporate humiliation.', 156, 34, now() - interval '2 days'),
  ('00000000-0000-0000-0000-000000000009', 'Cape Town', 'Hot Take', 'Cape Town Voice', 'Cape Town taxi drivers are the best drivers in the country and I will not be elaborating further.', 178, 52, now() - interval '2 days'),
  ('00000000-0000-0000-0000-00000000000a', 'Berea', 'Question', 'Durban Local', 'Why does every Durban restaurant have a bunny chow on the menu now but none of them can touch what a proper Indian family makes at home?', 44, 29, now() - interval '2.5 days'),
  ('00000000-0000-0000-0000-00000000000b', 'Cape Town CBD', 'Question', 'ANON 119', 'Does anyone else''s Checkers Sixty60 guy sound like he''s auditioning for Fast & Furious when he pulls up?', 89, 5, now() - interval '1 hour'),
  ('00000000-0000-0000-0000-00000000000c', 'Johannesburg', 'Confession', 'ANON 441', 'We are alive by the grace of God alone.', 42, 3, now() - interval '30 minutes')
ON CONFLICT (id) DO NOTHING;
