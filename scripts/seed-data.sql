-- Seed data for Pharmaceutical Purchase Management System

-- Insert demo users
INSERT INTO users (email, password_hash, name, role) VALUES
('admin@pharma.com', '$2b$10$hash_for_admin123', 'Admin User', 'admin'),
('warehouse@pharma.com', '$2b$10$hash_for_warehouse123', 'Warehouse Manager', 'warehouse'),
('pharmacy@pharma.com', '$2b$10$hash_for_pharmacy123', 'Pharmacy Staff', 'pharmacy'),
('warehouse2@pharma.com', '$2b$10$hash_for_warehouse2', 'North Warehouse Manager', 'warehouse'),
('pharmacy2@pharma.com', '$2b$10$hash_for_pharmacy2', 'City Pharmacy Staff', 'pharmacy')
ON CONFLICT (email) DO NOTHING;

-- Insert warehouses
INSERT INTO warehouses (code, name, address, manager_id) VALUES
('WH-001', 'Central Warehouse', '123 Main St, Central City', 2),
('WH-002', 'North Warehouse', '456 North Ave, North City', 4),
('WH-003', 'South Warehouse', '789 South Blvd, South City', 2),
('WH-004', 'East Warehouse', '321 East St, East City', 2)
ON CONFLICT (code) DO NOTHING;

-- Insert products
INSERT INTO products (code, name, description, category, manufacturer
