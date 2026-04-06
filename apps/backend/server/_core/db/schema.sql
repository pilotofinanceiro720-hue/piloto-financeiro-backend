-- ============================================================================
-- PILOTO FINANCEIRO — SCHEMA POSTGRESQL COMPLETO
-- ============================================================================

-- USUÁRIOS E AUTENTICAÇÃO
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  google_id VARCHAR(255) UNIQUE,
  avatar_url TEXT,
  plan VARCHAR(20) DEFAULT 'free', -- free, basico, essencial, premium
  plan_status VARCHAR(20) DEFAULT 'inactive', -- active, inactive, cancelled
  asaas_customer_id VARCHAR(100),
  referral_code VARCHAR(20) UNIQUE,
  referred_by INTEGER REFERENCES users(id),
  is_admin BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  lgpd_consent BOOLEAN DEFAULT FALSE,
  lgpd_consent_at TIMESTAMP,
  notification_listener_consent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- VEÍCULO DO MOTORISTA
CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  brand VARCHAR(100),
  model VARCHAR(100),
  year INTEGER,
  fuel_type VARCHAR(20), -- gasolina, etanol, flex, eletrico, hibrido
  fuel_consumption DECIMAL(5,2), -- km/litro ou km/kWh
  fuel_price DECIMAL(8,2), -- preço atual do combustível
  monthly_payment DECIMAL(10,2), -- parcela do financiamento
  insurance_monthly DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- METAS DO MOTORISTA
CREATE TABLE IF NOT EXISTS driver_goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  daily_goal DECIMAL(10,2), -- meta de ganho diário
  monthly_goal DECIMAL(10,2), -- meta de ganho mensal
  min_rate_per_km DECIMAL(8,2), -- mínimo R$/km aceitável
  min_rate_per_hour DECIMAL(8,2), -- mínimo R$/hora aceitável
  working_days_per_month INTEGER DEFAULT 22,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- CORRIDAS
CREATE TABLE IF NOT EXISTS rides (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- uber, 99, loggi, indriver, particular
  gross_value DECIMAL(10,2) NOT NULL,
  net_value DECIMAL(10,2),
  distance_km DECIMAL(8,2),
  duration_minutes INTEGER,
  rate_per_km DECIMAL(8,2),
  rate_per_hour DECIMAL(8,2),
  multiplier DECIMAL(5,2) DEFAULT 1.0,
  region VARCHAR(255),
  city VARCHAR(100),
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  source VARCHAR(20) DEFAULT 'manual', -- manual, automatic (notification)
  raw_notification TEXT, -- texto original da notificação
  below_goal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- DESPESAS
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL, -- combustivel, alimentacao, manutencao, estacionamento, limpeza, outros
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  expense_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- JORNADA DIÁRIA
CREATE TABLE IF NOT EXISTS daily_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active', -- active, paused, closed
  paused_at TIMESTAMP,
  total_rides INTEGER DEFAULT 0,
  total_gross DECIMAL(10,2) DEFAULT 0,
  total_net DECIMAL(10,2) DEFAULT 0,
  total_km DECIMAL(8,2) DEFAULT 0,
  total_expenses DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  UNIQUE(user_id, session_date)
);

-- EVENTOS DA CIDADE
CREATE TABLE IF NOT EXISTS city_events (
  id SERIAL PRIMARY KEY,
  city VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  venue VARCHAR(255),
  expected_attendance INTEGER,
  tier INTEGER DEFAULT 2, -- 1: >15k pessoas, 2: 5k-15k, 3: <5k
  event_date DATE NOT NULL,
  event_time TIME,
  source VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ASSINATURAS
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  asaas_subscription_id VARCHAR(100) UNIQUE,
  plan VARCHAR(20) NOT NULL,
  billing_cycle VARCHAR(20) DEFAULT 'monthly', -- monthly, semiannual, annual
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, active, overdue, cancelled
  starts_at TIMESTAMP,
  next_billing_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- COMISSÕES DE REFERRAL
CREATE TABLE IF NOT EXISTS referral_commissions (
  id SERIAL PRIMARY KEY,
  referrer_id INTEGER REFERENCES users(id),
  referred_id INTEGER REFERENCES users(id),
  subscription_id INTEGER REFERENCES subscriptions(id),
  commission_rate DECIMAL(5,2), -- 20, 25 ou 30%
  amount DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, paid
  confirmed_at TIMESTAMP, -- só confirma após pagamento real
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PARCEIROS (Camada 2+)
CREATE TABLE IF NOT EXISTS partners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  logo_url TEXT,
  website_url TEXT,
  affiliate_url TEXT,
  commission_type VARCHAR(20), -- fixed, percentage
  commission_value DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- CAMPANHAS (Camada 2+)
CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  partner_id INTEGER REFERENCES partners(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_plan VARCHAR(20), -- basico, essencial, premium, all
  starts_at TIMESTAMP,
  ends_at TIMESTAMP,
  budget DECIMAL(10,2),
  spent DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW()
);

-- SCORE DO MOTORISTA (calculado mensalmente)
CREATE TABLE IF NOT EXISTS driver_scores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  month DATE NOT NULL, -- primeiro dia do mês
  score INTEGER, -- 0-100
  rides_above_goal_pct DECIMAL(5,2),
  growth_vs_last_month DECIMAL(8,2),
  consistency_pct DECIMAL(5,2),
  goal_reached_pct DECIMAL(5,2),
  total_gross DECIMAL(10,2),
  total_net DECIMAL(10,2),
  total_rides INTEGER,
  best_day DATE,
  best_region VARCHAR(255),
  best_hour INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- NOTIFICAÇÕES
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT,
  read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- FRAUD DETECTION
CREATE TABLE IF NOT EXISTS fraud_flags (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  type VARCHAR(50), -- multiple_accounts, fake_referral, churn_abuse
  score INTEGER DEFAULT 0,
  details JSONB,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- FEATURE FLAGS
CREATE TABLE IF NOT EXISTS feature_flags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT FALSE,
  tier INTEGER DEFAULT 1, -- 1, 2, 3 ou 4
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_rides_user_id ON rides(user_id);
CREATE INDEX IF NOT EXISTS idx_rides_created_at ON rides(created_at);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_daily_sessions_user_id ON daily_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
