CREATE TABLE IF NOT EXISTS producers (
  slug       TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  full_name  TEXT NOT NULL,
  role       TEXT NOT NULL,
  image_url  TEXT NOT NULL,
  bio        TEXT[] NOT NULL
);

CREATE TABLE IF NOT EXISTS tracks (
  id              SERIAL PRIMARY KEY,
  producer_slug   TEXT NOT NULL REFERENCES producers(slug) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  category        TEXT NOT NULL,
  filename        TEXT NOT NULL,
  format          TEXT NOT NULL CHECK (format IN ('wav', 'mp3')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id              SERIAL PRIMARY KEY,
  username        TEXT UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL
);
