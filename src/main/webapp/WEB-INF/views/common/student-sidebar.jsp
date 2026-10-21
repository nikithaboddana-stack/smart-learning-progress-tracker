<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<aside class="sidebar bg-dark text-white d-flex flex-column shrink-0">
    <div class="sidebar-header p-4 border-bottom border-secondary-subtle d-flex align-items-center gap-2">
        <span class="fs-4">⚡</span>
        <div>
            <h5 class="fw-bold m-0 text-white fs-6">Smart Tracker</h5>
            <span class="text-info text-uppercase" style="font-size: 0.65rem; letter-spacing: 0.05em;">Student Academic Portal</span>
        </div>
    </div>

    <nav class="sidebar-nav p-3 flex-grow-1 overflow-y-auto">
        <div class="nav-section-title">Academic Modules</div>
        
        <a href="${pageContext.request.contextPath}/student/dashboard" 
           class="nav-link-custom ${activeTab == 'dashboard' ? 'active' : ''}">
            <span>📊</span> Dashboard
        </a>
        <a href="${pageContext.request.contextPath}/student/subjects" 
           class="nav-link-custom ${activeTab == 'subjects' ? 'active' : ''}">
            <span>📚</span> My Subjects
        </a>
        <a href="${pageContext.request.contextPath}/student/marks" 
           class="nav-link-custom ${activeTab == 'marks' ? 'active' : ''}">
            <span>📝</span> Marks &amp; Tests
        </a>
        <a href="${pageContext.request.contextPath}/student/sessions" 
           class="nav-link-custom ${activeTab == 'sessions' ? 'active' : ''}">
            <span>⏱️</span> Study Sessions
        </a>
        <a href="${pageContext.request.contextPath}/student/planner" 
           class="nav-link-custom ${activeTab == 'planner' ? 'active' : ''}">
            <span>📅</span> Weekly Planner
        </a>

        <div class="nav-section-title mt-3">Intelligence &amp; Growth</div>
        <a href="${pageContext.request.contextPath}/student/assistant" 
           class="nav-link-custom ${activeTab == 'assistant' ? 'active' : ''}">
            <span>🤖</span> AI Study Assistant
        </a>
        <a href="${pageContext.request.contextPath}/student/analytics" 
           class="nav-link-custom ${activeTab == 'analytics' ? 'active' : ''}">
            <span>📈</span> Analytics
        </a>

        <div class="nav-section-title mt-3">Account</div>
        <a href="${pageContext.request.contextPath}/student/profile" 
           class="nav-link-custom ${activeTab == 'profile' ? 'active' : ''}">
            <span>👤</span> My Profile
        </a>
        <a href="${pageContext.request.contextPath}/logout" class="nav-link-custom text-danger-emphasis">
            <span>🚪</span> Logout
        </a>
    </nav>

    <div class="sidebar-footer p-3 border-top border-secondary-subtle bg-black bg-opacity-25">
        <div class="d-flex align-items-center gap-2">
            <div class="user-avatar-small bg-primary text-white">🎓</div>
            <div class="overflow-hidden">
                <div class="fw-semibold small text-truncate text-white"><c:out value="${sessionScope.userName}" /></div>
                <div class="text-secondary small text-truncate" style="font-size: 0.72rem;"><c:out value="${sessionScope.userDepartment}" /></div>
            </div>
        </div>
    </div>
</aside>
