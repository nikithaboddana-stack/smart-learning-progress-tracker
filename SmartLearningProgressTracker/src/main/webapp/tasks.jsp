<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="pageTitle" value="Study Tasks - Smart Learning Progress Tracker" />
<c:set var="activePage" value="tasks" />

<jsp:include page="/WEB-INF/jsp/includes/header.jsp" />
<jsp:include page="/WEB-INF/jsp/includes/sidebar.jsp" />

<div class="main-wrapper">
    <header class="top-navbar">
        <h1 class="page-title">Study Task Management</h1>
        <button onclick="openModal('addTaskModal')" class="btn btn-primary btn-sm">
            <span>➕</span> Create New Task
        </button>
    </header>

    <main class="content-container">
        <c:if test="${not empty param.msg}">
            <div class="alert alert-success"><c:out value="${param.msg}" /></div>
        </c:if>
        <c:if test="${not empty param.error}">
            <div class="alert alert-danger"><c:out value="${param.error}" /></div>
        </c:if>

        <!-- Status Filter Tabs -->
        <div style="display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap;">
            <a href="${pageContext.request.contextPath}/tasks?filter=ALL" 
               class="btn ${currentFilter == 'ALL' ? 'btn-primary' : 'btn-secondary'} btn-sm">
                All Tasks (${tasks.size()})
            </a>
            <a href="${pageContext.request.contextPath}/tasks?filter=Pending" 
               class="btn ${currentFilter == 'Pending' ? 'btn-primary' : 'btn-secondary'} btn-sm">
                Pending (${counts['Pending']})
            </a>
            <a href="${pageContext.request.contextPath}/tasks?filter=In Progress" 
               class="btn ${currentFilter == 'In Progress' ? 'btn-primary' : 'btn-secondary'} btn-sm">
                In Progress (${counts['In Progress']})
            </a>
            <a href="${pageContext.request.contextPath}/tasks?filter=Completed" 
               class="btn ${currentFilter == 'Completed' ? 'btn-primary' : 'btn-secondary'} btn-sm">
                Completed (${counts['Completed']})
            </a>
            <a href="${pageContext.request.contextPath}/tasks?filter=Overdue" 
               class="btn ${currentFilter == 'Overdue' ? 'btn-danger' : 'btn-secondary'} btn-sm">
                Overdue (${counts['Overdue']})
            </a>
        </div>

        <!-- Tasks Table -->
        <div class="card">
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Task Title</th>
                            <th>Subject / Topic</th>
                            <th>Priority</th>
                            <th>Due Date</th>
                            <th>Est. Time</th>
                            <th>Status</th>
                            <th>Change Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <c:forEach var="task" items="${tasks}">
                            <tr>
                                <td>
                                    <strong><c:out value="${task.title}" /></strong>
                                    <div style="font-size: 0.8rem; color: var(--text-muted);"><c:out value="${task.description}" /></div>
                                </td>
                                <td>
                                    <c:choose>
                                        <c:when test="${not empty task.subjectName}">
                                            <span class="badge badge-low"><c:out value="${task.subjectName}" /></span>
                                        </c:when>
                                        <c:otherwise>
                                            <span style="color: var(--text-muted); font-size: 0.8rem;">General</span>
                                        </c:otherwise>
                                    </c:choose>
                                </td>
                                <td>
                                    <span class="badge ${task.priority == 'High' ? 'badge-high' : (task.priority == 'Medium' ? 'badge-medium' : 'badge-low')}">
                                        <c:out value="${task.priority}" />
                                    </span>
                                </td>
                                <td>
                                    <strong><c:out value="${task.dueDate}" /></strong>
                                </td>
                                <td>${task.estimatedMinutes} mins</td>
                                <td>
                                    <span class="badge ${task.status == 'Completed' ? 'badge-completed' : (task.status == 'In Progress' ? 'badge-in-progress' : (task.status == 'Overdue' ? 'badge-overdue' : 'badge-not-started'))}">
                                        <c:out value="${task.status}" />
                                    </span>
                                </td>
                                <td>
                                    <form action="${pageContext.request.contextPath}/tasks" method="POST" style="display:inline;">
                                        <input type="hidden" name="action" value="updateStatus">
                                        <input type="hidden" name="id" value="${task.id}">
                                        <select name="status" class="form-control" style="padding: 4px 6px; font-size: 0.8rem; width: auto; display: inline-block;" onchange="this.form.submit()">
                                            <option value="Pending" ${task.status == 'Pending' ? 'selected' : ''}>Pending</option>
                                            <option value="In Progress" ${task.status == 'In Progress' ? 'selected' : ''}>In Progress</option>
                                            <option value="Completed" ${task.status == 'Completed' ? 'selected' : ''}>Completed</option>
                                        </select>
                                    </form>
                                </td>
                                <td>
                                    <form action="${pageContext.request.contextPath}/tasks" method="POST" onsubmit="return confirm('Delete this task?');" style="display:inline;">
                                        <input type="hidden" name="action" value="delete">
                                        <input type="hidden" name="id" value="${task.id}">
                                        <button type="submit" class="btn btn-danger btn-sm" title="Delete Task">🗑️</button>
                                    </form>
                                </td>
                            </tr>
                        </c:forEach>
                        <c:if test="${empty tasks}">
                            <tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 32px;">No tasks match this filter.</td></tr>
                        </c:if>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</div>

<!-- Add Task Modal -->
<div id="addTaskModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Create New Study Task</h3>
            <button class="close-btn" onclick="closeModal('addTaskModal')">&times;</button>
        </div>
        <div class="modal-body">
            <form action="${pageContext.request.contextPath}/tasks" method="POST">
                <input type="hidden" name="action" value="add">

                <div class="form-group">
                    <label for="taskTitle">Task Title</label>
                    <input type="text" id="taskTitle" name="title" class="form-control" placeholder="e.g. Solve 5 JDBC practice problems" required>
                </div>

                <div class="form-group">
                    <label for="taskDesc">Task Instructions / Description</label>
                    <textarea id="taskDesc" name="description" class="form-control" rows="2" placeholder="Details, exercise page numbers, GitHub repo..."></textarea>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="form-group">
                        <label for="subjectId">Related Subject</label>
                        <select id="subjectId" name="subjectId" class="form-control">
                            <option value="">-- General / None --</option>
                            <c:forEach var="s" items="${subjects}">
                                <option value="${s.id}"><c:out value="${s.name}" /></option>
                            </c:forEach>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="priority">Priority</label>
                        <select id="priority" name="priority" class="form-control">
                            <option value="High">High</option>
                            <option value="Medium" selected>Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="form-group">
                        <label for="dueDate">Due Date</label>
                        <input type="date" id="dueDate" name="dueDate" class="form-control" required>
                    </div>

                    <div class="form-group">
                        <label for="estimatedMinutes">Estimated Minutes</label>
                        <input type="number" id="estimatedMinutes" name="estimatedMinutes" class="form-control" value="60" min="5" step="5" required>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 10px; margin-top: 8px;">Create Task</button>
            </form>
        </div>
    </div>
</div>

<jsp:include page="/WEB-INF/jsp/includes/footer.jsp" />
