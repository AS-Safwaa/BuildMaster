-- ─────────────────────────────────────────────────────────
-- Seed Data (use after running schema.sql)
-- Passwords are bcrypt hash of 'password123'
-- ─────────────────────────────────────────────────────────

INSERT INTO users (id, name, email, password, role) VALUES
  ('usr_admin_001', 'Admin User', 'admin@buildmaster.com', '$2a$12$LJ3m4ys3UFc/Z8eU6TdXVeQ1IjJHxGkDkf26ZoGPxMRuPR7m6kxSi', 'admin'),
  ('usr_merch_001', 'Sarah Miller', 'merchant@buildmaster.com', '$2a$12$LJ3m4ys3UFc/Z8eU6TdXVeQ1IjJHxGkDkf26ZoGPxMRuPR7m6kxSi', 'merchant'),
  ('usr_user_001', 'Alex Chen', 'user@buildmaster.com', '$2a$12$LJ3m4ys3UFc/Z8eU6TdXVeQ1IjJHxGkDkf26ZoGPxMRuPR7m6kxSi', 'user');

INSERT INTO projects (id, title, description, status, created_by) VALUES
  ('prj_001', 'HeartCare Clinic Website', 'Modern responsive website for HeartCare Advanced Clinic', 'active', 'usr_merch_001'),
  ('prj_002', 'Glow & Grace Salon', 'Elegant landing page for premium unisex salon', 'draft', 'usr_merch_001'),
  ('prj_003', 'Urban Threads Retail', 'E-commerce website for menswear brand', 'completed', 'usr_admin_001');

INSERT INTO configs (id, key, value, project_id) VALUES
  ('cfg_001', 'theme', 'dark', 'prj_001'),
  ('cfg_002', 'primaryColor', '#6366f1', 'prj_001'),
  ('cfg_003', 'fontFamily', 'Inter', 'prj_001'),
  ('cfg_004', 'theme', 'light', 'prj_002'),
  ('cfg_005', 'primaryColor', '#ec4899', 'prj_002'),
  ('cfg_006', 'layout', 'sidebar', 'prj_003');
