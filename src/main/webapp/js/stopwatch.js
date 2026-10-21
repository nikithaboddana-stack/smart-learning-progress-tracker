/**
 * SMART TRACKER — STOPWATCH TIMER SCRIPT
 */

let stopwatchInterval = null;
let elapsedSeconds = 0;
let isRunning = false;

function updateDisplay() {
    const hrs = Math.floor(elapsedSeconds / 3600);
    const mins = Math.floor((elapsedSeconds % 3600) / 60);
    const secs = elapsedSeconds % 60;

    const formatted = 
        String(hrs).padStart(2, '0') + ':' + 
        String(mins).padStart(2, '0') + ':' + 
        String(secs).padStart(2, '0');

    const display = document.getElementById('stopwatchDisplay');
    if (display) display.innerText = formatted;
}

function startStopwatch() {
    if (!isRunning) {
        isRunning = true;
        stopwatchInterval = setInterval(() => {
            elapsedSeconds++;
            updateDisplay();
        }, 1000);
    }
}

function pauseStopwatch() {
    if (isRunning) {
        clearInterval(stopwatchInterval);
        isRunning = false;
    }
}

function resetStopwatch() {
    pauseStopwatch();
    elapsedSeconds = 0;
    updateDisplay();
}

function finishAndLogSession() {
    pauseStopwatch();
    const durationMins = Math.max(1, Math.round(elapsedSeconds / 60));
    const modalInput = document.getElementById('sessionDurationMinutes');
    if (modalInput) modalInput.value = durationMins;

    const modal = new bootstrap.Modal(document.getElementById('logSessionModal'));
    modal.show();
}
