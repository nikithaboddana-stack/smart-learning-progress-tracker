<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="pageTitle" value="Student Academic Dashboard" />
<c:set var="activeTab" value="dashboard" />

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle} — Smart Tracker</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/modern-dashboard.css">
</head>
<body>

<div class="app-layout">
    <jsp:include page="/WEB-INF/views/common/student-sidebar.jsp" />

    <div class="flex-grow-1 d-flex flex-column overflow-x-hidden">
        <jsp:include page="/WEB-INF/views/common/navbar.jsp" />

        <main class="p-4 p-lg-5">
            <!-- Personalized Welcome Banner -->
            <div class="card border-0 bg-dark text-white rounded-4 p-4 mb-4 shadow-sm" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h2 class="fw-bold fs-3 mb-1">${greeting}, <c:out value="${studentFirstName}" /> 👋</h2>
                        <p class="text-secondary small mb-0">Here's your academic overview and study trajectory for today.</p>
                    </div>
                    <div class="d-flex gap-2">
                        <a href="${pageContext.request.contextPath}/student/assistant" class="btn btn-outline-info btn-sm fw-semibold">
                            🤖 Ask AI Assistant
                        </a>
                        <a href="${pageContext.request.contextPath}/student/sessions" class="btn btn-primary btn-sm fw-semibold">
                            ⏱️ Start Study Session
                        </a>
                    </div>
                </div>
            </div>

            <!-- 6 Key Academic Metrics -->
            <div class="row g-3 mb-4">
                <div class="col-6 col-md-4 col-xl-2">
                    <div class="stat-box">
                        <div class="stat-label">Overall Standing</div>
                        <div class="stat-val text-primary">${dashboard.overallPerformance}%</div>
                        <div class="progress mt-2" style="height: 5px;">
                            <div class="progress-bar bg-primary" style="width: ${dashboard.overallPerformance}%;"></div>
                        </div>
                    </div>
                </div>

                <div class="col-6 col-md-4 col-xl-2">
                    <div class="stat-box">
                        <div class="stat-label">Enrolled Subjects</div>
                        <div class="stat-val text-dark">${dashboard.totalEnrolledSubjects}</div>
                        <span class="text-secondary small">Current Semester</span>
                    </div>
                </div>

                <div class="col-6 col-md-4 col-xl-2">
                    <div class="stat-box">
                        <div class="stat-label">Study Hours (7d)</div>
                        <div class="stat-val text-purple" style="color: #7c3aed;">${dashboard.weeklyStudyHours}h</div>
                        <span class="text-secondary small">Total: ${dashboard.totalStudyHours}h</span>
                    </div>
                </div>

                <div class="col-6 col-md-4 col-xl-2">
                    <div class="stat-box">
                        <div class="stat-label">Tests Completed</div>
                        <div class="stat-val text-info">${dashboard.testsCompleted}</div>
                        <span class="text-secondary small">Evaluated</span>
                    </div>
                </div>

                <div class="col-6 col-md-4 col-xl-2">
                    <div class="stat-box">
                        <div class="stat-label">Weak Subjects</div>
                        <div class="stat-val text-danger">${dashboard.weakSubjectsCount}</div>
                        <span class="text-secondary small">Below Target</span>
                    </div>
                </div>

                <div class="col-6 col-md-4 col-xl-2">
                    <div class="stat-box">
                        <div class="stat-label">Study Streak</div>
                        <div class="stat-val text-warning">🔥 ${dashboard.currentStreak}d</div>
                        <span class="text-secondary small">Best: ${dashboard.longestStreak}d</span>
                    </div>
                </div>
            </div>

            <!-- Intelligent Recommendations Box -->
            <div class="card border-0 rounded-4 shadow-sm mb-4">
                <div class="card-header bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
                    <h5 class="fw-bold text-dark fs-6 m-0 d-flex align-items-center gap-2">
                        <span>💡</span> Intelligent Study Consultant Recommendations
                    </h5>
                    <span class="badge bg-light text-secondary border">Rule-Engine Analyzed</span>
                </div>
                <div class="card-body p-4">
                    <div class="row g-3">
                        <c:forEach var="rec" items="${dashboard.recommendations}">
                            <div class="col-md-6">
                                <div class="p-3 rounded-3 border-start border-4 bg-light d-flex justify-content-between align-items-center ${rec.type == 'URGENT' ? 'border-danger' : (rec.type == 'WARNING' ? 'border-warning' : 'border-success')}">
                                    <div>
                                        <div class="d-flex align-items-center gap-2">
                                            <span class="badge ${rec.type == 'URGENT' ? 'bg-danger' : (rec.type == 'WARNING' ? 'bg-warning text-dark' : 'bg-success')} text-uppercase" style="font-size: 0.65rem;">
                                                <c:out value="${rec.type}" />
                                            </span>
                                            <strong class="small text-dark"><c:out value="${rec.title}" /></strong>
                                        </div>
                                        <p class="small text-secondary m-0 mt-1"><c:out value="${rec.message}" /></p>
                                    </div>
                                    <c:if test="${not empty rec.actionLink}">
                                        <a href="${pageContext.request.contextPath}/student/${rec.actionLink}" class="btn btn-sm btn-white border ms-3 text-nowrap fw-semibold small">
                                            <c:out value="${rec.actionText}" /> &rarr;
                                        </a>
                                    </c:if>
                                </div>
                            </div>
                        </c:forEach>
                    </div>
                </div>
            </div>

            <div class="row g-4">
                <!-- Priority Academic Subjects Section -->
                <div class="col-lg-7">
                    <div class="card border-0 rounded-4 shadow-sm h-100">
                        <div class="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
                            <h5 class="fw-bold text-dark fs-6 m-0">📚 Subject Status &amp; Targets</h5>
                            <a href="${pageContext.request.contextPath}/student/subjects" class="text-primary small fw-semibold text-decoration-none">View All &rarr;</a>
                        </div>
                        <div class="card-body px-4 pb-4">
                            <div class="d-flex flex-column gap-3">
                                <c:forEach var="ss" items="${dashboard.subjects}">
                                    <div class="p-3 rounded-3 border bg-light-subtle">
                                        <div class="d-flex justify-content-between align-items-start mb-1">
                                            <div>
                                                <strong class="text-dark small"><c:out value="${ss.subjectName}" /></strong>
                                                <span class="text-muted small ms-1">(<c:out value="${ss.subjectCode}" />)</span>
                                            </div>
                                            <span class="badge ${ss.priority == 'HIGH' ? 'bg-danger-subtle text-danger border border-danger-subtle' : 'bg-secondary-subtle text-secondary'}">
                                                <c:out value="${ss.priority}" /> Priority
                                            </span>
                                        </div>

                                        <div class="d-flex justify-content-between small text-secondary mt-2 mb-1">
                                            <span>Current: <strong>${ss.currentPercentage}%</strong></span>
                                            <span>Target: <strong>${ss.targetPercentage}%</strong></span>
                                        </div>
                                        <div class="progress" style="height: 6px;">
                                            <div class="progress-bar ${ss.currentPercentage >= ss.targetPercentage ? 'bg-success' : (ss.currentPercentage >= 60 ? 'bg-warning' : 'bg-danger')}" 
                                                 style="width: ${ss.currentPercentage}%;"></div>
                                        </div>

                                        <c:if test="${ss.isLagging()}">
                                            <div class="small text-danger fw-semibold mt-2">
                                                ⚠️ Immediate Focus: 17% deficit from target. Prioritize revision topics.
                                            </div>
                                        </c:if>
                                    </div>
                                </c:forEach>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Upcoming Tests & Planner Schedule -->
                <div class="col-lg-5">
                    <div class="card border-0 rounded-4 shadow-sm mb-4">
                        <div class="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
                            <h5 class="fw-bold text-dark fs-6 m-0">⏰ Upcoming Tests</h5>
                            <a href="${pageContext.request.contextPath}/student/marks" class="text-primary small fw-semibold text-decoration-none">All Tests</a>
                        </div>
                        <div class="card-body px-4 pb-4">
                            <div class="d-flex flex-column gap-2">
                                <c:forEach var="test" items="${dashboard.upcomingTests}">
                                    <div class="p-2.5 rounded-2 border d-flex justify-content-between align-items-center small">
                                        <div>
                                            <div class="fw-semibold text-dark"><c:out value="${test.testName}" /></div>
                                            <div class="text-muted" style="font-size: 0.75rem;"><c:out value="${test.subjectName}" /> &bull; <c:out value="${test.testDate}" /></div>
                                        </div>
                                        <span class="badge bg-primary-subtle text-primary border">${test.maxMarks} Marks</span>
                                    </div>
                                </c:forEach>
                                <c:if test="${empty dashboard.upcomingTests}">
                                    <div class="text-center text-muted small py-3">No upcoming tests scheduled in next 14 days.</div>
                                </c:if>
                            </div>
                        </div>
                    </div>

                    <div class="card border-0 rounded-4 shadow-sm">
                        <div class="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
                            <h5 class="fw-bold text-dark fs-6 m-0">📅 Today's Study Plan</h5>
                            <a href="${pageContext.request.contextPath}/student/planner" class="text-primary small fw-semibold text-decoration-none">Open Planner</a>
                        </div>
                        <div class="card-body px-4 pb-4">
                            <div class="d-flex flex-column gap-2">
                                <c:forEach var="plan" items="${dashboard.todayPlans}">
                                    <div class="p-2.5 rounded-2 border d-flex justify-content-between align-items-center small">
                                        <div>
                                            <div class="fw-semibold text-dark"><c:out value="${plan.subjectName}" /></div>
                                            <div class="text-muted" style="font-size: 0.75rem;"><c:out value="${plan.focusNotes}" /></div>
                                        </div>
                                        <span class="badge bg-secondary-subtle text-dark">${plan.plannedMinutes} mins</span>
                                    </div>
                                </c:forEach>
                                <c:if test="${empty dashboard.todayPlans}">
                                    <div class="text-center text-muted small py-3">No study plans set for today. Schedule one in the Planner!</div>
                                </c:if>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    </div>
</div>

<jsp:include page="/WEB-INF/views/common/footer.jsp" />
