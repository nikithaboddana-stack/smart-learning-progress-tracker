<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Registration — Smart Tracker</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/modern-dashboard.css">
    <style>
        body { background: #0f172a; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .auth-card { background: #ffffff; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35); overflow: hidden; width: 100%; max-width: 520px; }
    </style>
</head>
<body>

<div class="container p-3 my-4">
    <div class="auth-card mx-auto p-4 p-md-5">
        <div class="text-center mb-4">
            <div class="fs-1 mb-2">🎓</div>
            <h2 class="fw-bold fs-4 text-dark mb-1">Student Registration</h2>
            <p class="text-muted small">Create your personalized academic learning profile</p>
        </div>

        <c:if test="${not empty error}">
            <div class="alert alert-danger py-2 small"><c:out value="${error}" /></div>
        </c:if>

        <form action="${pageContext.request.contextPath}/register" method="POST">
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary">Full Name</label>
                    <input type="text" name="name" class="form-control" value="${user.name}" placeholder="e.g. Rahul Kumar" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary">Username</label>
                    <input type="text" name="username" class="form-control" value="${user.username}" placeholder="e.g. rahul99" required>
                </div>

                <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary">College / Personal Email</label>
                    <input type="email" name="email" class="form-control" value="${user.email}" placeholder="student@college.edu" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary">Phone Number</label>
                    <input type="tel" name="phone" class="form-control" value="${user.phone}" placeholder="+91 9876543210">
                </div>

                <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary">Department</label>
                    <select name="department" class="form-select">
                        <option value="Computer Science & Engineering">Computer Science &amp; Eng.</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Electronics & Communication">Electronics &amp; Comm.</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label small fw-semibold text-secondary">Course</label>
                    <input type="text" name="course" class="form-control" value="B.Tech" required>
                </div>
                <div class="col-md-3">
                    <label class="form-label small fw-semibold text-secondary">Semester</label>
                    <select name="semester" class="form-select">
                        <option value="1st Semester">1st Sem</option>
                        <option value="2nd Semester">2nd Sem</option>
                        <option value="3rd Semester">3rd Sem</option>
                        <option value="4th Semester">4th Sem</option>
                        <option value="5th Semester">5th Sem</option>
                        <option value="6th Semester" selected>6th Sem</option>
                        <option value="7th Semester">7th Sem</option>
                        <option value="8th Semester">8th Sem</option>
                    </select>
                </div>

                <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary">Password</label>
                    <input type="password" name="password" class="form-control" minlength="6" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label small fw-semibold text-secondary">Confirm Password</label>
                    <input type="password" name="confirmPassword" class="form-control" minlength="6" required>
                </div>
            </div>

            <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold mt-4 shadow-sm">
                Create My Academic Account
            </button>
        </form>

        <div class="text-center mt-3 small">
            Already have an account? <a href="${pageContext.request.contextPath}/login" class="text-primary fw-semibold text-decoration-none">Sign In</a>
        </div>
    </div>
</div>

</body>
</html>
