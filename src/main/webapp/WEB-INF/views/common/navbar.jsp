<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<header class="top-navbar bg-white border-bottom px-4 py-2.5 d-flex align-items-center justify-content-between sticky-top shadow-2xs">
    <div class="d-flex align-items-center gap-3">
        <button class="btn btn-sm btn-light d-md-none border" id="sidebarToggle">☰</button>
        <div class="fw-bold text-dark fs-6">${pageTitle != null ? pageTitle : "Smart Tracker"}</div>
    </div>

    <div class="d-flex align-items-center gap-3">
        <c:if test="${sessionScope.userRole == 'STUDENT'}">
            <a href="${pageContext.request.contextPath}/student/sessions" class="streak-badge text-decoration-none">
                <span>🔥</span>
                <span>${dashboard.currentStreak != null ? dashboard.currentStreak : 4} Day Streak</span>
            </a>
        </c:if>

        <div class="dropdown">
            <button class="btn btn-sm btn-light border dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
                <span class="user-avatar-small">👤</span>
                <span class="fw-semibold small">${sessionScope.userName}</span>
                <span class="badge bg-primary-subtle text-primary border border-primary-subtle text-uppercase">${sessionScope.userRole}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm small">
                <c:if test="${sessionScope.userRole == 'STUDENT'}">
                    <li><a class="dropdown-item" href="${pageContext.request.contextPath}/student/profile">👤 Profile Settings</a></li>
                    <li><a class="dropdown-item" href="${pageContext.request.contextPath}/student/assistant">🤖 AI Consultant</a></li>
                </c:if>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="${pageContext.request.contextPath}/logout">🚪 Sign Out</a></li>
            </ul>
        </div>
    </div>
</header>
