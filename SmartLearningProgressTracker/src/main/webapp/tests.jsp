<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="pageTitle" value="Test & Quiz Records - Smart Learning Progress Tracker" />
<c:set var="activePage" value="tests" />

<jsp:include page="/WEB-INF/jsp/includes/header.jsp" />
<jsp:include page="/WEB-INF/jsp/includes/sidebar.jsp" />

<div class="main-wrapper">
    <header class="top-navbar">
        <h1 class="page-title">Internal Tests &amp; Quiz Marks</h1>
        <button onclick="openModal('addTestModal')" class="btn btn-primary btn-sm">
            <span>➕</span> Record Test Result
        </button>
    </header>

    <main class="content-container">
        <c:if test="${not empty param.msg}">
            <div class="alert alert-success"><c:out value="${param.msg}" /></div>
        </c:if>
        <c:if test="${not empty param.error}">
            <div class="alert alert-danger"><c:out value="${param.error}" /></div>
        </c:if>

        <!-- Test Performance Summary Card -->
        <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div>
                <h3 style="font-size: 1.1rem; margin-bottom: 4px;">Overall Test Performance</h3>
                <p style="color: var(--text-muted); font-size: 0.88rem;">Logged <strong>${tests.size()}</strong> quizzes, class assessments, and mid-terms.</p>
            </div>
            <div style="display: flex; align-items: center; gap: 20px;">
                <div style="text-align: right;">
                    <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Average Score</div>
                    <div style="font-size: 2rem; font-weight: 800; color: ${avgScore >= 75 ? 'var(--success)' : (avgScore >= 60 ? 'var(--warning)' : 'var(--danger)')};">
                        ${avgScore}%
                    </div>
                </div>
            </div>
        </div>

        <!-- Tests Table -->
        <div class="card">
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Test / Quiz Title</th>
                            <th>Subject</th>
                            <th>Marks Obtained</th>
                            <th>Total Marks</th>
                            <th>Percentage</th>
                            <th>Notes / Feedback</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <c:forEach var="test" items="${tests}">
                            <tr>
                                <td><c:out value="${test.testDate}" /></td>
                                <td><strong><c:out value="${test.testName}" /></strong></td>
                                <td><span class="badge badge-low"><c:out value="${test.subjectName}" /></span></td>
                                <td><strong>${test.marksObtained}</strong></td>
                                <td>${test.totalMarks}</td>
                                <td>
                                    <span class="badge ${test.percentage >= 75 ? 'badge-completed' : (test.percentage >= 60 ? 'badge-medium' : 'badge-high')}">
                                        ${test.percentage}%
                                    </span>
                                </td>
                                <td><c:out value="${test.notes}" /></td>
                                <td>
                                    <form action="${pageContext.request.contextPath}/tests" method="POST" onsubmit="return confirm('Delete this test score?');" style="display:inline;">
                                        <input type="hidden" name="action" value="delete">
                                        <input type="hidden" name="id" value="${test.id}">
                                        <button type="submit" class="btn btn-danger btn-sm" title="Delete">🗑️</button>
                                    </form>
                                </td>
                            </tr>
                        </c:forEach>
                        <c:if test="${empty tests}">
                            <tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px;">No tests recorded yet. Record your quiz or exam scores!</td></tr>
                        </c:if>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</div>

<!-- Add Test Modal -->
<div id="addTestModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Record Test / Quiz Marks</h3>
            <button class="close-btn" onclick="closeModal('addTestModal')">&times;</button>
        </div>
        <div class="modal-body">
            <form action="${pageContext.request.contextPath}/tests" method="POST">
                <input type="hidden" name="action" value="add">

                <div class="form-group">
                    <label for="subjectId">Subject</label>
                    <select id="subjectId" name="subjectId" class="form-control" required>
                        <c:forEach var="s" items="${subjects}">
                            <option value="${s.id}"><c:out value="${s.name}" /></option>
                        </c:forEach>
                    </select>
                </div>

                <div class="form-group">
                    <label for="testName">Test / Assessment Name</label>
                    <input type="text" id="testName" name="testName" class="form-control" placeholder="e.g. Unit 3 Quiz on JDBC" required>
                </div>

                <div class="form-group">
                    <label for="testDate">Test Date</label>
                    <input type="date" id="testDate" name="testDate" class="form-control" required>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="form-group">
                        <label for="marksObtained">Marks Obtained</label>
                        <input type="number" id="marksObtained" name="marksObtained" class="form-control" step="0.5" min="0" required>
                    </div>

                    <div class="form-group">
                        <label for="totalMarks">Total Maximum Marks</label>
                        <input type="number" id="totalMarks" name="totalMarks" class="form-control" step="0.5" min="1" value="50" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="testNotes">Teacher Feedback / Error Analysis</label>
                    <textarea id="testNotes" name="notes" class="form-control" rows="2" placeholder="Mistakes made, concepts to revise..."></textarea>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 10px; margin-top: 8px;">Save Test Score</button>
            </form>
        </div>
    </div>
</div>

<script>
document.getElementById('testDate').valueAsDate = new Date();
</script>

<jsp:include page="/WEB-INF/jsp/includes/footer.jsp" />
