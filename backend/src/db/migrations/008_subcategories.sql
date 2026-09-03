ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS parent_name TEXT REFERENCES categories(name) ON DELETE SET NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'categories_no_self_parent'
  ) THEN
    ALTER TABLE categories
      ADD CONSTRAINT categories_no_self_parent CHECK (parent_name IS DISTINCT FROM name);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_categories_parent_name ON categories(parent_name);
