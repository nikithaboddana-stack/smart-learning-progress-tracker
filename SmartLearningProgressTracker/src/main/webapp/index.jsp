<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%
    // Redirect logged in users directly to dashboard
    if (session != null && session.getAttribute("userId") != null) {
        response.sendRedirect(request.getContextPath() + "/dashboard");
        return;
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Learning Progress Tracker - Advanced Java Web Project</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
    <style>
        .hero {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #ffffff;
            padding: 80px 20px;
            text-align: center;
        }
        .hero h1 {
            font-size: 2.8rem;
            font-weight: 800;
            margin-bottom: 16px;
        }
        .hero p {
            font-size: 1.2rem;
            color: #94a3b8;
            max-width: 680px;
            margin: 0 auto 32px;
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
            max-width: 1100px;
            margin: -40px auto 60px;
            padding: 0 20px;
        }
        .feature-card {
            background: #ffffff;
            border-radius: var(--radius-lg);
            padding: 28px;
            box-shadow: var(--shadow-md);
            border: 1px solid var(--border-color);
        }
        .feature-icon {
            font-size: 2rem;
            margin-bottom: 12px;
        }
    </style>
</head>
<body>

    <header style="background: #0f172a; padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b;">
        <h2 style="color: #ffffff; font-size: 1.2rem; display: flex; align-items: center; gap: 8px;">
            <span>⚡</span> Smart Learning Progress Tracker
        </h2>
        <div>
            <a href="${pageContext.request.contextPath}/login" class="btn btn-secondary btn-sm" style="margin-right: 8px;">Log In</a>
            <a href="${pageContext.request.contextPath}/register" class="btn btn-primary btn-sm">Get Started</a>
        </div>
    </header>

    <div class="hero">
        <h1>Master Your Academic Goals</h1>
        <p>A complete Advanced Java web application with MVC architecture, Servlets, JSP, JDBC, MySQL, study streaks, and smart study recommendations.</p>
        <div>
            <a href="${pageContext.request.contextPath}/login" class="btn btn-primary" style="padding: 12px 28px; font-size: 1rem; margin-right: 12px;">Sign In to Portal</a>
            <a href="${pageContext.request.contextPath}/register" class="btn btn-secondary" style="padding: 12px 28px; font-size: 1rem;">Create Student Account</a>
        </div>
    </div>

    <div class="features-grid">
        <div class="feature-card">
            <div class="feature-icon">📚</div>
            <h3>Subject &amp; Topic Syllabus</h3>
            <p style="color: var(--text-muted); margin-top: 8px;">Organize course chapters, assign difficulty levels, monitor progress percentage, and track confidence levels.</p>
        </div>
        <div class="feature-card">
            <div class="feature-icon">⏱️</div>
            <h3>Study Sessions &amp; Streaks</h3>
            <p style="color: var(--text-muted); margin-top: 8px;">Interactive stopwatch study timer and dynamic consecutive day streak calculation based on logged study sessions.</p>
        </div>
        <div class="feature-card">
            <div class="feature-icon">🤖</div>
            <h3>Intelligent Recommendations</h3>
            <p style="color: var(--text-muted); margin-top: 8px;">Rule-based recommendation engine in pure Java evaluating your weak topics, overdue deadlines, and test scores.</p>
        </div>
    </div>

    <div style="text-align: center; padding: 40px 20px; color: var(--text-muted); font-size: 0.9rem;">
        Advanced Java College Project &bull; Jakarta EE 10 / Servlet 6.0 &bull; Apache Tomcat 10.1+ &bull; MySQL &bull; JDBC
    </div>

</body>
</html>
