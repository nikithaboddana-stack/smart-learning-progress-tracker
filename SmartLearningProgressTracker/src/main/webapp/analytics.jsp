<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="pageTitle" value="Performance Analytics - Smart Learning Progress Tracker" />
<c:set var="activePage" value="analytics" />

<jsp:include page="/WEB-INF/jsp/includes/header.jsp" />
<jsp:include page="/WEB-INF/jsp/includes/sidebar.jsp" />

<div class="main-wrapper">
    <header class="top-navbar">
        <h1 class="page-title">Learning Analytics &amp; Visualizations</h1>
    </header>

    <main class="content-container">
        <!-- Overview Grid -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon" style="background: #e0f2fe; color: #0284c7;">📊</div>
                <div>
                    <div class="stat-number">${overallProgress}%</div>
                    <div class="stat-label">Syllabus Completion</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: #fef3c7; color: #d97706;">⏱️</div>
                <div>
                    <div class="stat-number">${totalHours}h</div>
                    <div class="stat-label">All-Time Study</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: #ecfdf5; color: #059669;">✅</div>
                <div>
                    <div class="stat-number">${taskCompletionRate}%</div>
                    <div class="stat-label">Task Completion Rate</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: #dcfce7; color: #16a34a;">🔥</div>
                <div>
                    <div class="stat-number">${currentStreak} days</div>
                    <div class="stat-label">Active Streak</div>
                </div>
            </div>
        </div>

        <!-- Strong vs Weak Subjects -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
            <div class="card" style="border-left: 4px solid var(--success);">
                <div class="card-header">
                    <h3 class="card-title" style="color: var(--success);">🌟 Strong Subjects</h3>
                </div>
                <c:choose>
                    <c:when test="${not empty strongSubjects}">
                        <ul style="list-style-type: none; padding: 0;">
                            <c:forEach var="s" items="${strongSubjects}">
                                <li style="padding: 8px 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between;">
                                    <strong><c:out value="${s.name}" /></strong>
                                    <span>${s.overallProgress}% completion</span>
                                </li>
                            </c:forEach>
                        </ul>
                    </c:when>
                    <c:otherwise>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Keep studying! More data will highlight your strengths.</p>
                    </c:otherwise>
                </c:choose>
            </div>

            <div class="card" style="border-left: 4px solid var(--danger);">
                <div class="card-header">
                    <h3 class="card-title" style="color: var(--danger);">⚠️ Areas Needing Focus</h3>
                </div>
                <c:choose>
                    <c:when test="${not empty weakSubjects}">
                        <ul style="list-style-type: none; padding: 0;">
                            <c:forEach var="w" items="${weakSubjects}">
                                <li style="padding: 8px 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between;">
                                    <strong><c:out value="${w.name}" /></strong>
                                    <span style="color: var(--danger);">${w.overallProgress}% (Target: ${w.targetPercentage}%)</span>
                                </li>
                            </c:forEach>
                        </ul>
                    </c:when>
                    <c:otherwise>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">No critically lagging subjects detected! Excellent work.</p>
                    </c:otherwise>
                </c:choose>
            </div>
        </div>

        <!-- Chart.js Visualizations (with HTML fallback) -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 24px;">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Subject Progress vs Target Comparison</h3>
                </div>
                <div style="position: relative; height: 320px;">
                    <canvas id="subjectChart"></canvas>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Task Distribution</h3>
                </div>
                <div style="position: relative; height: 320px;">
                    <canvas id="taskChart"></canvas>
                </div>
            </div>
        </div>

        <!-- HTML Fallback Table for Core Progress -->
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Detailed Subject Performance Breakdown</h3>
            </div>
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Priority</th>
                            <th>Current Progress</th>
                            <th>Target</th>
                            <th>Avg Test Score</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <c:forEach var="s" items="${subjects}">
                            <tr>
                                <td><strong><c:out value="${s.name}" /></strong></td>
                                <td>
                                    <span class="badge ${s.priority == 'High' ? 'badge-high' : (s.priority == 'Medium' ? 'badge-medium' : 'badge-low')}">
                                        <c:out value="${s.priority}" />
                                    </span>
                                </td>
                                <td style="min-width: 140px;">
                                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
                                        <span>${s.overallProgress}%</span>
                                    </div>
                                    <div class="progress-container">
                                        <div class="progress-bar ${s.overallProgress >= s.targetPercentage ? 'success' : (s.overallProgress >= 50 ? 'warning' : 'danger')}" 
                                             style="width: ${s.overallProgress}%;"></div>
                                    </div>
                                </td>
                                <td>${s.targetPercentage}%</td>
                                <td>
                                    <c:choose>
                                        <c:when test="${not empty testAverages[s.name]}">
                                            <strong>${testAverages[s.name]}%</strong>
                                        </c:when>
                                        <c:otherwise><span style="color: var(--text-muted);">&ndash;</span></c:otherwise>
                                    </c:choose>
                                </td>
                                <td>
                                    <c:choose>
                                        <c:when test="${s.overallProgress >= s.targetPercentage}">
                                            <span class="badge badge-completed">On Target</span>
                                        </c:when>
                                        <c:otherwise>
                                            <span class="badge badge-medium">Needs Attention</span>
                                        </c:otherwise>
                                    </c:choose>
                                </td>
                            </tr>
                        </c:forEach>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</div>

<script>
// Chart.js Rendering with Fallback
window.addEventListener('load', function() {
    if (typeof Chart === 'undefined') return;

    // 1. Subject Comparison Chart
    var subjectLabels = [];
    var subjectProgress = [];
    var subjectTargets = [];

    <c:forEach var="s" items="${subjects}">
        subjectLabels.push('<c:out value="${s.name}" />');
        subjectProgress.push(${s.overallProgress});
        subjectTargets.push(${s.targetPercentage});
    </c:forEach>

    var ctx1 = document.getElementById('subjectChart');
    if (ctx1 && subjectLabels.length > 0) {
        new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: subjectLabels,
                datasets: [
                    {
                        label: 'Current Progress (%)',
                        data: subjectProgress,
                        backgroundColor: '#3b82f6',
                        borderRadius: 6
                    },
                    {
                        label: 'Target Percentage (%)',
                        data: subjectTargets,
                        backgroundColor: '#cbd5e1',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, max: 100 }
                }
            }
        });
    }

    // 2. Task Doughnut Chart
    var ctx2 = document.getElementById('taskChart');
    if (ctx2) {
        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Pending', 'In Progress', 'Overdue'],
                datasets: [{
                    data: [
                        ${taskCounts['Completed']},
                        ${taskCounts['Pending']},
                        ${taskCounts['In Progress']},
                        ${taskCounts['Overdue']}
                    ],
                    backgroundColor: ['#22c55e', '#f59e0b', '#3b82f6', '#ef4444']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
});
</script>

<jsp:include page="/WEB-INF/jsp/includes/footer.jsp" />
