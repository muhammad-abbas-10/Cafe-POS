CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(12, 2) NOT NULL CHECK (price >= 0),
  image_url text,
  is_drink boolean NOT NULL DEFAULT true,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS menu_items_category_id_idx ON menu_items (category_id);

CREATE TABLE IF NOT EXISTS ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  unit text NOT NULL,
  stock_qty numeric(12, 3) NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  threshold numeric(12, 3) NOT NULL DEFAULT 0 CHECK (threshold >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  price numeric(12, 2) NOT NULL CHECK (price >= 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'manager', 'cashier')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid NOT NULL REFERENCES staff(id) ON DELETE RESTRICT,
  clock_in timestamptz NOT NULL DEFAULT now(),
  clock_out timestamptz,
  till_start numeric(12, 2),
  till_end numeric(12, 2),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS shifts_staff_id_idx ON shifts (staff_id);
CREATE UNIQUE INDEX IF NOT EXISTS shifts_one_open_per_staff_idx
  ON shifts (staff_id) WHERE clock_out IS NULL;

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  order_type text NOT NULL CHECK (order_type IN ('dine-in', 'takeaway', 'delivery')),
  table_or_address text,
  status text NOT NULL DEFAULT 'completed'
    CONSTRAINT orders_status_check CHECK (status IN ('draft', 'completed', 'voided', 'refunded')),
  staff_id uuid REFERENCES staff(id) ON DELETE SET NULL,
  subtotal numeric(12, 2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee numeric(12, 2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  tax numeric(12, 2) NOT NULL DEFAULT 0 CHECK (tax >= 0),
  total numeric(12, 2) NOT NULL CHECK (total >= 0),
  payment_method text NOT NULL CHECK (payment_method IN ('cash', 'card', 'e-wallet', 'split')),
  payment_details jsonb NOT NULL DEFAULT '{}'::jsonb,
  receipt_settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);

CREATE TABLE IF NOT EXISTS order_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE SET NULL,
  name_snapshot text NOT NULL,
  unit_price_snapshot numeric(12, 2) NOT NULL CHECK (unit_price_snapshot >= 0),
  qty integer NOT NULL CHECK (qty > 0),
  size text,
  temperature text,
  sugar text,
  ice text,
  note text NOT NULL DEFAULT '',
  line_total numeric(12, 2) NOT NULL CHECK (line_total >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS order_lines_order_id_idx ON order_lines (order_id);

CREATE TABLE IF NOT EXISTS order_line_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_line_id uuid NOT NULL REFERENCES order_lines(id) ON DELETE CASCADE,
  addon_id uuid REFERENCES addons(id) ON DELETE SET NULL,
  price_snapshot numeric(12, 2) NOT NULL CHECK (price_snapshot >= 0)
);

CREATE INDEX IF NOT EXISTS order_line_addons_line_id_idx
  ON order_line_addons (order_line_id);

CREATE TABLE IF NOT EXISTS inventory_adjustments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ingredient_id uuid NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
  delta numeric(12, 3) NOT NULL CHECK (delta <> 0),
  reason text NOT NULL,
  staff_id uuid REFERENCES staff(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS inventory_adjustments_ingredient_id_idx
  ON inventory_adjustments (ingredient_id);

CREATE TABLE IF NOT EXISTS settings (
  key text PRIMARY KEY,
  value text NOT NULL
);
