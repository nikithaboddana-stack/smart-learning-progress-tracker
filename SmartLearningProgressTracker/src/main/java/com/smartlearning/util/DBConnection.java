package com.smartlearning.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Reusable Database Connection Utility.
 * Centralizes JDBC configuration for MySQL.
 * 
 * STUDENTS / DEVELOPERS:
 * Update the USERNAME and PASSWORD constants below to match your local MySQL configuration.
 */
public class DBConnection {

    // =========================================================================
    // DATABASE CONFIGURATION - CONFIGURE FOR YOUR LOCAL MYSQL SERVER
    // =========================================================================
    private static final String HOST = "localhost";
    private static final String PORT = "3306";
    private static final String DATABASE = "smart_learning_tracker";
    private static final String URL = "jdbc:mysql://" + HOST + ":" + PORT + "/" + DATABASE + 
                                     "?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8";

    // Standard local MySQL credentials (customize for your college lab or home machine)
    private static final String USERNAME = "root";
    private static final String PASSWORD = "root"; // Change to your MySQL password (e.g. "", "password", "admin", "root123")

    static {
        try {
            // Load MySQL Connector/J driver
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("[DBConnection] MySQL JDBC Driver not found in classpath. " +
                               "Ensure mysql-connector-j.jar is in WEB-INF/lib or Maven dependencies.");
            e.printStackTrace();
        }
    }

    /**
     * Obtains a new database connection from the driver manager.
     * Callers should close the connection using try-with-resources.
     * 
     * @return active java.sql.Connection
     * @throws SQLException if a database access error occurs
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USERNAME, PASSWORD);
    }

    /**
     * Helper method to verify database connectivity.
     */
    public static boolean testConnection() {
        try (Connection conn = getConnection()) {
            return conn != null && !conn.isClosed();
        } catch (SQLException e) {
            System.err.println("[DBConnection] Test connection failed: " + e.getMessage());
            return false;
        }
    }

    public static String getDatabaseName() {
        return DATABASE;
    }

    public static String getJdbcUrl() {
        return URL;
    }
}
