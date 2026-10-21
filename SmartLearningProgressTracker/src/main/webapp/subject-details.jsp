<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="pageTitle" value="${subject.name} - Syllabus Details" />
<c:set var="activePage" value="subjects" />

<jsp:include page="/WEB-INF/jsp/includes/header.jsp" />
<jsp:include page="/WEB-INF/jsp/includes/sidebar.jsp" />

<div class="main-wrapper">
    <header class="top-navbar">
        <div style="display: flex; align-items: center; gap: 12px;">
            <a href="${pageContext.request.contextPath}/subjects" class="btn btn-secondary btn-sm">&larr; Back to Subjects</a>
            <h1 class="page-title"><c:out value="${subject.name}" /></h1>
        </div>
        <a href="${pageContext.request.contextPath}/topics?subjectId=${subject.id}" class="btn btn-primary btn-sm">
            <span>➕</span> Manage Syllabus Topics
        </a>
    </header>

    <main class="content-container">
        <!-- Subject Overview Card -->
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
                <div>
                    <span class="badge ${subject.priority == 'High' ? 'badge-high' : (subject.priority == 'Medium' ? 'badge-medium' : 'badge-low')}">
                        <c:out value="${subject.priority}" /> Priority
                    </span>
                    <p style="color: var(--text-muted); margin-top: 8px; font-size: 0.95rem;"><c:out value="${subject.description}" /></p>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Overall Completion</div>
                    <div style="font-size: 2rem; font-weight: 800; color: var(--primary);">${subject.overallProgress}%</div>
                    <div style="font-size: 0.82rem; color: var(--text-muted);">Target: ${subject.targetPercentage}%</div>
                </div>
            </div>

            <div class="progress-container" style="margin-top: 16px;">
                <div class="progress-bar ${subject.overallProgress >= subject.targetPercentage ? 'success' : (subject.overallProgress >= 50 ? 'warning' : 'danger')}" 
                     style="width: ${subject.overallProgress}%;"></div>
            </div>
        </div>

        <!-- Topics in this Subject -->
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Syllabus Chapters / Topics (${topics.size()})</h3>
                <a href="${pageContext.request.contextPath}/topics?subjectId=${subject.id}" class="btn btn-secondary btn-sm">Add Topic</a>
            </div>

            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Topic Name</th>
                            <th>Difficulty</th>
                            <th>Status</th>
                            <th>Progress</th>
                            <th>Confidence</th>
                            <th>Last Studied</th>
                            <th>Revisions</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <c:forEach var="topic" items="${topics}">
                            <tr>
                                <td>
                                    <strong><c:out value="${topic.name}" /></strong>
                                    <div style="font-size: 0.8rem; color: var(--text-muted);"><c:out value="${topic.description}" /></div>
                                </td>
                                <td>
                                    <span class="badge ${topic.difficulty == 'Hard' ? 'badge-high' : (topic.difficulty == 'Medium' ? 'badge-medium' : 'badge-low')}">
                                        <c:out value="${topic.difficulty}" />
                                    </span>
                                </td>
                                <td>
                                    <span class="badge ${topic.status == 'Completed' ? 'badge-completed' : (topic.status == 'In Progress' ? 'badge-in-progress' : 'badge-not-started')}">
                                        <c:out value="${topic.status}" />
                                    </span>
                                </td>
                                <td style="min-width: 140px;">
                                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
                                        <span>${topic.progressPercentage}%</span>
                                    </div>
                                    <div class="progress-container">
                                        <div class="progress-bar" style="width: ${topic.progressPercentage}%;"></div>
                                    </div>
                                </td>
                                <td>
                                    <span title="${topic.confidenceLevel} out of 5 stars">
                                        <c:forEach begin="1" end="${topic.confidenceLevel}">⭐</c:forEach>
                                    </span>
                                </td>
                                <td><c:out value="${topic.lastStudied != null ? topic.lastStudied : 'Never'}" /></td>
                                <td><strong>${topic.revisionCount}</strong> times</td>
                                <td>
                                    <form action="${pageContext.request.contextPath}/topics" method="POST" style="display:inline;">
                                        <input type="hidden" name="action" value="incrementRevision">
                                        <input type="hidden" name="id" value="${topic.id}">
                                        <input type="hidden" name="subjectId" value="${subject.id}">
                                        <button type="submit" class="btn btn-secondary btn-sm" title="Mark Revised">+1 Revise</button>
                                    </form>
                                </td>
                            </tr>
                        </c:forEach>
                        <c:if test="${empty topics}">
                            <tr>
                                <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px;">
                                    No syllabus chapters added for this subject yet.
                                </td>
                            </tr>
                        </c:if>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</div>

<jsp:include page="/WEB-INF/jsp/includes/footer.jsp" />
