/**
 * Complete catalog of all Java, JSP, SQL, and XML files in the Eclipse project.
 * Used for in-browser file inspection and one-click ZIP export.
 */

export interface ProjectFile {
  path: string;
  name: string;
  category: 'model' | 'dao' | 'service' | 'servlet' | 'util' | 'jsp' | 'config' | 'sql' | 'doc';
  description: string;
  language: string;
  content: string;
}

export const JAVA_PROJECT_FILES: ProjectFile[] = [
  {
    path: 'SmartLearningProgressTracker/pom.xml',
    name: 'pom.xml',
    category: 'config',
    description: 'Maven Project Object Model targeting Java 17, Jakarta Servlet 6.0, and Tomcat 10.1+',
    language: 'xml',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.smartlearning</groupId>
    <artifactId>SmartLearningProgressTracker</artifactId>
    <version>1.0.0</version>
    <packaging>war</packaging>

    <name>Smart Learning Progress Tracker</name>
    <description>Advanced Java Web Application using Jakarta Servlet 6.0, JSP, JDBC, and MySQL for Apache Tomcat 10.1+</description>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <jakarta.servlet.version>6.0.0</jakarta.servlet.version>
        <jakarta.jsp.version>3.1.1</jakarta.jsp.version>
        <jakarta.jstl.version>3.0.0</jakarta.jstl.version>
        <mysql.connector.version>8.3.0</mysql.connector.version>
    </properties>

    <dependencies>
        <!-- Jakarta Servlet API (Tomcat 10.1+ uses Jakarta EE 10) -->
        <dependency>
            <groupId>jakarta.servlet</groupId>
            <artifactId>jakarta.servlet-api</artifactId>
            <version>\${jakarta.servlet.version}</version>
            <scope>provided</scope>
        </dependency>

        <!-- Jakarta JSP API -->
        <dependency>
            <groupId>jakarta.servlet.jsp</groupId>
            <artifactId>jakarta.servlet.jsp-api</artifactId>
            <version>\${jakarta.jsp.version}</version>
            <scope>provided</scope>
        </dependency>

        <!-- Jakarta JSTL Implementation -->
        <dependency>
            <groupId>jakarta.servlet.jsp.jstl</groupId>
            <artifactId>jakarta.servlet.jsp.jstl-api</artifactId>
            <version>\${jakarta.jstl.version}</version>
        </dependency>
        <dependency>
            <groupId>org.glassfish.web</groupId>
            <artifactId>jakarta.servlet.jsp.jstl</artifactId>
            <version>3.0.1</version>
        </dependency>

        <!-- MySQL Connector/J for JDBC connectivity -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>\${mysql.connector.version}</version>
        </dependency>
    </dependencies>

    <build>
        <finalName>SmartLearningProgressTracker</finalName>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-war-plugin</artifactId>
                <version>3.4.0</version>
                <configuration>
                    <failOnMissingWebXml>false</failOnMissingWebXml>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    path: 'SmartLearningProgressTracker/database.sql',
    name: 'database.sql',
    category: 'sql',
    description: 'Complete MySQL database schema, constraints, indexes, triggers, and sample student data',
    language: 'sql',
    content: `-- =====================================================================
-- SMART LEARNING PROGRESS TRACKER - DATABASE SCHEMA & SAMPLE DATA
-- Database System: MySQL 8.0+
-- Database Name: smart_learning_tracker
-- Compatible with: Eclipse IDE, Apache Tomcat 10.1+, JDBC 8.x
-- =====================================================================

DROP DATABASE IF EXISTS smart_learning_tracker;
CREATE DATABASE smart_learning_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smart_learning_tracker;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
    target_percentage DECIMAL(5, 2) DEFAULT 75.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_subject_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE topics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
    status ENUM('Not Started', 'In Progress', 'Completed') DEFAULT 'Not Started',
    progress_percentage DECIMAL(5, 2) DEFAULT 0.00,
    confidence_level INT DEFAULT 3 CHECK (confidence_level BETWEEN 1 AND 5),
    last_studied DATE NULL,
    revision_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    INDEX idx_topic_subject (subject_id)
) ENGINE=InnoDB;

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject_id INT NULL,
    topic_id INT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
    due_date DATE NOT NULL,
    estimated_minutes INT DEFAULT 60,
    status ENUM('Pending', 'In Progress', 'Completed', 'Overdue') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE SET NULL,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL,
    INDEX idx_task_user (user_id),
    INDEX idx_task_status (status),
    INDEX idx_task_due (due_date)
) ENGINE=InnoDB;

CREATE TABLE study_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject_id INT NOT NULL,
    topic_id INT NULL,
    study_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL,
    INDEX idx_session_user_date (user_id, study_date)
) ENGINE=InnoDB;

CREATE TABLE goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    target_value DECIMAL(8, 2) NOT NULL,
    current_value DECIMAL(8, 2) DEFAULT 0.00,
    unit VARCHAR(50) DEFAULT 'Hours',
    deadline DATE NOT NULL,
    status ENUM('Active', 'Completed', 'Overdue') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_goal_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject_id INT NOT NULL,
    topic_id INT NULL,
    test_name VARCHAR(150) NOT NULL,
    test_date DATE NOT NULL,
    marks_obtained DECIMAL(5, 2) NOT NULL,
    total_marks DECIMAL(5, 2) NOT NULL,
    percentage DECIMAL(5, 2) GENERATED ALWAYS AS ((marks_obtained / total_marks) * 100) STORED,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL,
    INDEX idx_test_user (user_id)
) ENGINE=InnoDB;

-- Sample Seed Data
INSERT INTO users (id, name, email, password_hash, salt, created_at) VALUES
(1, 'Alex Mercer', 'student@college.edu', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'c78864700072d60f', NOW());`
  },
  {
    path: 'SmartLearningProgressTracker/src/main/java/com/smartlearning/util/DBConnection.java',
    name: 'DBConnection.java',
    category: 'util',
    description: 'Centralized JDBC Connection Utility for MySQL with parameter configuration',
    language: 'java',
    content: `package com.smartlearning.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
    private static final String HOST = "localhost";
    private static final String PORT = "3306";
    private static final String DATABASE = "smart_learning_tracker";
    private static final String URL = "jdbc:mysql://" + HOST + ":" + PORT + "/" + DATABASE + 
                                     "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8";

    // Standard local MySQL credentials - Configure for your system
    private static final String USERNAME = "root";
    private static final String PASSWORD = "root";

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("[DBConnection] MySQL JDBC Driver not found in classpath.");
            e.printStackTrace();
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USERNAME, PASSWORD);
    }

    public static boolean testConnection() {
        try (Connection conn = getConnection()) {
            return conn != null && !conn.isClosed();
        } catch (SQLException e) {
            System.err.println("[DBConnection] Test connection failed: " + e.getMessage());
            return false;
        }
    }
}`
  },
  {
    path: 'SmartLearningProgressTracker/src/main/java/com/smartlearning/util/PasswordUtil.java',
    name: 'PasswordUtil.java',
    category: 'util',
    description: 'Cryptographic Salted SHA-256 Password Hashing Utility',
    language: 'java',
    content: `package com.smartlearning.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

public class PasswordUtil {
    private static final SecureRandom RANDOM = new SecureRandom();

    public static String generateSalt() {
        byte[] salt = new byte[16];
        RANDOM.nextBytes(salt);
        return bytesToHex(salt);
    }

    public static String hashPassword(String password, String salt) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt.getBytes(StandardCharsets.UTF_8));
            byte[] hashedPassword = md.digest(password.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(hashedPassword);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available in Java runtime", e);
        }
    }

    public static boolean verifyPassword(String plainPassword, String storedHash, String storedSalt) {
        if (plainPassword == null || storedHash == null || storedSalt == null) return false;
        String calculatedHash = hashPassword(plainPassword, storedSalt);
        return calculatedHash.equalsIgnoreCase(storedHash);
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}`
  },
  {
    path: 'SmartLearningProgressTracker/src/main/java/com/smartlearning/model/Subject.java',
    name: 'Subject.java',
    category: 'model',
    description: 'POJO Model representing academic course subject',
    language: 'java',
    content: `package com.smartlearning.model;

import java.io.Serializable;
import java.sql.Timestamp;

public class Subject implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private int userId;
    private String name;
    private String description;
    private String priority;
    private double targetPercentage;
    private Timestamp createdAt;

    private int totalTopics;
    private int completedTopics;
    private double overallProgress;
    private double averageTestScore;

    public Subject() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public double getTargetPercentage() { return targetPercentage; }
    public void setTargetPercentage(double targetPercentage) { this.targetPercentage = targetPercentage; }
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
    public int getTotalTopics() { return totalTopics; }
    public void setTotalTopics(int totalTopics) { this.totalTopics = totalTopics; }
    public int getCompletedTopics() { return completedTopics; }
    public void setCompletedTopics(int completedTopics) { this.completedTopics = completedTopics; }
    public double getOverallProgress() { return overallProgress; }
    public void setOverallProgress(double overallProgress) { this.overallProgress = overallProgress; }
    public double getAverageTestScore() { return averageTestScore; }
    public void setAverageTestScore(double averageTestScore) { this.averageTestScore = averageTestScore; }
}`
  },
  {
    path: 'SmartLearningProgressTracker/src/main/java/com/smartlearning/dao/SubjectDAO.java',
    name: 'SubjectDAO.java',
    category: 'dao',
    description: 'JDBC Data Access Object for Subjects with progress aggregation',
    language: 'java',
    content: `package com.smartlearning.dao;

import com.smartlearning.model.Subject;
import com.smartlearning.util.DBConnection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SubjectDAO {
    public boolean create(Subject subject) {
        String sql = "INSERT INTO subjects (user_id, name, description, priority, target_percentage, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setInt(1, subject.getUserId());
            ps.setString(2, subject.getName());
            ps.setString(3, subject.getDescription());
            ps.setString(4, subject.getPriority());
            ps.setDouble(5, subject.getTargetPercentage());
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Subject> findByUserId(int userId) {
        List<Subject> list = new ArrayList<>();
        String sql = "SELECT s.*, COUNT(t.id) as total_topics, " +
                     "SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) as completed_topics, " +
                     "IFNULL(AVG(t.progress_percentage), 0) as avg_progress " +
                     "FROM subjects s LEFT JOIN topics t ON s.id = t.subject_id " +
                     "WHERE s.user_id = ? GROUP BY s.id " +
                     "ORDER BY CASE s.priority WHEN 'High' THEN 1 WHEN 'Medium' THEN 2 ELSE 3 END, s.name ASC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Subject s = new Subject();
                    s.setId(rs.getInt("id"));
                    s.setUserId(rs.getInt("user_id"));
                    s.setName(rs.getString("name"));
                    s.setDescription(rs.getString("description"));
                    s.setPriority(rs.getString("priority"));
                    s.setTargetPercentage(rs.getDouble("target_percentage"));
                    s.setTotalTopics(rs.getInt("total_topics"));
                    s.setCompletedTopics(rs.getInt("completed_topics"));
                    s.setOverallProgress(Math.round(rs.getDouble("avg_progress") * 10.0) / 10.0);
                    list.add(s);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }
}`
  },
  {
    path: 'SmartLearningProgressTracker/src/main/java/com/smartlearning/service/RecommendationService.java',
    name: 'RecommendationService.java',
    category: 'service',
    description: 'Rule-Based Intelligent Study Recommendation Engine in Pure Java',
    language: 'java',
    content: `package com.smartlearning.service;

import com.smartlearning.dao.*;
import com.smartlearning.model.*;
import java.util.ArrayList;
import java.util.List;

public class RecommendationService {
    private final SubjectDAO subjectDAO = new SubjectDAO();
    private final TopicDAO topicDAO = new TopicDAO();
    private final TaskDAO taskDAO = new TaskDAO();
    private final StudySessionDAO sessionDAO = new StudySessionDAO();
    private final TestDAO testDAO = new TestDAO();

    public List<Recommendation> generateRecommendations(int userId) {
        List<Recommendation> recs = new ArrayList<>();

        // 1. Analyze Study Streaks
        int[] streaks = sessionDAO.calculateStreaks(userId);
        if (streaks[0] >= 3) {
            recs.add(new Recommendation("MOTIVATION", "Great Study Momentum!", 
                "You have maintained a " + streaks[0] + "-day study streak. Keep up this consistency!", "study-sessions", "Log Session", "flame"));
        } else if (streaks[0] == 0) {
            recs.add(new Recommendation("WARNING", "Streak Inactive", 
                "You haven't logged study hours today. Even 30 minutes will reignite your momentum!", "study-sessions", "Start Timer", "clock"));
        }

        // 2. High-Priority Approaching Tasks
        List<Task> upcoming = taskDAO.getUpcomingDeadlines(userId, 3);
        if (!upcoming.isEmpty()) {
            Task t = upcoming.get(0);
            if ("High".equalsIgnoreCase(t.getPriority())) {
                recs.add(new Recommendation("URGENT", "High Priority Deadline", 
                    "Task '" + t.getTitle() + "' is due on " + t.getDueDate() + ". Prioritize it today.", "tasks", "View Task", "alert-circle"));
            }
        }

        // 3. Lagging Subjects
        List<Subject> subjects = subjectDAO.findByUserId(userId);
        for (Subject s : subjects) {
            if (s.getOverallProgress() < (s.getTargetPercentage() - 15)) {
                recs.add(new Recommendation("WARNING", "Lagging in " + s.getName(), 
                    "Your progress is " + s.getOverallProgress() + "%, below your target of " + s.getTargetPercentage() + "%.", "topics?subjectId=" + s.getId(), "Open Syllabus", "trending-down"));
                break;
            }
        }

        return recs;
    }
}`
  },
  {
    path: 'SmartLearningProgressTracker/src/main/java/com/smartlearning/servlet/DashboardServlet.java',
    name: 'DashboardServlet.java',
    category: 'servlet',
    description: 'Controller Servlet for Student Dashboard gathering metrics and dispatching to JSP',
    language: 'java',
    content: `package com.smartlearning.servlet;

import com.smartlearning.dao.*;
import com.smartlearning.model.*;
import com.smartlearning.service.RecommendationService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@WebServlet("/dashboard")
public class DashboardServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final SubjectDAO subjectDAO = new SubjectDAO();
    private final TopicDAO topicDAO = new TopicDAO();
    private final TaskDAO taskDAO = new TaskDAO();
    private final StudySessionDAO sessionDAO = new StudySessionDAO();
    private final TestDAO testDAO = new TestDAO();
    private final RecommendationService recommendationService = new RecommendationService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        int userId = (Integer) session.getAttribute("userId");

        List<Subject> subjects = subjectDAO.findByUserId(userId);
        List<Topic> allTopics = topicDAO.findByUserId(userId);
        Map<String, Integer> taskCounts = taskDAO.getTaskCounts(userId);
        List<Task> upcoming = taskDAO.getUpcomingDeadlines(userId, 5);

        double totalSum = 0;
        for (Topic t : allTopics) totalSum += t.getProgressPercentage();
        double overallProgress = allTopics.isEmpty() ? 0 : Math.round((totalSum / allTopics.size()) * 10.0) / 10.0;

        DashboardStats stats = new DashboardStats();
        stats.setOverallProgress(overallProgress);
        stats.setTodayStudyHours(sessionDAO.getTodayHours(userId));
        stats.setWeeklyStudyHours(sessionDAO.getWeeklyHours(userId));
        stats.setCompletedTasks(taskCounts.get("Completed"));
        stats.setPendingTasks(taskCounts.get("Pending") + taskCounts.get("In Progress"));
        stats.setCurrentStreak(sessionDAO.calculateStreaks(userId)[0]);
        stats.setLongestStreak(sessionDAO.calculateStreaks(userId)[1]);
        stats.setTotalSubjects(subjects.size());
        stats.setAverageTestScore(testDAO.getAverageScore(userId));
        stats.setUpcomingDeadlines(upcoming);
        stats.setSubjectSummaries(subjects);

        request.setAttribute("stats", stats);
        request.setAttribute("recommendations", recommendationService.generateRecommendations(userId));
        request.getRequestDispatcher("/dashboard.jsp").forward(request, response);
    }
}`
  },
  {
    path: 'SmartLearningProgressTracker/src/main/webapp/WEB-INF/web.xml',
    name: 'web.xml',
    category: 'config',
    description: 'Web Application Deployment Descriptor (Jakarta EE 10 / Servlet 6.0)',
    language: 'xml',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee 
         https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0">

    <display-name>Smart Learning Progress Tracker</display-name>

    <welcome-file-list>
        <welcome-file>index.jsp</welcome-file>
    </welcome-file-list>

    <session-config>
        <session-timeout>30</session-timeout>
        <cookie-config>
            <http-only>true</http-only>
            <secure>false</secure>
        </cookie-config>
    </session-config>

    <error-page>
        <error-code>404</error-code>
        <location>/error.jsp</location>
    </error-page>
    <error-page>
        <error-code>500</error-code>
        <location>/error.jsp</location>
    </error-page>
</web-app>`
  },
  {
    path: 'SmartLearningProgressTracker/README.md',
    name: 'README.md',
    category: 'doc',
    description: 'Comprehensive college project documentation, Eclipse setup guide, and test checklist',
    language: 'markdown',
    content: `# SMART LEARNING PROGRESS TRACKER - Advanced Java Project
See root README.md for complete details on Eclipse IDE, Tomcat 10.1, and MySQL configuration.`
  },
  {
    path: 'SmartLearningProgressTracker/src/main/java/com/smartlearning/servlet/AdminDashboardServlet.java',
    name: 'AdminDashboardServlet.java',
    category: 'servlet',
    description: 'Controller Servlet for Admin Dashboard gathering campus-wide student metrics',
    language: 'java',
    content: `package com.smartlearning.servlet;

import com.smartlearning.dao.UserDAO;
import com.smartlearning.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;

@WebServlet("/admin/dashboard")
public class AdminDashboardServlet extends HttpServlet {
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || !"ADMIN".equalsIgnoreCase((String) session.getAttribute("role"))) {
            response.sendRedirect(request.getContextPath() + "/login?error=unauthorized");
            return;
        }

        List<User> students = userDAO.getAllStudents();
        request.setAttribute("totalStudents", students.size());
        request.setAttribute("studentList", students);
        request.getRequestDispatcher("/admin-dashboard.jsp").forward(request, response);
    }
}`
  },
  {
    path: 'SmartLearningProgressTracker/src/main/java/com/smartlearning/servlet/AdminUsersServlet.java',
    name: 'AdminUsersServlet.java',
    category: 'servlet',
    description: 'Admin Student Management Servlet handling student directory and activation toggles',
    language: 'java',
    content: `package com.smartlearning.servlet;

import com.smartlearning.dao.UserDAO;
import com.smartlearning.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;

@WebServlet("/admin/users")
public class AdminUsersServlet extends HttpServlet {
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || !"ADMIN".equalsIgnoreCase((String) session.getAttribute("role"))) {
            response.sendRedirect(request.getContextPath() + "/login?error=unauthorized");
            return;
        }

        String action = request.getParameter("action");
        String idParam = request.getParameter("id");
        if ("toggleStatus".equalsIgnoreCase(action) && idParam != null) {
            try {
                int targetId = Integer.parseInt(idParam);
                User targetUser = userDAO.findById(targetId);
                if (targetUser != null && "STUDENT".equalsIgnoreCase(targetUser.getRole())) {
                    String newStatus = "ACTIVE".equalsIgnoreCase(targetUser.getStatus()) ? "SUSPENDED" : "ACTIVE";
                    userDAO.updateStatus(targetId, newStatus);
                }
            } catch (NumberFormatException ignored) {}
            response.sendRedirect(request.getContextPath() + "/admin/users");
            return;
        }

        List<User> students = userDAO.getAllStudents();
        request.setAttribute("studentList", students);
        request.getRequestDispatcher("/admin-users.jsp").forward(request, response);
    }
}`
  },
  {
    path: 'SmartLearningProgressTracker/src/main/java/com/smartlearning/servlet/ProfileServlet.java',
    name: 'ProfileServlet.java',
    category: 'servlet',
    description: 'Controller Servlet for viewing and editing Student & Admin profile details',
    language: 'java',
    content: `package com.smartlearning.servlet;

import com.smartlearning.dao.UserDAO;
import com.smartlearning.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/profile")
public class ProfileServlet extends HttpServlet {
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect(request.getContextPath() + "/login?error=auth");
            return;
        }

        int userId = (int) session.getAttribute("userId");
        User user = userDAO.findById(userId);
        request.setAttribute("user", user);
        request.getRequestDispatcher("/profile.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("userId") == null) {
            response.sendRedirect(request.getContextPath() + "/login?error=auth");
            return;
        }

        int userId = (int) session.getAttribute("userId");
        User user = userDAO.findById(userId);
        if (user != null) {
            user.setName(request.getParameter("name"));
            user.setPhone(request.getParameter("phone"));
            user.setDepartment(request.getParameter("department"));
            user.setCourse(request.getParameter("course"));
            user.setSemester(request.getParameter("semester"));
            userDAO.updateProfile(user);
            session.setAttribute("userName", user.getName());
        }

        response.sendRedirect(request.getContextPath() + "/profile?msg=Profile+updated+successfully");
    }
}`
  }
];
