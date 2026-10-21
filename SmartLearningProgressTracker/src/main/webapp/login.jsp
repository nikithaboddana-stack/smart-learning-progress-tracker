<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Login - Smart Learning Progress Tracker</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
    <style>
        .auth-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #0f172a;
            padding: 20px;
        }
        .auth-card {
            background: #ffffff;
            border-radius: var(--radius-lg);
            padding: 36px;
            width: 100%;
            max-width: 420px;
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.3);
        }
        .demo-box {
            background: #f8fafc;
            border: 1px dashed #cbd5e1;
            padding: 12px;
            border-radius: var(--radius-md);
            margin-top: 20px;
            font-size: 0.82rem;
            color: var(--text-muted);
        }
    </style>
</head>
<body>

<div class="auth-wrapper">
    <div class="auth-card">
        <div style="text-align: center; margin-bottom: 24px;">
            <div style="font-size: 2.2rem; margin-bottom: 8px;">⚡</div>
            <h2 style="font-size: 1.4rem; font-weight: 700;">Student Portal Login</h2>
            <p style="color: var(--text-muted); font-size: 0.88rem;">Smart Learning Progress Tracker</p>
        </div>

        <c:if test="${not empty param.msg}">
            <div class="alert alert-success"><c:out value="${param.msg}" /></div>
        </c:if>

        <c:if test="${not empty error}">
            <div class="alert alert-danger"><c:out value="${error}" /></div>
        </c:if>

        <form action="${pageContext.request.contextPath}/login" method="POST">
            <div class="form-group">
                <label for="email">Student Email Address</label>
                <input type="email" id="email" name="email" class="form-control" 
                       value="${email != null ? email : 'student@college.edu'}" required autofocus>
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" class="form-control" 
                       value="password123" required>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 11px; margin-top: 8px; justify-content: center;">
                Sign In to Dashboard
            </button>
        </form>

        <div class="demo-box">
            <strong>Sample Demo Credentials:</strong><br>
            Email: <code>student@college.edu</code><br>
            Password: <code>password123</code>
        </div>

        <div style="text-align: center; margin-top: 20px; font-size: 0.88rem;">
            New student? <a href="${pageContext.request.contextPath}/register" style="color: var(--primary); font-weight: 600;">Create an account</a>
        </div>
    </div>
</div>

</body>
</html>
