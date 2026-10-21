<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="pageTitle" value="Topic Management - Smart Learning Progress Tracker" />
<c:set var="activePage" value="topics" />

<jsp:include page="/WEB-INF/jsp/includes/header.jsp" />
<jsp:include page="/WEB-INF/jsp/includes/sidebar.jsp" />

<div class="main-wrapper">
    <header class="top-navbar">
        <h1 class="page-title">Topic Management</h1>
        <button onclick="openModal('addTopicModal')" class="btn btn-primary btn-sm">
            <span>➕</span> Add New Topic
        </button>
    </header>

    <main class="content-container">
        <c:if test="${not empty param.msg}">
            <div class="alert alert-success"><c:out value="${param.msg}" /></div>
        </c:if>
        <c:if test="${not empty param.error}">
            <div class="alert alert-danger"><c:out value="${param.error}" /></div>
        </c:if>

        <!-- Filter bar -->
        <div class="card" style="padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <label for="filterSubject" style="font-size: 0.88rem; font-weight: 600;">Filter by Subject:</label>
                <select id="filterSubject" class="form-control" style="width: auto; display: inline-block;" 
                        onchange="window.location.href = '${pageContext.request.contextPath}/topics' + (this.value ? '?subjectId=' + this.value : '')">
                    <option value="">All Subjects (${topics.size()} Topics)</option>
                    <c:forEach var="subj" items="${subjects}">
                        <option value="${subj.id}" ${selectedSubjectId == subj.id ? 'selected' : ''}>
                            <c:out value="${subj.name}" />
                        </option>
                    </c:forEach>
                </select>
            </div>
        </div>

        <!-- Topics Table -->
        <div class="card">
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Topic &amp; Overview</th>
                            <th>Difficulty</th>
                            <th>Status</th>
                            <th>Progress</th>
                            <th>Confidence</th>
                            <th>Revisions</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <c:forEach var="topic" items="${topics}">
                            <tr>
                                <td>
                                    <span class="badge badge-low"><c:out value="${topic.subjectName}" /></span>
                                </td>
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
                                        <div class="progress-bar ${topic.progressPercentage >= 100 ? 'success' : (topic.progressPercentage >= 50 ? 'warning' : 'danger')}" 
                                             style="width: ${topic.progressPercentage}%;"></div>
                                    </div>
                                </td>
                                <td>
                                    <span title="${topic.confidenceLevel} out of 5 stars">
                                        <c:forEach begin="1" end="${topic.confidenceLevel}">⭐</c:forEach>
                                    </span>
                                </td>
                                <td><strong>${topic.revisionCount}</strong> revs</td>
                                <td>
                                    <div style="display: flex; gap: 4px;">
                                        <button class="btn btn-secondary btn-sm" 
                                                onclick="openProgressModal(${topic.id}, ${topic.progressPercentage}, ${topic.confidenceLevel}, '<c:out value="${topic.name}" />')" 
                                                title="Update Progress">
                                            📊
                                        </button>
                                        <form action="${pageContext.request.contextPath}/topics" method="POST" style="display:inline;">
                                            <input type="hidden" name="action" value="incrementRevision">
                                            <input type="hidden" name="id" value="${topic.id}">
                                            <input type="hidden" name="subjectId" value="${topic.subjectId}">
                                            <button type="submit" class="btn btn-secondary btn-sm" title="+1 Revision">+1</button>
                                        </form>
                                        <form action="${pageContext.request.contextPath}/topics" method="POST" onsubmit="return confirm('Delete this topic?');" style="display:inline;">
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="id" value="${topic.id}">
                                            <input type="hidden" name="subjectId" value="${topic.subjectId}">
                                            <button type="submit" class="btn btn-danger btn-sm" title="Delete">🗑️</button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        </c:forEach>
                        <c:if test="${empty topics}">
                            <tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px;">No topics found. Add topics using the button above!</td></tr>
                        </c:if>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</div>

<!-- Add Topic Modal -->
<div id="addTopicModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Add New Syllabus Topic</h3>
            <button class="close-btn" onclick="closeModal('addTopicModal')">&times;</button>
        </div>
        <div class="modal-body">
            <form action="${pageContext.request.contextPath}/topics" method="POST">
                <input type="hidden" name="action" value="add">

                <div class="form-group">
                    <label for="subjectId">Select Subject</label>
                    <select id="subjectId" name="subjectId" class="form-control" required>
                        <c:forEach var="s" items="${subjects}">
                            <option value="${s.id}" ${selectedSubjectId == s.id ? 'selected' : ''}><c:out value="${s.name}" /></option>
                        </c:forEach>
                    </select>
                </div>

                <div class="form-group">
                    <label for="topicName">Topic / Chapter Title</label>
                    <input type="text" id="topicName" name="name" class="form-control" placeholder="e.g. PreparedStatement &amp; Transaction Management" required>
                </div>

                <div class="form-group">
                    <label for="topicDesc">Topic Description</label>
                    <textarea id="topicDesc" name="description" class="form-control" rows="2" placeholder="Key concepts, sub-topics, syllabus references..."></textarea>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="form-group">
                        <label for="difficulty">Difficulty</label>
                        <select id="difficulty" name="difficulty" class="form-control">
                            <option value="Easy">Easy</option>
                            <option value="Medium" selected>Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="status">Initial Status</label>
                        <select id="status" name="status" class="form-control">
                            <option value="Not Started" selected>Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="form-group">
                        <label for="progressPercentage">Initial Progress (%)</label>
                        <input type="number" id="progressPercentage" name="progressPercentage" class="form-control" value="0" min="0" max="100">
                    </div>

                    <div class="form-group">
                        <label for="confidenceLevel">Confidence Level (1-5)</label>
                        <select id="confidenceLevel" name="confidenceLevel" class="form-control">
                            <option value="1">1 - Very Low</option>
                            <option value="2">2 - Low</option>
                            <option value="3" selected>3 - Moderate</option>
                            <option value="4">4 - High</option>
                            <option value="5">5 - Mastered</option>
                        </select>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 10px; margin-top: 8px;">Save Topic</button>
            </form>
        </div>
    </div>
</div>

<!-- Quick Update Progress Modal -->
<div id="updateProgressModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 id="updateTopicTitle">Update Topic Progress</h3>
            <button class="close-btn" onclick="closeModal('updateProgressModal')">&times;</button>
        </div>
        <div class="modal-body">
            <form action="${pageContext.request.contextPath}/topics" method="POST">
                <input type="hidden" name="action" value="updateProgress">
                <input type="hidden" id="updateTopicId" name="id" value="">

                <div class="form-group">
                    <label for="updateProgressVal">Progress Percentage (<span id="progressDisplay">50</span>%)</label>
                    <input type="range" id="updateProgressVal" name="progressPercentage" min="0" max="100" class="form-control" 
                           oninput="document.getElementById('progressDisplay').innerText = this.value">
                </div>

                <div class="form-group">
                    <label for="updateConfidenceVal">Confidence Level</label>
                    <select id="updateConfidenceVal" name="confidenceLevel" class="form-control">
                        <option value="1">⭐ 1 - Struggling / Low</option>
                        <option value="2">⭐⭐ 2 - Weak Understanding</option>
                        <option value="3">⭐⭐⭐ 3 - Moderate / Competent</option>
                        <option value="4">⭐⭐⭐⭐ 4 - Strong Understanding</option>
                        <option value="5">⭐⭐⭐⭐⭐ 5 - Fully Mastered</option>
                    </select>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 10px; margin-top: 8px;">Update Progress</button>
            </form>
        </div>
    </div>
</div>

<script>
function openProgressModal(topicId, progress, confidence, name) {
    document.getElementById('updateTopicId').value = topicId;
    document.getElementById('updateProgressVal').value = progress;
    document.getElementById('progressDisplay').innerText = progress;
    document.getElementById('updateConfidenceVal').value = confidence;
    document.getElementById('updateTopicTitle').innerText = 'Update: ' + name;
    openModal('updateProgressModal');
}
</script>

<jsp:include page="/WEB-INF/jsp/includes/footer.jsp" />
