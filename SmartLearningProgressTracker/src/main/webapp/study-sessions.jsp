<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="pageTitle" value="Study Sessions & Timer - Smart Learning Progress Tracker" />
<c:set var="activePage" value="sessions" />

<jsp:include page="/WEB-INF/jsp/includes/header.jsp" />
<jsp:include page="/WEB-INF/jsp/includes/sidebar.jsp" />

<div class="main-wrapper">
    <header class="top-navbar">
        <h1 class="page-title">Study Sessions &amp; Time Tracking</h1>
        <button onclick="openModal('addSessionModal')" class="btn btn-primary btn-sm">
            <span>➕</span> Manual Log Session
        </button>
    </header>

    <main class="content-container">
        <c:if test="${not empty param.msg}">
            <div class="alert alert-success"><c:out value="${param.msg}" /></div>
        </c:if>
        <c:if test="${not empty param.error}">
            <div class="alert alert-danger"><c:out value="${param.error}" /></div>
        </c:if>

        <!-- Hours & Streak Summary Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon" style="background: #fef3c7; color: #d97706;">⏱️</div>
                <div>
                    <div class="stat-number">${todayHours}h</div>
                    <div class="stat-label">Today's Hours</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: #ede9fe; color: #7c3aed;">📅</div>
                <div>
                    <div class="stat-number">${weeklyHours}h</div>
                    <div class="stat-label">Weekly Hours (7d)</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: #e0f2fe; color: #0284c7;">📆</div>
                <div>
                    <div class="stat-number">${monthlyHours}h</div>
                    <div class="stat-label">Monthly Hours (30d)</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon" style="background: #dcfce7; color: #16a34a;">🔥</div>
                <div>
                    <div class="stat-number">${currentStreak} <span style="font-size: 0.9rem; font-weight: normal; color: #64748b;">(Best: ${longestStreak})</span></div>
                    <div class="stat-label">Consecutive Streak</div>
                </div>
            </div>
        </div>

        <!-- Live Stopwatch Study Timer Widget -->
        <div class="card" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff; text-align: center; padding: 32px 20px;">
            <div style="font-size: 0.85rem; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em; margin-bottom: 8px;">
                Active Focus Session Stopwatch
            </div>
            <div id="timer-display" style="font-size: 3.5rem; font-weight: 800; font-family: monospace; letter-spacing: 2px; color: #38bdf8; margin-bottom: 20px;">
                00:00:00
            </div>
            <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
                <button onclick="startTimer()" class="btn btn-primary" style="padding: 10px 24px;">▶ Start</button>
                <button onclick="pauseTimer()" class="btn btn-secondary" style="padding: 10px 24px;">⏸ Pause</button>
                <button onclick="resetTimer()" class="btn btn-secondary" style="padding: 10px 24px;">🔄 Reset</button>
                <button onclick="finishTimerAndFillModal()" class="btn btn-success" style="padding: 10px 24px;">💾 Log Session</button>
            </div>
        </div>

        <!-- Session History Table -->
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Study Session History</h3>
            </div>
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Subject</th>
                            <th>Topic</th>
                            <th>Time Window</th>
                            <th>Duration</th>
                            <th>Study Notes</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <c:forEach var="s" items="${sessions}">
                            <tr>
                                <td><strong><c:out value="${s.studyDate}" /></strong></td>
                                <td><span class="badge badge-low"><c:out value="${s.subjectName}" /></span></td>
                                <td>
                                    <c:choose>
                                        <c:when test="${not empty s.topicName}"><c:out value="${s.topicName}" /></c:when>
                                        <c:otherwise><span style="color: var(--text-muted); font-size: 0.8rem;">General Study</span></c:otherwise>
                                    </c:choose>
                                </td>
                                <td><c:out value="${s.startTime}" /> &ndash; <c:out value="${s.endTime}" /></td>
                                <td><strong>${s.durationMinutes} mins</strong> (${s.durationHours}h)</td>
                                <td><c:out value="${s.notes}" /></td>
                                <td>
                                    <form action="${pageContext.request.contextPath}/study-sessions" method="POST" onsubmit="return confirm('Delete this study log?');" style="display:inline;">
                                        <input type="hidden" name="action" value="delete">
                                        <input type="hidden" name="id" value="${s.id}">
                                        <button type="submit" class="btn btn-danger btn-sm" title="Delete">🗑️</button>
                                    </form>
                                </td>
                            </tr>
                        </c:forEach>
                        <c:if test="${empty sessions}">
                            <tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 32px;">No study sessions logged yet. Use the timer or manual button above!</td></tr>
                        </c:if>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</div>

<!-- Add Session Modal -->
<div id="addSessionModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Log Study Session</h3>
            <button class="close-btn" onclick="closeModal('addSessionModal')">&times;</button>
        </div>
        <div class="modal-body">
            <form action="${pageContext.request.contextPath}/study-sessions" method="POST">
                <input type="hidden" name="action" value="add">

                <div class="form-group">
                    <label for="modal-subject">Subject</label>
                    <select id="modal-subject" name="subjectId" class="form-control" required>
                        <c:forEach var="subj" items="${subjects}">
                            <option value="${subj.id}"><c:out value="${subj.name}" /></option>
                        </c:forEach>
                    </select>
                </div>

                <div class="form-group">
                    <label for="modal-topic">Specific Topic (Optional)</label>
                    <select id="modal-topic" name="topicId" class="form-control">
                        <option value="">-- General Revision / All Topics --</option>
                        <c:forEach var="t" items="${topics}">
                            <option value="${t.id}"><c:out value="${t.subjectName}" /> &rarr; <c:out value="${t.name}" /></option>
                        </c:forEach>
                    </select>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="form-group">
                        <label for="modal-date">Study Date</label>
                        <input type="date" id="modal-date" name="studyDate" class="form-control" required>
                    </div>

                    <div class="form-group">
                        <label for="modal-duration">Duration (Minutes)</label>
                        <input type="number" id="modal-duration" name="durationMinutes" class="form-control" value="60" min="1" required>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="form-group">
                        <label for="modal-start">Start Time</label>
                        <input type="time" id="modal-start" name="startTime" class="form-control" value="10:00">
                    </div>

                    <div class="form-group">
                        <label for="modal-end">End Time</label>
                        <input type="time" id="modal-end" name="endTime" class="form-control" value="11:00">
                    </div>
                </div>

                <div class="form-group">
                    <label for="modal-notes">Session Notes / Insights</label>
                    <textarea id="modal-notes" name="notes" class="form-control" rows="2" placeholder="Key algorithms revised, code written, challenges..."></textarea>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; padding: 10px; margin-top: 8px;">Save Study Session</button>
            </form>
        </div>
    </div>
</div>

<script>
// Auto-set today's date in modal
document.getElementById('modal-date').valueAsDate = new Date();
</script>

<jsp:include page="/WEB-INF/jsp/includes/footer.jsp" />
