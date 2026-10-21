<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Registration - Smart Learning Progress Tracker</title>
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
            max-width: 440px;
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.3);
        }
    </style>
</head>
<body>

<div class="auth-wrapper">
    <div class="auth-card">
        <div style="text-align: center; margin-bottom: 24px;">
            <div style="font-size: 2.2rem; margin-bottom: 8px;">🎓</div>
            <h2 style="font-size: 1.4rem; font-weight: 700;">Student Registration</h2>
            <p style="color: var(--text-muted); font-size: 0.88rem;">Create your learning tracker profile</p>
        </div>

        <c:if test="${not empty error}">
            <div class="alert alert-danger"><c:out value="${error}" /></div>
        </c:if>

        <form action="${pageContext.request.contextPath}/register" method="POST">
            <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" name="name" class="form-control" value="${name}" required autofocus>
            </div>

            <div class="form-group">
                <label for="email">College / Personal Email</label>
                <input type="email" id="email" name="email" class="form-control" value="${email}" required>
            </div>

            <div class="form-group">
                <label for="password">Password (Minimum 6 characters)</label>
                <input type="password" id="password" name="password" class="form-control" minlength="6" required>
            </div>

            <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" class="form-control" minlength="6" required>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 11px; margin-top: 8px; justify-content: center;">
                Create Account
            </button>
        </form>

        <div style="text-align: center; margin-top: 20px; font-size: 0.88rem;">
            Already registered? <a href="${pageContext.request.contextPath}/login" style="color: var(--primary); font-weight: 600;">Sign in</a>
        </div>
    </div>
</div>

</body>
</html>
