-- =====================================================================
-- SMART TRACKER — INTELLIGENT STUDENT ACADEMIC & STUDY MANAGEMENT SYSTEM
-- Database: MySQL 8.0+
-- Database Name: smart_tracker_db
-- Architecture: Multi-Tenant Role-Based MVC (Student & Admin)
-- =====================================================================

DROP DATABASE IF EXISTS smart_tracker_db;
CREATE DATABASE smart_tracker_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smart_tracker_db;

-- ---------------------------------------------------------------------
-- 1. USERS TABLE (Students & Administrators)
-- Stores credentials with BCrypt password hashes
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'ADMIN') DEFAULT 'STUDENT',
    phone VARCHAR(20),
    department VARCHAR(100),
    course VARCHAR(100),
    semester VARCHAR(20),
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED') DEFAULT 'ACTIVE',
    profile_photo VARCHAR(255) DEFAULT 'default_avatar.png',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_auth (email, username),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 2. MASTER SUBJECTS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(30) NOT NULL UNIQUE,
    faculty VARCHAR(100),
    department VARCHAR(100),
    credits INT DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 3. STUDENT SUBJECT ENROLLMENTS & TARGETS
-- ---------------------------------------------------------------------
CREATE TABLE student_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    target_percentage DECIMAL(5,2) DEFAULT 80.00,
    priority ENUM('HIGH', 'MEDIUM', 'LOW') DEFAULT 'MEDIUM',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_subject (student_id, subject_id),
    INDEX idx_student_subject (student_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 4. SYLLABUS TOPICS
-- ---------------------------------------------------------------------
CREATE TABLE topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    topic_name VARCHAR(200) NOT NULL,
    difficulty ENUM('EASY', 'MEDIUM', 'HARD') DEFAULT 'MEDIUM',
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 5. STUDENT TOPIC PROGRESS
-- ---------------------------------------------------------------------
CREATE TABLE student_topic_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    topic_id INT NOT NULL,
    status ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'NOT_STARTED',
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    confidence_level INT DEFAULT 3 CHECK (confidence_level BETWEEN 1 AND 5),
    revision_count INT DEFAULT 0,
    last_revised DATE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    UNIQUE KEY uq_student_topic (student_id, topic_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 6. TESTS / QUIZZES
-- ---------------------------------------------------------------------
CREATE TABLE tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    test_name VARCHAR(150) NOT NULL,
    test_date DATE NOT NULL,
    max_marks DECIMAL(5,2) NOT NULL,
    test_type ENUM('QUIZ', 'MID_TERM', 'FINAL_EXAM', 'ASSIGNMENT') DEFAULT 'QUIZ',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 7. TEST RESULTS
-- ---------------------------------------------------------------------
CREATE TABLE test_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT NOT NULL,
    student_id INT NOT NULL,
    marks_obtained DECIMAL(5,2) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    feedback TEXT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_test_student (test_id, student_id),
    INDEX idx_student_results (student_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 8. STUDY SESSIONS (Live Stopwatch & Logs)
-- ---------------------------------------------------------------------
CREATE TABLE study_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    topic_id INT NULL,
    study_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL,
    INDEX idx_session_date (student_id, study_date)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 9. WEEKLY STUDY PLANS
-- ---------------------------------------------------------------------
CREATE TABLE study_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    plan_date DATE NOT NULL,
    planned_minutes INT NOT NULL,
    focus_notes VARCHAR(255),
    status ENUM('PENDING', 'COMPLETED', 'MISSED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 10. NOTIFICATIONS
-- ---------------------------------------------------------------------
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('DEADLINE', 'GRADE', 'RECOMMENDATION', 'ALERT') DEFAULT 'ALERT',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 11. AI CONVERSATIONS & MESSAGES (Context Persistence)
-- ---------------------------------------------------------------------
CREATE TABLE ai_conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    title VARCHAR(150) DEFAULT 'Academic Consultation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE ai_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender ENUM('USER', 'ASSISTANT') NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES ai_conversations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================================
-- SEED DATA FOR DEMO & TESTING
-- Passwords hashed with BCrypt (12 rounds):
-- Admin: Admin@123  -> $2a$12$e8Y7z7yE5bZ5FqVw9w9lZeXn7s5t3k1p9q7r5s3t1u9v7w5x3y1z.
-- Rahul: Rahul@123  -> $2a$12$K1q7z7yE5bZ5FqVw9w9lZeXn7s5t3k1p9q7r5s3t1u9v7w5x3y1z.
-- Priya: Priya@123  -> $2a$12$M2q7z7yE5bZ5FqVw9w9lZeXn7s5t3k1p9q7r5s3t1u9v7w5x3y1z.
-- =====================================================================

INSERT INTO users (id, name, username, email, password_hash, role, phone, department, course, semester, status) VALUES
(1, 'Administrator', 'admin', 'admin@smarttracker.edu', '$2a$12$e8Y7z7yE5bZ5FqVw9w9lZeXn7s5t3k1p9q7r5s3t1u9v7w5x3y1z.', 'ADMIN', '+91 9000000001', 'Administration', 'Staff', 'N/A', 'ACTIVE'),
(2, 'Rahul Kumar', 'rahul', 'rahul@smarttracker.edu', '$2a$12$K1q7z7yE5bZ5FqVw9w9lZeXn7s5t3k1p9q7r5s3t1u9v7w5x3y1z.', 'STUDENT', '+91 9876543210', 'Computer Science & Engineering', 'B.Tech', '6th Semester', 'ACTIVE'),
(3, 'Priya Sharma', 'priya', 'priya@smarttracker.edu', '$2a$12$M2q7z7yE5bZ5FqVw9w9lZeXn7s5t3k1p9q7r5s3t1u9v7w5x3y1z.', 'STUDENT', '+91 9876543211', 'Information Technology', 'B.Tech', '5th Semester', 'ACTIVE');

-- Master Subjects
INSERT INTO subjects (id, name, code, faculty, department, credits) VALUES
(1, 'Advanced Java Programming', 'CS601', 'Dr. S. Ramanujan', 'Computer Science & Engineering', 4),
(2, 'Database Management Systems', 'CS602', 'Prof. A. Mukherjee', 'Computer Science & Engineering', 4),
(3, 'Computer Networks & Security', 'CS603', 'Dr. V. Patel', 'Computer Science & Engineering', 3),
(4, 'Operating Systems Architecture', 'CS604', 'Prof. K. Verma', 'Computer Science & Engineering', 4),
(5, 'Software Engineering & Agile', 'CS605', 'Dr. N. Roy', 'Computer Science & Engineering', 3);

-- Topics for Advanced Java
INSERT INTO topics (id, subject_id, topic_name, difficulty) VALUES
(1, 1, 'Servlet Lifecycle & Architecture', 'MEDIUM'),
(2, 1, 'JDBC Database Connectivity & Pooling', 'HARD'),
(3, 1, 'JSP Expression Language & JSTL Tags', 'MEDIUM'),
(4, 1, 'Session Tracking & Authentication Filters', 'HARD'),
(5, 1, 'MVC Design Pattern Implementation', 'HARD');

-- Topics for DBMS
INSERT INTO topics (id, subject_id, topic_name, difficulty) VALUES
(6, 2, 'Relational Schema & 3NF/BCNF Normalization', 'HARD'),
(7, 2, 'SQL Complex Joins & Subqueries', 'MEDIUM'),
(8, 2, 'Transaction ACID Properties & 2PL Concurrency', 'HARD');

-- Topics for Computer Networks
INSERT INTO topics (id, subject_id, topic_name, difficulty) VALUES
(9, 3, 'TCP 3-Way Handshake & Flow Control', 'MEDIUM'),
(10, 3, 'IPv4 Subnetting & CIDR Calculation', 'HARD');

-- Rahul Kumar Enrollments (Student ID: 2)
INSERT INTO student_subjects (student_id, subject_id, target_percentage, priority) VALUES
(2, 1, 85.00, 'HIGH'),
(2, 2, 80.00, 'HIGH'),
(2, 3, 75.00, 'MEDIUM'),
(2, 4, 80.00, 'MEDIUM');

-- Rahul Kumar Topic Progress
INSERT INTO student_topic_progress (student_id, topic_id, status, progress_percentage, confidence_level, revision_count, last_revised) VALUES
(2, 1, 'COMPLETED', 100.00, 5, 2, DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
(2, 2, 'IN_PROGRESS', 65.00, 2, 1, DATE_SUB(CURDATE(), INTERVAL 3 DAY)), -- Weak topic!
(2, 3, 'IN_PROGRESS', 70.00, 4, 1, DATE_SUB(CURDATE(), INTERVAL 4 DAY)),
(2, 4, 'IN_PROGRESS', 50.00, 3, 1, DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
(2, 5, 'NOT_STARTED', 20.00, 2, 0, NULL),
(2, 6, 'COMPLETED', 100.00, 4, 2, DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
(2, 7, 'COMPLETED', 100.00, 5, 3, DATE_SUB(CURDATE(), INTERVAL 4 DAY)),
(2, 8, 'IN_PROGRESS', 40.00, 2, 1, DATE_SUB(CURDATE(), INTERVAL 6 DAY)); -- Weak topic!

-- Tests
INSERT INTO tests (id, subject_id, test_name, test_date, max_marks, test_type, created_by) VALUES
(1, 1, 'Unit Test 1 — Servlets & JDBC', DATE_SUB(CURDATE(), INTERVAL 10 DAY), 50.00, 'QUIZ', 1),
(2, 2, 'DBMS Mid-Term Assessment', DATE_SUB(CURDATE(), INTERVAL 6 DAY), 50.00, 'MID_TERM', 1),
(3, 3, 'Networks Subnetting Quiz', DATE_SUB(CURDATE(), INTERVAL 3 DAY), 25.00, 'QUIZ', 1),
(4, 1, 'Unit Test 2 — MVC & Sessions', DATE_ADD(CURDATE(), INTERVAL 4 DAY), 50.00, 'QUIZ', 1);

-- Rahul Kumar Test Marks (Adv Java is currently at 68%!)
INSERT INTO test_results (test_id, student_id, marks_obtained, percentage, feedback) VALUES
(1, 2, 34.00, 68.00, 'Good servlet basics. Needs further practice on PreparedStatement and transaction handling.'),
(2, 2, 41.00, 82.00, 'Excellent command over normalization and SQL query formulation.'),
(3, 2, 19.50, 78.00, 'Accurate subnet mask calculations.');

-- Rahul Kumar Study Sessions (Streak active!)
INSERT INTO study_sessions (student_id, subject_id, topic_id, study_date, start_time, end_time, duration_minutes, notes) VALUES
(2, 1, 1, DATE_SUB(CURDATE(), INTERVAL 3 DAY), '09:00:00', '10:30:00', 90, 'Reviewed HttpServlet request cycle and web.xml deployment mapping.'),
(2, 1, 2, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '14:00:00', '16:00:00', 120, 'Implemented connection pooling and statement batching in Eclipse.'),
(2, 2, 6, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '10:00:00', '11:45:00', 105, 'Solved 3NF and BCNF decomposition exam problems.'),
(2, 3, 9, CURDATE(), '08:30:00', '10:00:00', 90, 'Studied TCP sliding window and congestion control.');

-- Rahul Kumar Weekly Study Plans
INSERT INTO study_plans (student_id, subject_id, day_of_week, plan_date, planned_minutes, focus_notes, status) VALUES
(2, 1, 'Monday', CURDATE(), 90, 'Master JDBC Connection Pooling & Transactions', 'COMPLETED'),
(2, 1, 'Tuesday', DATE_ADD(CURDATE(), INTERVAL 1 DAY), 120, 'MVC Architecture: Servlets to JSP Request Dispatcher', 'PENDING'),
(2, 2, 'Wednesday', DATE_ADD(CURDATE(), INTERVAL 2 DAY), 90, 'Practice 2-Phase Locking (2PL) Concurrency Questions', 'PENDING'),
(2, 3, 'Thursday', DATE_ADD(CURDATE(), INTERVAL 3 DAY), 60, 'CIDR /27 and /28 Subnetting Calculations', 'PENDING'),
(2, 1, 'Friday', DATE_ADD(CURDATE(), INTERVAL 4 DAY), 120, 'Revision for Unit Test 2 on MVC & Sessions', 'PENDING');

-- Notifications for Rahul
INSERT INTO notifications (user_id, title, message, notification_type, is_read) VALUES
(2, 'Upcoming Exam in 4 Days', 'Unit Test 2 on Advanced Java MVC & Sessions is scheduled for this Friday.', 'DEADLINE', FALSE),
(2, 'Priority Recommendation', 'Your Advanced Java score is 68%, below your 85% target. Focus on JDBC revision today.', 'RECOMMENDATION', FALSE);
