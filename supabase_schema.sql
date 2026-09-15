-- ==============================================================================
-- DAHAB GROOMING LOUNGE - SUPABASE DATABASE SCHEMA & INITIAL SEED
-- ==============================================================================
-- Instructions:
-- 1. Open your Supabase project dashboard (https://supabase.com/dashboard)
-- 2. Click on "SQL Editor" in the left navigation sidebar
-- 3. Click "New Query", paste this entire script, and click "RUN"
-- ==============================================================================

-- 1. Users Table (Customers, Barbers, Admins)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  phone_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'BARBER', 'ADMIN')),
  password_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Customers Profile & Loyalty Progress
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  member_code TEXT UNIQUE NOT NULL,
  current_cycle INTEGER NOT NULL DEFAULT 1,
  current_visits INTEGER NOT NULL DEFAULT 0,
  lifetime_visits INTEGER NOT NULL DEFAULT 0,
  tier TEXT NOT NULL DEFAULT 'BRONZE' CHECK (tier IN ('BRONZE', 'SILVER', 'GOLD', 'ROYAL VIP')),
  notes TEXT,
  last_visit_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Visits Log
CREATE TABLE IF NOT EXISTS public.visits (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  cycle_number INTEGER NOT NULL DEFAULT 1,
  visit_index_in_cycle INTEGER NOT NULL DEFAULT 1,
  service_name TEXT NOT NULL,
  barber_name TEXT,
  price NUMERIC(10, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Loyalty Rewards & Vouchers
CREATE TABLE IF NOT EXISTS public.rewards (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  customer_name TEXT,
  customer_phone TEXT,
  voucher_code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cycle_number INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'PENDING_APPROVAL', 'REDEEMED', 'REJECTED', 'EXPIRED')),
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  redeemed_at TIMESTAMPTZ,
  redeemed_by TEXT,
  selected_service TEXT,
  selected_service_price NUMERIC(10, 2),
  rejection_reason TEXT,
  requested_at TIMESTAMPTZ
);

-- 5. Loyalty Program Settings
CREATE TABLE IF NOT EXISTS public.loyalty_rules (
  id TEXT PRIMARY KEY,
  target_visits INTEGER NOT NULL DEFAULT 5,
  reward_title TEXT NOT NULL DEFAULT 'Free Signature Haircut',
  reward_desc TEXT NOT NULL DEFAULT 'Enjoy a complimentary signature haircut with refreshing hot towel finish.',
  shop_name TEXT NOT NULL DEFAULT 'DAHAB Grooming Lounge',
  phone_prefix TEXT NOT NULL DEFAULT '+20',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Barbers / Stylists
CREATE TABLE IF NOT EXISTS public.barbers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT '',
  specialty TEXT NOT NULL,
  rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0
);

-- 7. Services Catalog
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('HAIRCUT', 'BEARD', 'TREATMENT', 'PACKAGE')),
  duration TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  popular BOOLEAN NOT NULL DEFAULT FALSE
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone_number);
CREATE INDEX IF NOT EXISTS idx_customers_member_code ON public.customers(member_code);
CREATE INDEX IF NOT EXISTS idx_visits_customer_id ON public.visits(customer_id);
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON public.visits(created_at);
CREATE INDEX IF NOT EXISTS idx_rewards_customer_id ON public.rewards(customer_id);
CREATE INDEX IF NOT EXISTS idx_rewards_voucher_code ON public.rewards(voucher_code);
CREATE INDEX IF NOT EXISTS idx_rewards_status ON public.rewards(status);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Allow public read access to barbers, services, loyalty rules
CREATE POLICY "Public Read Barbers" ON public.barbers FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public Read Loyalty Rules" ON public.loyalty_rules FOR SELECT USING (true);
CREATE POLICY "Public Read Customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Public Read Visits" ON public.visits FOR SELECT USING (true);
CREATE POLICY "Public Read Rewards" ON public.rewards FOR SELECT USING (true);
CREATE POLICY "Public Read Users" ON public.users FOR SELECT USING (true);

-- Allow full access for anon/service_role clients (Admin backend APIs handle authorization)
CREATE POLICY "Allow All Users Mutate" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Customers Mutate" ON public.customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Visits Mutate" ON public.visits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Rewards Mutate" ON public.rewards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Loyalty Mutate" ON public.loyalty_rules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Barbers Mutate" ON public.barbers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Services Mutate" ON public.services FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================
-- 1. Admin User
INSERT INTO public.users (id, phone_number, full_name, email, role, password_hash, created_at)
VALUES ('user-admin', '01000000000', 'Dahab Admin Master', 'admin@dahabbarbershop.com', 'ADMIN', 'admin123', NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. Loyalty Rule
INSERT INTO public.loyalty_rules (id, target_visits, reward_title, reward_desc, shop_name, phone_prefix, is_active, updated_at)
VALUES ('rule-default-1', 5, 'Free Signature Haircut', 'Enjoy a complimentary signature haircut with refreshing hot towel finish.', 'DAHAB Grooming Lounge', '+20', TRUE, NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. Barbers
INSERT INTO public.barbers (id, name, role, avatar, specialty, rating)
VALUES 
  ('barber-1', 'Tarek "The Master" El-Sayed', 'Head Stylist & Founder', '', 'Classic Tapers, Scissor Fades & Royal Shaves', 4.90),
  ('barber-2', 'Karim Mostafa', 'Senior Barber', '', 'Beard Sculpting, Razor Lineups & Skin Fades', 4.80),
  ('barber-3', 'Ziad Mansour', 'Precision Stylist', '', 'Modern Textured Crops & Hair Spa Treatments', 4.90),
  ('barber-4', 'Omar Reda', 'Master Groomer', '', 'Hot Towel Rituals & Charcoal Detox', 4.70)
ON CONFLICT (id) DO NOTHING;

-- 4. Services
INSERT INTO public.services (id, name, category, duration, price, description, popular)
VALUES 
  ('srv-1', 'Dahab Signature Haircut', 'HAIRCUT', '40 min', 350.00, 'Precision cut, neck shave, invigorating wash, and styling with premium pomade.', TRUE),
  ('srv-2', 'Haircut + Royal Beard Sculpt', 'PACKAGE', '60 min', 550.00, 'Signature haircut combined with hot towel steam beard trim and razor outline.', TRUE),
  ('srv-3', 'Royal Beard Sculpt & Hot Towel', 'BEARD', '30 min', 250.00, 'Hot lather steam, straight razor edge lining, organic beard oil treatment.', FALSE),
  ('srv-4', 'Dahab VIP Ritual Experience', 'PACKAGE', '80 min', 850.00, 'Haircut, beard sculpt, deep purifying charcoal facial, eye mask, and espresso.', TRUE),
  ('srv-5', 'Charcoal Face Detox & Scrub', 'TREATMENT', '25 min', 220.00, 'Exfoliating black mask, steam extraction, and refreshing botanical toner.', FALSE)
ON CONFLICT (id) DO NOTHING;
