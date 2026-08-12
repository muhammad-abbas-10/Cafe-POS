CREATE TABLE IF NOT EXISTS item_ingredients (
  menu_item_id uuid NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  ingredient_id uuid NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
  quantity numeric(12, 3) NOT NULL CHECK (quantity > 0),
  PRIMARY KEY (menu_item_id, ingredient_id)
);

CREATE INDEX IF NOT EXISTS item_ingredients_ingredient_id_idx
  ON item_ingredients (ingredient_id);
