<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<aside class="sidebar bg-dark text-white d-flex flex-column shrink-0">
    <div class="sidebar-header p-4 border-bottom border-secondary-subtle d-flex align-items-center gap-2">
        <span class="fs-4">🛡️</span>
        <div>
            <h5 class="fw-bold m-0 text-white fs-6">Smart Tracker</h5>
            <span class="text-warning text-uppercase" style="font-size: 0.65rem; letter-spacing: 0.05em;">Admin Control Center</span>
        </div>
    </div>

    <nav class="sidebar-nav p-3 flex-grow-1 overflow-y-auto">
        <div class="nav-section-title">Institutional Overview</div>
        
        <a href="${pageContext.request.contextPath}/admin/dashboard" 
           class="nav-link-custom ${activeTab == 'admin-dashboard' ? 'active' : ''}">
            <span>📊</span> Admin Dashboard
        </a>
        <a href="${pageContext.request.contextPath}/admin/students" 
           class="nav-link-custom ${activeTab == 'admin-users' ? 'active' : ''}">
            <span>👥</span> Student Management
        </a>
        <a href="${pageContext.request.contextPath}/admin/subjects" 
           class="nav-link-custom ${activeTab == 'admin-subjects' ? 'active' : ''}">
            <span>📚</span> Master Curriculum
        </a>
        <a href="${pageContext.request.contextPath}/admin/tests" 
           class="nav-link-custom ${activeTab == 'admin-tests' ? 'active' : ''}">
            <span>📝</span> Exams &amp; Grading
        </a>

        <div class="nav-section-title mt-3">Session</div>
        <a href="${pageContext.request.contextPath}/logout" class="nav-link-custom text-danger-emphasis">
            <span>🚪</span> Sign Out
        </a>
    </nav>

    <div class="sidebar-footer p-3 border-top border-secondary-subtle bg-black bg-opacity-25">
        <div class="d-flex align-items-center gap-2">
            <div class="user-avatar-small bg-warning text-dark">🛡️</div>
            <div class="overflow-hidden">
                <div class="fw-semibold small text-truncate text-white">System Administrator</div>
                <div class="text-secondary small text-truncate" style="font-size: 0.72rem;">Full RBAC Rights</div>
            </div>
        </div>
    </div>
</aside>
