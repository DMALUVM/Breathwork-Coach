let timers = {};
let progressData = JSON.parse(localStorage.getItem('breathwork-progress')) || {};
let completedExercises = {};
let currentRoutine = null;

// Your routines array here (unchanged from previous)

function getDailyRoutine() {
    // Unchanged
}

function setDailyRoutine() {
    currentRoutine = getDailyRoutine();
    document.getElementById('daily-title').textContent = currentRoutine.title;
    document.getElementById('daily-desc').innerHTML = currentRoutine.desc;
    // Show custom ratio if applicable (e.g., for coherent, box)
    if (['coherent', 'box', 'equal'].includes(currentRoutine.id)) {
        document.getElementById('custom-ratio').style.display = 'block';
    }
}

// Timer functions with audio handling
function startTimer(id) {
    const durationInput = document.getElementById(`${id}-duration`);
    let duration = parseInt(durationInput.value) * 60;
    if (isNaN(duration) || duration < 600 || duration > 1200) {
        alert('Please enter a valid duration (10-20 minutes).');
        return;
    }

    if (timers[id] && timers[id].interval) {
        clearInterval(timers[id].interval);
    }
    if (!timers[id]) {
        timers[id] = { remaining: duration, interval: null };
    }
    updateTimerDisplay(id);
    document.getElementById(`${id}-timer`).classList.add('running');
    
    const breather = document.getElementById(`${id}-breather`);
    if (breather && currentRoutine) {
        breather.classList.add('active', currentRoutine.breatherClass);
    }
    
    const audio = document.getElementById('session-audio');
    const selectedAudio = document.getElementById('audio-select').value;
    if (selectedAudio) {
        audio.src = selectedAudio;
        audio.play().catch(() => {});
    }
    
    if (navigator.vibrate) navigator.vibrate(200); // Haptic start
    
    timers[id].interval = setInterval(() => {
        timers[id].remaining--;
        updateTimerDisplay(id);
        if (timers[id].remaining <= 0) {
            clearInterval(timers[id].interval);
            document.getElementById(`${id}-timer`).classList.remove('running');
            if (breather) {
                breather.classList.remove('active', currentRoutine.breatherClass);
            }
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
            completeExercise(id);
        }
    }, 1000);
}

function pauseTimer(id) {
    if (timers[id] && timers[id].interval) {
        clearInterval(timers[id].interval);
        timers[id].interval = null;
        document.getElementById(`${id}-timer`).classList.remove('running');
        const breather = document.getElementById(`${id}-breather`);
        if (breather && currentRoutine) {
            breather.classList.remove('active', currentRoutine.breatherClass);
        }
        const audio = document.getElementById('session-audio');
        audio.pause();
    }
}

function resetTimer(id) {
    if (timers[id]) {
        clearInterval(timers[id].interval);
        timers[id] = null;
        document.getElementById(`${id}-timer`).textContent = '00:00';
        document.getElementById(`${id}-timer`).classList.remove('running');
        const breather = document.getElementById(`${id}-breather`);
        if (breather && currentRoutine) {
            breather.classList.remove('active', currentRoutine.breatherClass);
        }
        const audio = document.getElementById('session-audio');
        audio.pause();
        audio.currentTime = 0;
        audio.src = ''; // Clear src to stop any loading
    }
}

function updateTimerDisplay(id) {
    const minutes = Math.floor(timers[id].remaining / 60);
    const seconds = timers[id].remaining % 60;
    document.getElementById(`${id}-timer`).textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function completeExercise(id) {
    if (completedExercises[id]) return;
    pauseTimer(id);
    document.getElementById('chime').play().catch(() => {});
    alert(`Completed daily routine! Great job!`);
    completedExercises[id] = true;
    document.getElementById(`${id}-exercise`).classList.add('completed');
    checkSessionComplete('daily');
}

// Rest of the script unchanged (checkSessionComplete, getTodayDate, saveProgress, resetProgress, clearAllProgress, generateCalendar, calculateStreak, theme toggle, onload)
function checkSessionComplete(session) {
    if (session === 'daily' && completedExercises['daily']) {
        document.getElementById('daily-check').checked = true;
        saveProgress();
    }
}

function getTodayDate() {
    const today = new Date();
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
}

function saveProgress() {
    const today = getTodayDate();
    if (!progressData[today]) progressData[today] = {};
    progressData[today].daily = document.getElementById('daily-check').checked;
    progressData[today].completed = completedExercises;
    localStorage.setItem('breathwork-progress', JSON.stringify(progressData));
    generateCalendar();
    calculateStreak();
}

function resetProgress() {
    const today = getTodayDate();
    document.getElementById('daily-check').checked = false;
    completedExercises = {};
    progressData[today] = {daily: false, completed: {}};
    localStorage.setItem('breathwork-progress', JSON.stringify(progressData));
    document.querySelectorAll('.exercise').forEach(ex => ex.classList.remove('completed'));
    generateCalendar();
    calculateStreak();
}

function clearAllProgress() {
    if (confirm('Are you sure? This will clear all calendar progress history.')) {
        progressData = {};
        localStorage.setItem('breathwork-progress', JSON.stringify(progressData));
        resetProgress();
        calculateStreak();
    }
}

function generateCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const header = document.createElement('div');
    header.classList.add('calendar-header');
    header.textContent = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    calendar.appendChild(header);
    
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
        const dayLabel = document.createElement('div');
        dayLabel.classList.add('calendar-weekday');
        dayLabel.textContent = day;
        calendar.appendChild(dayLabel);
    });
    
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.classList.add('calendar-day', 'empty');
        calendar.appendChild(empty);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const dayElem = document.createElement('div');
        dayElem.classList.add('calendar-day');
        dayElem.textContent = day;
        
        if (progressData[dateStr] && progressData[dateStr].daily) {
            dayElem.classList.add('complete');
        } else if (day > now.getDate()) {
            dayElem.classList.add('empty');
        } else {
            dayElem.classList.add('incomplete');
        }
        
        calendar.appendChild(dayElem);
    }
}

function calculateStreak() {
    let streak = 0;
    let date = new Date();
    while (true) {
        const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        if (progressData[dateStr] && progressData[dateStr].daily) {
            streak++;
        } else {
            break;
        }
        date.setDate(date.getDate() - 1);
    }
    document.getElementById('streak-info').textContent = `Current Streak: ${streak} days`;
}

// Theme toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// Load theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
}

// On load
window.onload = () => {
    setDailyRoutine();
    const today = getTodayDate();
    if (progressData[today]) {
        document.getElementById('daily-check').checked = progressData[today].daily || false;
        completedExercises = progressData[today].completed || {};
        if (completedExercises['daily']) {
            document.getElementById('daily-exercise').classList.add('completed');
        }
    }
    generateCalendar();
    calculateStreak();
};

document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', saveProgress);
});
