-- ====================================================================
-- RURAL WORK CONNECT: Seed Data & Initial Skills Directory
-- Migration: 20261025000003_seed_data.sql
-- ====================================================================

-- 1. Standard Indian Rural Work Skills Seed
INSERT INTO public.skills (name, category, icon_name) VALUES
-- Agriculture and Farm Work
('Paddy Harvesting', 'Agriculture and Farm Work', 'wheat'),
('Sowing & Planting', 'Agriculture and Farm Work', 'sprout'),
('Field Weeding & De-weeding', 'Agriculture and Farm Work', 'scissors'),
('Drip & Canal Irrigation', 'Agriculture and Farm Work', 'droplet'),
('Sugarcane Cutting', 'Agriculture and Farm Work', 'axe'),
('Cotton Picking', 'Agriculture and Farm Work', 'flower2'),
('Tractor Tilling & Ploughing', 'Agriculture and Farm Work', 'tractor'),

-- Construction and Masonry
('Bricklaying & Wall Masonry', 'Construction and Masonry', 'brick-wall'),
('Cement Plastering', 'Construction and Masonry', 'layers'),
('Centering & Steel Binding', 'Construction and Masonry', 'hammer'),
('Concrete Mixing & Pouring', 'Construction and Masonry', 'box'),
('Roof Tile Fixing', 'Construction and Masonry', 'home'),

-- Painting
('Interior Wall Painting', 'Painting', 'paint-bucket'),
('Exterior Weathercoat Painting', 'Painting', 'brush'),
('Traditional Whitewash / Chuna', 'Painting', 'spray-can'),

-- Plumbing
('PVC Pipe Fitting & Leak Repair', 'Plumbing', 'wrench'),
('Submersible Motor & Borewell Repair', 'Plumbing', 'activity'),
('Bathroom & Tap Installations', 'Plumbing', 'droplet'),

-- Electrical Work
('House Wiring & Fuse Repair', 'Electrical Work', 'zap'),
('Agricultural Pump Motor Repair', 'Electrical Work', 'cpu'),
('Ceiling Fan & Appliance Repair', 'Electrical Work', 'fan'),

-- Cleaning & Sanitation
('Farm & Yard Clearing', 'Cleaning', 'trash-2'),
('Drain & Waterway Clearing', 'Cleaning', 'waves'),
('Household Deep Cleaning', 'Cleaning', 'sparkles'),

-- Gardening & Landscaping
('Tree Pruning & Coconut Plucking', 'Gardening', 'tree-pine'),
('Lawn Mowing & Hedge Trimming', 'Gardening', 'scissors'),
('Vegetable Nursery Care', 'Gardening', 'flower'),

-- Loading and Unloading
('Grain Bag & Sack Loading (Lorry)', 'Loading and Unloading', 'package'),
('Sand & Brick Offloading', 'Loading and Unloading', 'truck'),
('Fertilizer Transport Handling', 'Loading and Unloading', 'archive'),

-- Driving
('Tractor Driving with Trolley', 'Driving', 'truck'),
('Auto Rickshaw & Goods Carrier', 'Driving', 'car'),
('Mini-Truck (Tata Ace/Bolero)', 'Driving', 'navigation'),

-- Cooking and Catering
('Rural Wedding / Festival Catering', 'Cooking and Catering', 'utensils'),
('Traditional South Indian Cooking', 'Cooking and Catering', 'coffee'),
('Sweet & Snack Making', 'Cooking and Catering', 'cake'),

-- Housekeeping & Domestic Help
('Cooking & Kitchen Assistance', 'Housekeeping', 'utensils-crossed'),
('Elderly Care Assistance', 'Housekeeping', 'heart'),
('Child Day Assistance', 'Housekeeping', 'smile'),

-- Delivery
('Local Grocery / Mandi Delivery', 'Delivery', 'bike'),
('Fertilizer & Seed Delivery', 'Delivery', 'package-check'),

-- Shop Assistance
('Kirana Store Cashier / Attendant', 'Shop Assistance', 'store'),
('Mandi Weighing & Packing', 'Shop Assistance', 'scale'),

-- General Labour
('Earth Excavation & Trenching', 'General Labour', 'shovel'),
('General Physical Labour', 'General Labour', 'user-check'),
('Fence Wire Installation', 'General Labour', 'shield')
ON CONFLICT (name) DO NOTHING;

-- 2. Helpful Comment on Admin Creation
COMMENT ON TABLE public.user_roles IS 'Stores user permissions. To designate an admin securely, run: INSERT INTO public.user_roles (user_id, role) VALUES (''<auth-user-uuid>'', ''admin'') ON CONFLICT DO NOTHING;';
