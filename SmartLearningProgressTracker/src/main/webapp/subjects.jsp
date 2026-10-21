<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="pageTitle" value="Subject Management - Smart Learning Progress Tracker" />
<c:set var="activePage" value="subjects" />

<jsp:include page="/WEB-INF/jsp/includes/header.jsp" />
<jsp:include page="/WEB-INF/jsp/includes/sidebar.jsp" />

<div class="main-wrapper">
    <header class="top-navbar">
        <h1 class="page-title">Subject Management</h1>
        <button onclick="openModal('addSubjectModal')" class="btn btn-primary btn-sm">
            <span>➕</span> Add New Subject
        </button>
    </header>

    <main class="content-container">
        <c:if test="${not empty param.msg}">
            <div class="alert alert-success"><c:out value="${param.msg}" /></div>
        </c:if>
        <c:if test="${not empty param.error}">
            <div class="alert alert-danger"><c:out value="${param.error}" /></div>
        </c:if>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
            <c:forEach var="subj" items="${subjects}">
                <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                            <span class="badge ${subj.priority == 'High' ? 'badge-high' : (subj.priority == 'Medium' ? 'badge-medium' : 'badge-low')}">
                                <c:out value="${subj.priority}" /> Priority
                            </span>
                            <div style="font-size: 0.82rem; color: var(--text-muted);">
                                ${subj.completedTopics}/${subj.totalTopics} Topics
                            </div>
                        </div>

                        <h3 style="font-size: 1.15rem; margin-bottom: 6px;"><c:out value="${subj.name}" /></h3>
                        <p style="color: var(--text-muted); font-size: 0.88rem; min-height: 40px;"><c:out value="${subj.description}" /></p>

                        <div style="margin: 16px 0;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 4px;">
                                <span>Completion</span>
                                <strong>${subj.overallProgress}% <span style="font-weight: normal; color: var(--text-muted);">(Target: ${subj.targetPercentage}%)</span></strong>
                            </div>
                            <div class="progress-container">
                                <div class="progress-bar ${subj.overallProgress >= subj.targetPercentage ? 'success' : (subj.overallProgress >= 50 ? 'warning' : 'danger')}" 
                                     style="width: ${subj.overallProgress}%;"></div>
                            </div>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 8px;">
                        <a href="${pageContext.request.contextPath}/subjects?action=view&id=${subj.id}" class="btn btn-secondary btn-sm">
                            View Syllabus &rarr;
                        </a>
                        <div style="display: flex; gap: 6px;">
                            <a href="${pageContext.request.contextPath}/topics?subjectId=${subj.id}" class="btn btn-secondary btn-sm" title="Manage Topics">Topics</a>
                            <form action="${pageContext.request.contextPath}/subjects" method="POST" onsubmit="return confirm('Are you sure you want to delete this subject and all its topics?');" style="display:inline;">
                                <input type="hidden" name="action" value="delete">
                                <input type="hidden" name="id" value="${subj.id}">
                                <button type="submit" class="btn btn-danger btn-sm" title="Delete Subject">🗑️</button>
                            </form>
                        </div>
                    </div>
                </div>
            </c:forEach>
        </div>

        <c:if test="${empty subjects}">
            <div class="card" style="text-align: center; padding: 48px 20px;">
                <div style="font-size: 3rem; margin-bottom: 12px;">📚</div>
                <h3>No Subjects Added Yet</h3>
                <p style="color: var(--text-muted); margin: 8px 0 20px;">Add your course subjects to start organizing syllabus chapters and tracking progress.</p>
                <button onclick="openModal('addSubjectModal')" class="btn btn-primary">Add Your First Subject</button>
            </div>
        </c:if>
    </main>
</div>

<!-- Add Subject Modal -->
<div id="addSubjectModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Add New Subject</h3>
            <button class="close-btn" onclick="closeModal('addSubjectModal')">&times;</button>
        </div>
        <div class="modal-body">
            <form action="${pageContext.request.contextPath}/subjects" method="POST">
                <input type="hidden" name="action" value="add">
                
                <div class="form-group">
                    <label for="name">Subject Title</label>
                    <input type="text" id="name" name="name" class="form-control" placeholder="e.g. Advanced Java Programming" required>
                </div>

                <div class="form-group">
                    <label for="description">Course Description / Objectives</label>
                    <textarea id="description" name="description" class="form-control" rows="3" placeholder="Key syllabus goals, units, exam details..."></textarea>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="form-group">
                        <label for="priority">Priority</label>
                        <select id="priority" name="priority" class="form-control">
                            <option value="High">High Priority</option>
                            <option value="Medium" selected>Medium Priority</option>
                            <option value="Low">Low Priority</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="targetPercentage">Target Percentage (%)</label>
                        <input type="number" id="targetPercentage" name="targetPercentage" class="form-control" value="80" min="0" max="100" step="5" required>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 10px; margin-top: 8px;">Save Subject</button>
            </form>
        </div>
    </div>
</div>

<jsp:include page="/WEB-INF/jsp/includes/footer.jsp" />
