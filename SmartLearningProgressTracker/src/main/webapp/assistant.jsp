<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="pageTitle" value="Smart Assistant & Study Planner - Smart Learning Progress Tracker" />
<c:set var="activePage" value="assistant" />

<jsp:include page="/WEB-INF/jsp/includes/header.jsp" />
<jsp:include page="/WEB-INF/jsp/includes/sidebar.jsp" />

<div class="main-wrapper">
    <header class="top-navbar">
        <h1 class="page-title">AI Study Assistant &amp; Planner</h1>
    </header>

    <main class="content-container">
        <!-- Interactive Rule-Based Assistant Section -->
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">🤖 Rule-Based Study Consultant</h3>
                <span class="badge badge-in-progress">Database-Grounded Analysis</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 16px;">
                Select a query below. The assistant evaluates your live MySQL database records (test scores, streaks, weak topics, and deadlines) to generate personalized academic advice.
            </p>

            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;">
                <a href="${pageContext.request.contextPath}/assistant?queryType=how_am_i_doing" 
                   class="btn ${selectedQuery == 'how_am_i_doing' ? 'btn-primary' : 'btn-secondary'} btn-sm">
                    📊 How am I doing?
                </a>
                <a href="${pageContext.request.contextPath}/assistant?queryType=what_to_study_today" 
                   class="btn ${selectedQuery == 'what_to_study_today' ? 'btn-primary' : 'btn-secondary'} btn-sm">
                    🎯 What should I study today?
                </a>
                <a href="${pageContext.request.contextPath}/assistant?queryType=which_subjects_need_attention" 
                   class="btn ${selectedQuery == 'which_subjects_need_attention' ? 'btn-primary' : 'btn-secondary'} btn-sm">
                    ⚠️ Which subjects need attention?
                </a>
                <a href="${pageContext.request.contextPath}/assistant?queryType=show_weak_topics" 
                   class="btn ${selectedQuery == 'show_weak_topics' ? 'btn-primary' : 'btn-secondary'} btn-sm">
                    🔍 Show my weak topics
                </a>
                <a href="${pageContext.request.contextPath}/assistant?queryType=give_study_plan" 
                   class="btn ${selectedQuery == 'give_study_plan' ? 'btn-primary' : 'btn-secondary'} btn-sm">
                    📋 Give me a study strategy
                </a>
            </div>

            <c:if test="${not empty assistantResponse}">
                <div style="background: #f8fafc; border: 1px solid var(--border-color); border-left: 4px solid var(--primary); border-radius: var(--radius-md); padding: 20px; font-size: 0.95rem; line-height: 1.7;">
                    <div style="white-space: pre-wrap;"><c:out value="${assistantResponse}" /></div>
                </div>
            </c:if>

            <c:if test="${empty assistantResponse}">
                <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: var(--radius-md); padding: 24px; text-align: center; color: var(--text-muted);">
                    Click any query button above to run an instant analysis of your progress!
                </div>
            </c:if>
        </div>

        <!-- Smart Study Plan Generator Section -->
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">📅 Smart Weekly Study Planner</h3>
            </div>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">
                Enter your available weekly study hours and optional exam date. The algorithmic planner schedules priority subjects and targets your identified weak topics.
            </p>

            <form action="${pageContext.request.contextPath}/assistant" method="POST" style="margin-bottom: 24px;">
                <input type="hidden" name="action" value="generatePlan">
                <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 16px; align-items: flex-end;">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label for="weeklyHours">Available Weekly Study Hours</label>
                        <input type="number" id="weeklyHours" name="weeklyHours" class="form-control" 
                               value="${weeklyHours != null ? weeklyHours : 14}" min="1" max="80" step="1" required>
                    </div>

                    <div class="form-group" style="margin-bottom: 0;">
                        <label for="examDate">Upcoming Major Exam Date</label>
                        <input type="date" id="examDate" name="examDate" class="form-control" value="${examDate}">
                    </div>

                    <button type="submit" class="btn btn-primary" style="padding: 10px 20px; height: 42px;">
                        Generate Schedule
                    </button>
                </div>
            </form>

            <c:if test="${not empty studyPlan}">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Subject</th>
                                <th>Priority</th>
                                <th>Allocated Time</th>
                                <th>Recommended Topic</th>
                                <th>Focus Strategy</th>
                            </tr>
                        </thead>
                        <tbody>
                            <c:forEach var="item" items="${studyPlan}">
                                <tr>
                                    <td><strong><c:out value="${item.dayOfWeek}" /></strong></td>
                                    <td><strong><c:out value="${item.subjectName}" /></strong></td>
                                    <td>
                                        <span class="badge ${item.priorityBadge == 'High' ? 'badge-high' : (item.priorityBadge == 'Medium' ? 'badge-medium' : 'badge-low')}">
                                            <c:out value="${item.priorityBadge}" />
                                        </span>
                                    </td>
                                    <td><strong>${item.allocatedHours} hrs</strong></td>
                                    <td><c:out value="${item.topicRecommendation}" /></td>
                                    <td><span class="badge badge-low"><c:out value="${item.focusArea}" /></span></td>
                                </tr>
                            </c:forEach>
                        </tbody>
                    </table>
                </div>
            </c:if>
        </div>
    </main>
</div>

<jsp:include page="/WEB-INF/jsp/includes/footer.jsp" />
