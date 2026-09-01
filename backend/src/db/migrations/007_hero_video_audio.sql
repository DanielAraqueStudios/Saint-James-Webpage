ALTER TABLE hero_video
  ADD COLUMN IF NOT EXISTS muted BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS volume REAL NOT NULL DEFAULT 1;

ALTER TABLE hero_video
  DROP CONSTRAINT IF EXISTS hero_video_volume_range;

ALTER TABLE hero_video
  ADD CONSTRAINT hero_video_volume_range CHECK (volume >= 0 AND volume <= 1);
