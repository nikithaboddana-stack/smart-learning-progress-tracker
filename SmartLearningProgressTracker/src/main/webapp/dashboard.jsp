<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="pageTitle" value="Dashboard - Smart Learning Progress Tracker" />
<c:set var="activePage" value="dashboard" />

<jsp:include page="/WEB-INF/jsp/includes/header.jsp" />
<jsp:include page="/WEB-INF/jsp/includes/sidebar.jsp" />

<div class="main-wrapper">
    <header class="top-navbar">
        <h1 class="page-title">Dashboard Overview</h1>
        <div class="top-actions">
            <div class="streak-pill">
                <span>🔥</span>
                <span>${stats.currentStreak} Day Streak</span>
            </div>
            <a href="${pageContext.request.contextPath}/study-sessions" class="btn btn-primary btn-sm">
                <span>⏱️</span> Log Study Time
            </a>
        </div>
    </header>

    <main class="content-container">
        <!-- Welcome Banner -->
        <div class="card" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff; border: none;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                <div>
                    <h2 style="font-size: 1.5rem; margin-bottom: 6px;">Welcome back, <c:out value="${sessionScope.userName}" />! 🎓</h2>
                    <p style="color: #94a3b8; font-size: 0.95rem;">
                        You have completed <strong>${stats.completedTasks}</strong> tasks and logged <strong>${stats.weeklyStudyHours} hrs</strong> of study this week.
                    </p>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 0.8rem; text-transform: uppercase; color: #94a3b8;">Syllabus Mastery</div>
                    <div style="font-size: 1.8rem; font-weight: 800; color: #38bdf8;">${stats.overallProgress}%</div>
                </div>
            </div>
        </div>

        <!-- 8 Core Metrics Grid -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon" style="background: #e0f2fe; color: #0284c7;">📊</div>
                <div>
                    <div class="stat-number">${stats.overallProgress}%</div>
                    <div class="stat-label">Overall Progress</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: #fef3c7; color: #d97706;">⏱️</div>
                <div>
                    <div class="stat-number">${stats.todayStudyHours}h</div>
                    <div class="stat-label">Today's Study</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: #ede9fe; color: #7c3aed;">📅</div>
                <div>
                    <div class="stat-number">${stats.weeklyStudyHours}h</div>
                    <div class="stat-label">Weekly Hours</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: #dcfce7; color: #16a34a;">🔥</div>
                <div>
                    <div class="stat-number">${stats.currentStreak} <span style="font-size: 0.9rem; font-weight: normal; color: #64748b;">(Best: ${stats.longestStreak})</span></div>
                    <div class="stat-label">Study Streak</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: #dbeafe; color: #2563eb;">📚</div>
                <div>
                    <div class="stat-number">${stats.totalSubjects}</div>
                    <div class="stat-label">Total Subjects</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: #fee2e2; color: #dc2626;">📝</div>
                <div>
                    <div class="stat-number">${stats.averageTestScore}%</div>
                    <div class="stat-label">Average Test Score</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: #ecfdf5; color: #059669;">✅</div>
                <div>
                    <div class="stat-number">${stats.completedTasks}</div>
                    <div class="stat-label">Completed Tasks</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: #fff1f2; color: #e11d48;">⏳</div>
                <div>
                    <div class="stat-number">${stats.pendingTasks}</div>
                    <div class="stat-label">Pending Tasks</div>
                </div>
            </div>
        </div>

        <!-- Smart Recommendations Section -->
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">💡 Smart Study Recommendations</h3>
                <a href="${pageContext.request.contextPath}/assistant" class="btn btn-secondary btn-sm">Consult Assistant</a>
            </div>

            <c:choose>
                <c:when test="${not empty recommendations}">
                    <c:forEach var="rec" items="${recommendations}">
                        <div class="recommendation-card ${rec.type}">
                            <div>
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                    <span class="badge ${rec.type == 'URGENT' ? 'badge-high' : (rec.type == 'WARNING' ? 'badge-medium' : 'badge-completed')}">
                                        <c:out value="${rec.type}" />
                                    </span>
                                    <strong style="font-size: 0.95rem;"><c:out value="${rec.title}" /></strong>
                                </div>
                                <p style="color: var(--text-muted); font-size: 0.88rem; margin: 0;"><c:out value="${rec.message}" /></p>
                            </div>
                            <c:if test="${not empty rec.actionLink}">
                                <a href="${pageContext.request.contextPath}/${rec.actionLink}" class="btn btn-secondary btn-sm" style="white-space: nowrap; margin-left: 16px;">
                                    <c:out value="${rec.actionText}" /> &rarr;
                                </a>
                            </c:if>
                        </div>
                    </c:forEach>
                </c:when>
                <c:otherwise>
                    <p style="color: var(--text-muted);">No recommendations available right now. Keep up the good work!</p>
                </c:otherwise>
            </c:choose>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <!-- Upcoming Deadlines -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">⏰ Upcoming Deadlines</h3>
                    <a href="${pageContext.request.contextPath}/tasks" class="btn btn-secondary btn-sm">View All</a>
                </div>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Due Date</th>
                                <th>Priority</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <c:forEach var="task" items="${stats.upcomingDeadlines}">
                                <tr>
                                    <td>
                                        <strong><c:out value="${task.title}" /></strong>
                                        <c:if test="${not empty task.subjectName}">
                                            <div style="font-size: 0.78rem; color: var(--text-muted);"><c:out value="${task.subjectName}" /></div>
                                        </c:if>
                                    </td>
                                    <td><c:out value="${task.dueDate}" /></td>
                                    <td>
                                        <span class="badge ${task.priority == 'High' ? 'badge-high' : (task.priority == 'Medium' ? 'badge-medium' : 'badge-low')}">
                                            <c:out value="${task.priority}" />
                                        </span>
                                    </td>
                                    <td>
                                        <form action="${pageContext.request.contextPath}/tasks" method="POST" style="display:inline;">
                                            <input type="hidden" name="action" value="updateStatus">
                                            <input type="hidden" name="id" value="${task.id}">
                                            <input type="hidden" name="status" value="Completed">
                                            <button type="submit" class="btn btn-success btn-sm">Done</button>
                                        </form>
                                    </td>
                                </tr>
                            </c:forEach>
                            <c:if test="${empty stats.upcomingDeadlines}">
                                <tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No pending deadlines due soon!</td></tr>
                            </c:if>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Subject Progress Snapshot -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">📚 Subject Mastery</h3>
                    <a href="${pageContext.request.contextPath}/subjects" class="btn btn-secondary btn-sm">Manage</a>
                </div>
                <div>
                    <c:forEach var="subj" items="${stats.subjectSummaries}">
                        <div style="margin-bottom: 16px;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 4px;">
                                <span><strong><c:out value="${subj.name}" /></strong></span>
                                <span>${subj.overallProgress}% <span style="color: var(--text-muted); font-size: 0.8rem;">(Target: ${subj.targetPercentage}%)</span></span>
                            </div>
                            <div class="progress-container">
                                <div class="progress-bar ${subj.overallProgress >= subj.targetPercentage ? 'success' : (subj.overallProgress >= 50 ? 'warning' : 'danger')}" 
                                     style="width: ${subj.overallProgress}%;"></div>
                            </div>
                        </div>
                    </c:forEach>
                    <c:if test="${empty stats.subjectSummaries}">
                        <p style="color: var(--text-muted); text-align: center;">No subjects registered yet.</p>
                    </c:if>
                </div>
            </div>
        </div>

    </main>
</div>

<jsp:include page="/WEB-INF/jsp/includes/footer.jsp" />
