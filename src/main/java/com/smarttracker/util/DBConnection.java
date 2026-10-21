package com.smarttracker.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Thread-safe Centralized Database Connection Utility for MySQL 8.0+.
 * Used across all DAO classes.
 */
public class DBConnection {

    // =========================================================================
    // DATABASE CONFIGURATION (Default local MySQL server parameters)
    // =========================================================================
    private static final String HOST = System.getenv("DB_HOST") != null ? System.getenv("DB_HOST") : "localhost";
    private static final String PORT = System.getenv("DB_PORT") != null ? System.getenv("DB_PORT") : "3306";
    private static final String DATABASE = System.getenv("DB_NAME") != null ? System.getenv("DB_NAME") : "smart_tracker_db";
    
    private static final String URL = "jdbc:mysql://" + HOST + ":" + PORT + "/" + DATABASE + 
                                     "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8";

    // MySQL Credentials - Customize for your local college lab or machine
    private static final String USERNAME = System.getenv("DB_USER") != null ? System.getenv("DB_USER") : "root";
    private static final String PASSWORD = System.getenv("DB_PASSWORD") != null ? System.getenv("DB_PASSWORD") : "root";

    static {
        try {
            // Load MySQL Connector/J JDBC Driver
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("[DBConnection] CRITICAL: MySQL JDBC Driver (com.mysql.cj.jdbc.Driver) not found in classpath.");
            e.printStackTrace();
        }
    }

    /**
     * Obtains a dedicated database connection.
     * Always close via try-with-resources in DAO methods.
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USERNAME, PASSWORD);
    }

    public static boolean testConnection() {
        try (Connection conn = getConnection()) {
            return conn != null && !conn.isClosed();
        } catch (SQLException e) {
            System.err.println("[DBConnection] Database connection test failed: " + e.getMessage());
            return false;
        }
    }

    public static String getDatabaseName() {
        return DATABASE;
    }
}
