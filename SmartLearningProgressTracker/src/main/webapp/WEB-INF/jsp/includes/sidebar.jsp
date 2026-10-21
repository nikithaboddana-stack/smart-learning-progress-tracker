<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>

<aside class="sidebar">
    <div class="sidebar-header">
        <h2><span>⚡</span> Smart Tracker</h2>
    </div>

    <nav class="sidebar-nav">
        <div class="nav-category">Main Menu</div>
        <a href="${pageContext.request.contextPath}/dashboard" class="nav-link ${activePage == 'dashboard' ? 'active' : ''}">
            <span>📊</span> Dashboard
        </a>
        <a href="${pageContext.request.contextPath}/subjects" class="nav-link ${activePage == 'subjects' ? 'active' : ''}">
            <span>📚</span> Subjects
        </a>
        <a href="${pageContext.request.contextPath}/topics" class="nav-link ${activePage == 'topics' ? 'active' : ''}">
            <span>📑</span> Topics
        </a>
        <a href="${pageContext.request.contextPath}/tasks" class="nav-link ${activePage == 'tasks' ? 'active' : ''}">
            <span>✅</span> Study Tasks
        </a>
        <a href="${pageContext.request.contextPath}/study-sessions" class="nav-link ${activePage == 'sessions' ? 'active' : ''}">
            <span>⏱️</span> Study Sessions
        </a>

        <div class="nav-category">Performance &amp; Intelligence</div>
        <a href="${pageContext.request.contextPath}/goals" class="nav-link ${activePage == 'goals' ? 'active' : ''}">
            <span>🎯</span> Learning Goals
        </a>
        <a href="${pageContext.request.contextPath}/tests" class="nav-link ${activePage == 'tests' ? 'active' : ''}">
            <span>📝</span> Tests &amp; Quizzes
        </a>
        <a href="${pageContext.request.contextPath}/analytics" class="nav-link ${activePage == 'analytics' ? 'active' : ''}">
            <span>📈</span> Analytics
        </a>
        <a href="${pageContext.request.contextPath}/assistant" class="nav-link ${activePage == 'assistant' ? 'active' : ''}">
            <span>🤖</span> AI Study Assistant
        </a>

        <div class="nav-category">Account</div>
        <a href="${pageContext.request.contextPath}/profile" class="nav-link ${activePage == 'profile' ? 'active' : ''}">
            <span>👤</span> Profile &amp; Settings
        </a>
        <a href="${pageContext.request.contextPath}/logout" class="nav-link">
            <span>🚪</span> Log Out
        </a>
    </nav>

    <div class="sidebar-footer">
        <div class="user-snippet">
            <div>
                <div class="user-name"><c:out value="${sessionScope.userName != null ? sessionScope.userName : 'Student'}" /></div>
                <div class="user-role"><c:out value="${sessionScope.userEmail != null ? sessionScope.userEmail : 'Logged In'}" /></div>
            </div>
        </div>
    </div>
</aside>
