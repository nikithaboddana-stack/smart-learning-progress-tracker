<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In — Smart Tracker</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/modern-dashboard.css">
    <style>
        body { background: #0f172a; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .auth-card { background: #ffffff; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35); overflow: hidden; width: 100%; max-width: 440px; }
        .demo-btn { font-size: 0.78rem; font-weight: 600; padding: 6px 10px; border-radius: 6px; }
    </style>
</head>
<body>

<div class="container p-3">
    <div class="auth-card mx-auto p-4 p-md-5">
        <div class="text-center mb-4">
            <div class="fs-1 mb-2">⚡</div>
            <h2 class="fw-bold fs-4 text-dark mb-1">Smart Tracker</h2>
            <p class="text-muted small">Intelligent Student Academic &amp; Study Management System</p>
        </div>

        <c:if test="${not empty param.msg}">
            <div class="alert alert-success py-2 small"><c:out value="${param.msg}" /></div>
        </c:if>
        <c:if test="${not empty error}">
            <div class="alert alert-danger py-2 small"><c:out value="${error}" /></div>
        </c:if>

        <form action="${pageContext.request.contextPath}/login" method="POST">
            <div class="mb-3">
                <label for="identifier" class="form-label small fw-semibold text-secondary">Email or Username</label>
                <input type="text" id="identifier" name="identifier" class="form-control" 
                       value="${identifier != null ? identifier : 'rahul@smarttracker.edu'}" required autofocus>
            </div>

            <div class="mb-3">
                <label for="password" class="form-label small fw-semibold text-secondary">Password</label>
                <input type="password" id="password" name="password" class="form-control" value="Rahul@123" required>
            </div>

            <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold mt-2 shadow-sm">
                Sign In to Portal
            </button>
        </form>

        <!-- Quick Demo Credentials Selector -->
        <div class="mt-4 p-3 bg-light rounded border border-secondary-subtle">
            <div class="text-muted small fw-bold mb-2">Quick 1-Click Demo Accounts:</div>
            <div class="d-flex flex-column gap-1.5">
                <button type="button" class="btn btn-outline-primary demo-btn text-start d-flex justify-content-between"
                        onclick="fillCreds('rahul@smarttracker.edu', 'Rahul@123')">
                    <span>👨‍🎓 Rahul Kumar (Student)</span>
                    <span class="text-muted">Adv. Java Focus</span>
                </button>
                <button type="button" class="btn btn-outline-info demo-btn text-start d-flex justify-content-between"
                        onclick="fillCreds('priya@smarttracker.edu', 'Priya@123')">
                    <span>👩‍🎓 Priya Sharma (Student)</span>
                    <span class="text-muted">IT Dept</span>
                </button>
                <button type="button" class="btn btn-outline-dark demo-btn text-start d-flex justify-content-between"
                        onclick="fillCreds('admin@smarttracker.edu', 'Admin@123')">
                    <span>🛡️ Administrator</span>
                    <span class="text-muted">Full Control</span>
                </button>
            </div>
        </div>

        <div class="text-center mt-4 small">
            New student? <a href="${pageContext.request.contextPath}/register" class="text-primary fw-semibold text-decoration-none">Create an Account</a>
        </div>
    </div>
</div>

<script>
function fillCreds(id, pass) {
    document.getElementById('identifier').value = id;
    document.getElementById('password').value = pass;
}
</script>

</body>
</html>
