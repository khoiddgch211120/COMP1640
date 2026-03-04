-- COMP1640 Database Initialization Script

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS comp1640;
USE comp1640;

-- Insert initial roles
INSERT INTO role (role_name, description) VALUES 
('ADMIN', 'Administrator'),
('ACADEMIC', 'Academic Staff'),
('SUPPORT', 'Support Staff'),
('STUDENT', 'Student')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Insert initial departments
INSERT INTO department (dept_name, dept_type, created_at) VALUES 
('IT Department', 'Academic', NOW()),
('Business Department', 'Academic', NOW()),
('Marketing Department', 'Support', NOW()),
('HR Department', 'Support', NOW())
ON DUPLICATE KEY UPDATE dept_name = VALUES(dept_name);

-- Insert sample user (password: password123)
INSERT INTO user (dept_id, role_id, full_name, email, password_hash, staff_type, is_active, created_at) VALUES 
(1, 1, 'Admin User', 'admin@comp1640.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.aS5lZqibNC9.f.seFy', 'Full-time', TRUE, NOW()),
(1, 2, 'John Academic', 'john@comp1640.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.aS5lZqibNC9.f.seFy', 'Full-time', TRUE, NOW()),
(2, 3, 'Jane Support', 'jane@comp1640.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.aS5lZqibNC9.f.seFy', 'Full-time', TRUE, NOW())
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- Insert sample academic year
INSERT INTO academic_year (created_by, year_label, idea_closure_date, final_closure_date, created_at) VALUES 
(1, '2024-2025', '2025-06-30', '2025-07-31', NOW())
ON DUPLICATE KEY UPDATE year_label = VALUES(year_label);

-- Insert sample categories
INSERT INTO category (created_by, category_name, description, is_used, created_at) VALUES 
(1, 'Academic', 'Related to academic matters', FALSE, NOW()),
(1, 'Infrastructure', 'Related to campus infrastructure', FALSE, NOW()),
(1, 'Student Life', 'Related to student activities', FALSE, NOW()),
(1, 'Technology', 'Related to technology and IT', FALSE, NOW())
ON DUPLICATE KEY UPDATE category_name = VALUES(category_name);

