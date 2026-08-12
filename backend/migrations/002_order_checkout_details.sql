ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_details jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS receipt_settings jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('draft', 'completed', 'voided', 'refunded'));
