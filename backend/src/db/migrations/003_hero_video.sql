CREATE TABLE IF NOT EXISTS hero_video (
  id INTEGER PRIMARY KEY DEFAULT 1,
  video_url TEXT NOT NULL,
  format TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT hero_video_single_row CHECK (id = 1)
);

INSERT INTO hero_video (id, video_url, format)
VALUES (1, 'https://assets.codepen.io/3364143/7btrrd.mp4', 'mp4')
ON CONFLICT (id) DO NOTHING;
