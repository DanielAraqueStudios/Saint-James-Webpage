CREATE TABLE IF NOT EXISTS categories (
  name TEXT PRIMARY KEY
);

INSERT INTO categories (name)
SELECT DISTINCT category FROM tracks
ON CONFLICT (name) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'tracks_category_fkey'
  ) THEN
    ALTER TABLE tracks
      ADD CONSTRAINT tracks_category_fkey FOREIGN KEY (category) REFERENCES categories(name);
  END IF;
END $$;
