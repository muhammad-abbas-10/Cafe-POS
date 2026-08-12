DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'item_ingredients' AND column_name = 'qty_used'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'item_ingredients' AND column_name = 'quantity'
  ) THEN
    ALTER TABLE item_ingredients RENAME COLUMN qty_used TO quantity;
  END IF;
END $$;
