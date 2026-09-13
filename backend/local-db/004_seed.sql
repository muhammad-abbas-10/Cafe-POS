INSERT INTO categories (id, name, sort_order) VALUES
  ('00000000-0000-4000-8000-000000000001', 'Coffee', 1),
  ('00000000-0000-4000-8000-000000000002', 'Cold drinks', 2),
  ('00000000-0000-4000-8000-000000000003', 'Food', 3),
  ('00000000-0000-4000-8000-000000000004', 'Desserts', 4)
ON CONFLICT DO NOTHING;

INSERT INTO menu_items
  (category_id, name, description, price, image_url, is_drink, is_available)
VALUES
  ('00000000-0000-4000-8000-000000000001', 'Espresso', 'Rich single espresso', 300, NULL, true, true),
  ('00000000-0000-4000-8000-000000000001', 'Cappuccino', 'Espresso with steamed milk', 450, NULL, true, true),
  ('00000000-0000-4000-8000-000000000001', 'Matcha latte', 'Matcha with steamed milk', 500, NULL, true, true),
  ('00000000-0000-4000-8000-000000000001', 'Hot chocolate', 'Creamy hot chocolate', 450, NULL, true, true),
  ('00000000-0000-4000-8000-000000000002', 'Cold brew', 'Slow-steeped cold coffee', 450, NULL, true, true),
  ('00000000-0000-4000-8000-000000000002', 'Orange juice', 'Fresh orange juice', 350, NULL, true, true),
  ('00000000-0000-4000-8000-000000000002', 'Green juice', 'Fresh mixed green juice', 400, NULL, true, true),
  ('00000000-0000-4000-8000-000000000003', 'Butter croissant', 'Flaky butter croissant', 300, NULL, false, true),
  ('00000000-0000-4000-8000-000000000003', 'Rice bowl', 'House rice bowl', 650, NULL, false, true),
  ('00000000-0000-4000-8000-000000000003', 'Egg fried rice', 'Fried rice with egg', 600, NULL, false, true),
  ('00000000-0000-4000-8000-000000000004', 'Cheesecake', 'Classic cheesecake slice', 450, NULL, false, true),
  ('00000000-0000-4000-8000-000000000004', 'Fudge brownie', 'Chocolate fudge brownie', 350, NULL, false, true),
  ('00000000-0000-4000-8000-000000000004', 'Tiramisu', 'Coffee-flavoured Italian dessert', 500, NULL, false, true)
ON CONFLICT DO NOTHING;

INSERT INTO addons (name, price, active) VALUES
  ('Extra espresso shot', 100, true),
  ('Oat milk', 100, true),
  ('Vanilla syrup', 75, true)
ON CONFLICT DO NOTHING;

INSERT INTO ingredients (name, unit, stock_qty, threshold) VALUES
  ('Coffee beans', 'g', 5000, 500),
  ('Milk', 'ml', 10000, 1000),
  ('Matcha powder', 'g', 1000, 100),
  ('Chocolate', 'g', 2000, 200)
ON CONFLICT DO NOTHING;

INSERT INTO staff (name, role, active) VALUES
  ('Local Admin', 'admin', true),
  ('Local Cashier', 'cashier', true);

INSERT INTO settings (key, value) VALUES
  ('tax_rate', '8'),
  ('delivery_fee', '250'),
  ('biz_name', 'Local Cafe'),
  ('biz_address', 'Local development'),
  ('biz_phone', ''),
  ('hours', '7:00 - 22:00'),
  ('printer', 'No printer (digital receipts only)')
ON CONFLICT (key) DO NOTHING;
