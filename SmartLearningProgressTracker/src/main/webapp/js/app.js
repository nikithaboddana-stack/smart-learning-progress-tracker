/**
 * SMART LEARNING PROGRESS TRACKER - CLIENT SCRIPT
 * Handles modal dialogs, study session stopwatch, and client validations.
 */

// Modal open/close
function openModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside of modal-content
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
});

// =========================================================================
// STUDY SESSION STOPWATCH TIMER
// =========================================================================
var timerInterval = null;
var timerSeconds = 0;
var isTimerRunning = false;

function updateTimerDisplay() {
    var hrs = Math.floor(timerSeconds / 3600);
    var mins = Math.floor((timerSeconds % 3600) / 60);
    var secs = timerSeconds % 60;

    var formatted = (hrs < 10 ? "0" + hrs : hrs) + ":" +
                    (mins < 10 ? "0" + mins : mins) + ":" +
                    (secs < 10 ? "0" + secs : secs);

    var displayEl = document.getElementById('timer-display');
    if (displayEl) {
        displayEl.innerText = formatted;
    }
}

function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;
        timerInterval = setInterval(function() {
            timerSeconds++;
            updateTimerDisplay();
        }, 1000);
    }
}

function pauseTimer() {
    if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
    }
}

function resetTimer() {
    pauseTimer();
    timerSeconds = 0;
    updateTimerDisplay();
}

function finishTimerAndFillModal() {
    pauseTimer();
    var durationMinutes = Math.max(1, Math.round(timerSeconds / 60));
    var durationInput = document.getElementById('modal-duration');
    if (durationInput) {
        durationInput.value = durationMinutes;
    }
    openModal('addSessionModal');
}
