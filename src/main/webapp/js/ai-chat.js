/**
 * SMART TRACKER — REAL AI ASSISTANT CHAT CLIENT
 * Connects asynchronously to /api/ai/chat with student academic grounding.
 */

function sendAiMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;

    input.value = '';
    appendMessage('USER', message);

    // Show typing bubble
    const typingId = showTypingIndicator();

    fetch(window.location.origin + '/SmartTracker/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message })
    })
    .then(res => res.json())
    .then(data => {
        removeTypingIndicator(typingId);
        if (data.reply) {
            appendMessage('ASSISTANT', data.reply);
        } else if (data.error) {
            appendMessage('ASSISTANT', '⚠️ ' + data.error);
        }
    })
    .catch(err => {
        removeTypingIndicator(typingId);
        appendMessage('ASSISTANT', 'I am currently unable to reach the AI cloud endpoint, but based on your records, please prioritize your low-scoring subjects and upcoming test topics!');
    });
}

function appendMessage(sender, text) {
    const container = document.getElementById('chatHistory');
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble ' + (sender === 'USER' ? 'message-user' : 'message-assistant');

    // Convert newlines to breaks
    const formatted = text.replace(/\n/g, '<br/>');
    bubble.innerHTML = (sender === 'ASSISTANT' ? '<strong>🤖 Smart AI:</strong><br/>' : '') + formatted;

    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
    const container = document.getElementById('chatHistory');
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = 'message-bubble message-assistant typing-indicator';
    div.innerHTML = '<span></span><span></span><span></span> <em>Analyzing your academic records...</em>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return id;
}

function removeTypingIndicator(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function sendQuickPrompt(promptText) {
    document.getElementById('chatInput').value = promptText;
    sendAiMessage();
}
