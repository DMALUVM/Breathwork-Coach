let timers = {}; // Store interval IDs and remaining time for each timer

function openTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`button[onclick="openTab('${tabName}')"]`).classList.add('active');
}

function startTimer(id, duration) {
    if (timers[id] && timers[id].interval) {
        clearInterval(timers[id].interval); // Clear if already running
    }
    if (!timers[id]) {
        timers[id] = { remaining: duration, interval: null };
    } else {
        // Resume from paused remaining
    }
    updateTimerDisplay(id);
    document.getElementById(`${id}-timer`).classList.add('running');
    timers[id].interval = setInterval(() => {
        timers[id].remaining--;
        updateTimerDisplay(id);
        if (timers[id].remaining <= 0) {
            clearInterval(timers[id].interval);
            document.getElementById(`${id}-timer`).classList.remove('running');
            document.getElementById('beep').play().catch(() => {}); // Handle if audio fails
            alert(`Time's up for ${id}!`);
        }
    }, 1000);
}

function pauseTimer(id) {
    if (timers[id] && timers[id].interval) {
        clearInterval(timers[id].interval);
        timers[id].interval = null;
        document.getElementById(`${id}-timer`).classList.remove('running');
    }
}

function resetTimer(id) {
    if (timers[id]) {
        clearInterval(timers[id].interval);
        timers[id] = null;
        document.getElementById(`${id}-timer`).textContent = '00:00';
        document.getElementById(`${id}-timer`).classList.remove('running');
    }
}

function updateTimerDisplay(id) {
    const minutes = Math.floor(timers[id].remaining / 60);
    const seconds = timers[id].remaining % 60;
    document.getElementById(`${id}-timer`).textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function resetProgress() {
    document.getElementById('morning-check').checked = false;
    document.getElementById('midday-check').checked = false;
    document.getElementById('evening-check').checked = false;
    localStorage.setItem('morning-check', false);
    localStorage.setItem('midday-check', false);
    localStorage.setItem('evening-check', false);
}

// Load progress from localStorage
window.onload = () => {
    document.getElementById('morning-check').checked = localStorage.getItem('morning-check') === 'true';
    document.getElementById('midday-check').checked = localStorage.getItem('midday-check') === 'true';
    document.getElementById('evening-check').checked = localStorage.getItem('evening-check') === 'true';
};

// Save progress on change
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        localStorage.setItem(checkbox.id, checkbox.checked);
    });
});
