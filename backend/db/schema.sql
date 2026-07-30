-- schema.sql — JAE JD Creator Database Schema

DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS jds CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'LOB_HR',
  lob VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE jds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES users(id),
  lob VARCHAR(50),
  status VARCHAR(20) DEFAULT 'DRAFT',
  wizard_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  generated_jd JSONB,
  compliance_score INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  finalized_at TIMESTAMP
);

CREATE INDEX idx_jds_lob ON jds(lob);
CREATE INDEX idx_jds_created_by ON jds(created_by);
CREATE INDEX idx_jds_status ON jds(status);

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jd_id UUID REFERENCES jds(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  metadata JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_jd_id ON audit_log(jd_id);
CREATE INDEX idx_audit_created_at ON audit_log(created_at);

INSERT INTO users (email, name, role, lob)
VALUES ('avinash.naidu@dev.local', 'Avinash Naidu', 'CENTRAL_HR', 'AMC');

-- ============================================

-- COMMITTEES — JAE debate sessions

-- ============================================

CREATE TABLE IF NOT EXISTS committees (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  jd_id UUID REFERENCES jds(id) ON DELETE CASCADE,

  status VARCHAR(20) DEFAULT 'PENDING',

  nuances JSONB,

  agents JSONB,

  transcript JSONB DEFAULT '[]'::jsonb,

  current_round INT DEFAULT 0,

  scores JSONB,

  final_verdict JSONB,

  created_at TIMESTAMP DEFAULT NOW(),

  updated_at TIMESTAMP DEFAULT NOW(),

  completed_at TIMESTAMP

);


CREATE INDEX IF NOT EXISTS idx_committees_jd_id ON committees(jd_id);

CREATE INDEX IF NOT EXISTS idx_committees_status ON committees(status);
 