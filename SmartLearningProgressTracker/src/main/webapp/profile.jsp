<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="pageTitle" value="Student Profile - Smart Learning Progress Tracker" />
<c:set var="activePage" value="profile" />

<jsp:include page="/WEB-INF/jsp/includes/header.jsp" />
<jsp:include page="/WEB-INF/jsp/includes/sidebar.jsp" />

<div class="main-wrapper">
    <header class="top-navbar">
        <h1 class="page-title">Profile &amp; Account Settings</h1>
    </header>

    <main class="content-container">
        <c:if test="${not empty param.msg}">
            <div class="alert alert-success"><c:out value="${param.msg}" /></div>
        </c:if>
        <c:if test="${not empty param.error}">
            <div class="alert alert-danger"><c:out value="${param.error}" /></div>
        </c:if>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <!-- Profile Details Card -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Student Information</h3>
                </div>

                <form action="${pageContext.request.contextPath}/profile" method="POST">
                    <input type="hidden" name="action" value="updateProfile">

                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input type="text" id="name" name="name" class="form-control" value="<c:out value='${user.name}' />" required>
                    </div>

                    <div class="form-group">
                        <label for="email">Email Address (Read-Only)</label>
                        <input type="email" id="email" class="form-control" value="<c:out value='${user.email}' />" readonly style="background: #f1f5f9; cursor: not-allowed;">
                    </div>

                    <div class="form-group">
                        <label>Member Since</label>
                        <input type="text" class="form-control" value="<c:out value='${user.createdAt}' />" readonly style="background: #f1f5f9; cursor: not-allowed;">
                    </div>

                    <button type="submit" class="btn btn-primary">Update Profile</button>
                </form>
            </div>

            <!-- Password Security Card -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Security &amp; Password</h3>
                </div>

                <form action="${pageContext.request.contextPath}/profile" method="POST">
                    <input type="hidden" name="action" value="changePassword">

                    <div class="form-group">
                        <label for="currentPassword">Current Password</label>
                        <input type="password" id="currentPassword" name="currentPassword" class="form-control" required>
                    </div>

                    <div class="form-group">
                        <label for="newPassword">New Password (Min. 6 chars)</label>
                        <input type="password" id="newPassword" name="newPassword" class="form-control" minlength="6" required>
                    </div>

                    <div class="form-group">
                        <label for="confirmPassword">Confirm New Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" class="form-control" minlength="6" required>
                    </div>

                    <button type="submit" class="btn btn-secondary">Change Password</button>
                </form>
            </div>
        </div>
    </main>
</div>

<jsp:include page="/WEB-INF/jsp/includes/footer.jsp" />
