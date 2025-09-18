/*
  # Insert Sample Data for Development

  1. Sample Categories
    - Electronics
    - Fashion
    - Home & Garden

  2. Sample Incentive Settings
    - Different commission tiers with various thresholds and rates

  3. Notes
    - This is for development/demo purposes
    - In production, you might want to skip this or have different initial data
*/

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
  ('Electronics', 'Electronic devices and gadgets'),
  ('Fashion', 'Clothing and accessories'),
  ('Home & Garden', 'Home improvement and gardening products')
ON CONFLICT (name) DO NOTHING;

-- Insert sample incentive settings
INSERT INTO incentive_settings (commission_tier, threshold_amount, incentive_rate) VALUES
  ('Standard (5-7.99%)', 80000000, 0.4),
  ('Standard (5-7.99%)', 90000000, 0.6),
  ('Standard (5-7.99%)', 100000000, 0.8),
  ('Standard (5-7.99%)', 110000000, 1.0),
  ('Standard (5-7.99%)', 120000000, 1.2),
  ('Standard (5-7.99%)', 130000000, 1.5),
  ('High (8%+)', 50000000, 0.4),
  ('High (8%+)', 60000000, 0.6),
  ('High (8%+)', 70000000, 0.8),
  ('High (8%+)', 80000000, 1.0),
  ('High (8%+)', 90000000, 1.2),
  ('High (8%+)', 100000000, 1.5)
ON CONFLICT (commission_tier, threshold_amount) DO NOTHING;