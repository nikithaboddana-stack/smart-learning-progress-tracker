<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isErrorPage="true"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Error - Smart Learning Progress Tracker</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
    <style>
        .error-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
            background: #f8fafc;
        }
        .error-card {
            background: #ffffff;
            border-radius: var(--radius-lg);
            padding: 40px;
            max-width: 520px;
            text-align: center;
            box-shadow: var(--shadow-md);
            border: 1px solid var(--border-color);
        }
    </style>
</head>
<body>

<div class="error-container">
    <div class="error-card">
        <div style="font-size: 3rem; margin-bottom: 12px;">⚠️</div>
        <h2 style="font-size: 1.5rem; margin-bottom: 12px;">Something went wrong</h2>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 24px;">
            The application encountered an unexpected situation. Please check your MySQL database connection or return to the dashboard.
        </p>

        <div style="display: flex; justify-content: center; gap: 12px;">
            <a href="${pageContext.request.contextPath}/dashboard" class="btn btn-primary">Return to Dashboard</a>
            <a href="${pageContext.request.contextPath}/login" class="btn btn-secondary">Sign In Again</a>
        </div>

        <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid var(--border-color); font-size: 0.8rem; color: var(--text-muted);">
            If running locally in Eclipse: ensure MySQL service is started on port 3306 and database credentials match <code>DBConnection.java</code>.
        </div>
    </div>
</div>

</body>
</html>
