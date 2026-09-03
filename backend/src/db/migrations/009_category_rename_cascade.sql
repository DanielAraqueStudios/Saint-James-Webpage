-- Renaming a category/subcategory needs the rename to propagate to
-- tracks.category and to any subcategories' parent_name, since both are
-- keyed by categories.name (no surrogate id). Re-add both FKs with
-- ON UPDATE CASCADE so a single UPDATE categories SET name = ... does that.

ALTER TABLE tracks DROP CONSTRAINT IF EXISTS tracks_category_fkey;
ALTER TABLE tracks
  ADD CONSTRAINT tracks_category_fkey FOREIGN KEY (category) REFERENCES categories(name) ON UPDATE CASCADE;

ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_parent_name_fkey;
ALTER TABLE categories
  ADD CONSTRAINT categories_parent_name_fkey FOREIGN KEY (parent_name) REFERENCES categories(name)
    ON UPDATE CASCADE ON DELETE SET NULL;
