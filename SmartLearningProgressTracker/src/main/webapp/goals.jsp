<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="pageTitle" value="Learning Goals - Smart Learning Progress Tracker" />
<c:set var="activePage" value="goals" />

<jsp:include page="/WEB-INF/jsp/includes/header.jsp" />
<jsp:include page="/WEB-INF/jsp/includes/sidebar.jsp" />

<div class="main-wrapper">
    <header class="top-navbar">
        <h1 class="page-title">Learning Goals</h1>
        <button onclick="openModal('addGoalModal')" class="btn btn-primary btn-sm">
            <span>➕</span> Set New Goal
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
            <c:forEach var="g" items="${goals}">
                <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                            <span class="badge ${g.status == 'Completed' ? 'badge-completed' : (g.status == 'Overdue' ? 'badge-overdue' : 'badge-in-progress')}">
                                <c:out value="${g.status}" />
                            </span>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">
                                Deadline: <strong><c:out value="${g.deadline}" /></strong>
                            </div>
                        </div>

                        <h3 style="font-size: 1.15rem; margin-bottom: 6px;"><c:out value="${g.title}" /></h3>
                        <p style="color: var(--text-muted); font-size: 0.88rem; min-height: 40px;"><c:out value="${g.description}" /></p>

                        <div style="margin: 16px 0;">
                            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
                                <span>Progress: <strong>${g.currentValue} / ${g.targetValue} ${g.unit}</strong></span>
                                <strong>${g.progressPercentage}%</strong>
                            </div>
                            <div class="progress-container">
                                <div class="progress-bar ${g.status == 'Completed' ? 'success' : (g.status == 'Overdue' ? 'danger' : '')}" 
                                     style="width: ${g.progressPercentage}%;"></div>
                            </div>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 8px;">
                        <button class="btn btn-secondary btn-sm" onclick="openUpdateGoalModal(${g.id}, ${g.currentValue}, ${g.targetValue}, '<c:out value="${g.unit}" />', '<c:out value="${g.title}" />')">
                            Update Value
                        </button>
                        <form action="${pageContext.request.contextPath}/goals" method="POST" onsubmit="return confirm('Delete this goal?');" style="display:inline;">
                            <input type="hidden" name="action" value="delete">
                            <input type="hidden" name="id" value="${g.id}">
                            <button type="submit" class="btn btn-danger btn-sm" title="Delete">🗑️</button>
                        </form>
                    </div>
                </div>
            </c:forEach>
        </div>

        <c:if test="${empty goals}">
            <div class="card" style="text-align: center; padding: 48px 20px;">
                <div style="font-size: 3rem; margin-bottom: 12px;">🎯</div>
                <h3>No Learning Goals Set Yet</h3>
                <p style="color: var(--text-muted); margin: 8px 0 20px;">Establish weekly targets such as studying 15 hours, mastering 5 topics, or achieving 85% in tests.</p>
                <button onclick="openModal('addGoalModal')" class="btn btn-primary">Set Your First Goal</button>
            </div>
        </c:if>
    </main>
</div>

<!-- Add Goal Modal -->
<div id="addGoalModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Set New Learning Goal</h3>
            <button class="close-btn" onclick="closeModal('addGoalModal')">&times;</button>
        </div>
        <div class="modal-body">
            <form action="${pageContext.request.contextPath}/goals" method="POST">
                <input type="hidden" name="action" value="add">

                <div class="form-group">
                    <label for="goalTitle">Goal Title</label>
                    <input type="text" id="goalTitle" name="title" class="form-control" placeholder="e.g. Study 15 hours this week" required>
                </div>

                <div class="form-group">
                    <label for="goalDesc">Description / Target Outcome</label>
                    <textarea id="goalDesc" name="description" class="form-control" rows="2" placeholder="Specific topics or chapters to cover..."></textarea>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="form-group">
                        <label for="targetValue">Target Value</label>
                        <input type="number" id="targetValue" name="targetValue" class="form-control" value="15" step="0.5" required>
                    </div>

                    <div class="form-group">
                        <label for="currentValue">Current Progress</label>
                        <input type="number" id="currentValue" name="currentValue" class="form-control" value="0" step="0.5" required>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="form-group">
                        <label for="unit">Measurement Unit</label>
                        <select id="unit" name="unit" class="form-control">
                            <option value="Hours" selected>Hours</option>
                            <option value="Topics">Topics</option>
                            <option value="Chapters">Chapters</option>
                            <option value="Questions">Questions</option>
                            <option value="Marks %">Marks %</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="deadline">Target Deadline</label>
                        <input type="date" id="deadline" name="deadline" class="form-control" required>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 10px; margin-top: 8px;">Create Goal</button>
            </form>
        </div>
    </div>
</div>

<!-- Update Progress Modal -->
<div id="updateGoalModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 id="updateGoalTitle">Update Goal Progress</h3>
            <button class="close-btn" onclick="closeModal('updateGoalModal')">&times;</button>
        </div>
        <div class="modal-body">
            <form action="${pageContext.request.contextPath}/goals" method="POST">
                <input type="hidden" name="action" value="updateProgress">
                <input type="hidden" id="modalGoalId" name="id" value="">

                <div class="form-group">
                    <label for="modalCurrentValue">Current Value (<span id="modalGoalUnit"></span>)</label>
                    <input type="number" id="modalCurrentValue" name="currentValue" class="form-control" step="0.5" required>
                    <small style="color: var(--text-muted);">Target: <span id="modalTargetValue"></span></small>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 10px; margin-top: 8px;">Save Progress</button>
            </form>
        </div>
    </div>
</div>

<script>
function openUpdateGoalModal(id, current, target, unit, title) {
    document.getElementById('modalGoalId').value = id;
    document.getElementById('modalCurrentValue').value = current;
    document.getElementById('modalTargetValue').innerText = target + ' ' + unit;
    document.getElementById('modalGoalUnit').innerText = unit;
    document.getElementById('updateGoalTitle').innerText = 'Update: ' + title;
    openModal('updateGoalModal');
}
</script>

<jsp:include page="/WEB-INF/jsp/includes/footer.jsp" />
