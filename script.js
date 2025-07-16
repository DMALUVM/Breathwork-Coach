let timers = {}; // Store interval IDs and remaining time for each timer
let progressData = JSON.parse(localStorage.getItem('breathwork-progress')) || {}; // { 'YYYY-MM-DD': {morning: bool, midday: bool, evening: bool} }

const guidanceTexts = {
    'kapalabhati': 'Sit upright with a straight spine. Inhale deeply through your nose, then exhale forcefully in short rapid bursts, pumping your belly. Do twenty to thirty pumps per round. Repeat three to five rounds. Focus on the cleansing energy.',
    'coherent': 'Breathe at a steady rhythm. Inhale through your nose for five seconds, then exhale for five seconds. Visualize sending compassion to yourself or others on each exhale. Stay relaxed.',
    'box': 'This is box breathing. Inhale for four seconds, hold for four, exhale for four, hold for four. Repeat five to ten times. Let your mind sharpen with each cycle.',
    'cyclic': 'For cyclic sighing, inhale deeply through your nose, then take a second short inhale to top off. Follow with a long slow sigh exhale through your mouth. Repeat five to ten cycles. Release tension with each sigh.',
    'nadi': 'Alternate nostril breathing. Close your right nostril and inhale left for four seconds. Close left, exhale right for four. Inhale right, exhale left. Repeat five to ten cycles. Balance your energy.',
    'bhramari': 'For four-seven-eight with Bhramari. Inhale quietly for four seconds, hold for seven, exhale with a low hum for eight. Repeat four to eight times. Feel the vibration calm your mind.'
};

const breatherClasses = {
    'kapalabhati': 'generic',
    'coherent': 'coherent',
    'box': 'box',
    'cyclic': 'cyclic',
    'nadi': 'nadi',
    'bhramari': 'bhramari'
};

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
    const music = document.getElementById(`${id}-music`);
    if (music) music.play().catch(() => {});
    
    // Activate visualizer
    const breather = document.getElementById(`${id}-breather`);
    if (breather) {
        breather.classList.add('active', breatherClasses[id]);
    }
    
    // Play guided audio if supported
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(guidanceTexts[id]);
        utterance.rate = 0.9; // Slightly slower for calm
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
    } else {
        alert('Voice guidance not supported in this browser—try Chrome or Firefox for the full experience.');
    }
    
    timers[id].interval = setInterval(() => {
        timers[id].remaining--;
        updateTimerDisplay(id);
        if (timers[id].remaining <= 0) {
            clearInterval(timers[id].interval);
            document.getElementById(`${id}-timer`).classList.remove('running');
            if (music) {
                music.pause();
                music.currentTime = 0;
            }
            if (breather) {
                breather.classList.remove('active', breatherClasses[id]);
            }
            document.getElementById('chime').play().catch(() => {}); // Play chime sound
            alert(`Time's up for ${id}!`);
        }
    }, 1000);
}

function pauseTimer(id) {
    if (timers[id] && timers[id].interval) {
        clearInterval(timers[id].interval);
        timers[id].interval = null;
        document.getElementById(`${id}-timer`).classList.remove('running');
        const music = document.getElementById(`${id}-music`);
        if (music) music.pause();
        const breather = document.getElementById(`${id}-breather`);
        if (breather) breather.classList.remove('active', breatherClasses[id]);
    }
}

function resetTimer(id) {
    if (timers[id]) {
        clearInterval(timers[id].interval);
        timers[id] = null;
        document.getElementById(`${id}-timer`).textContent = '00:00';
        document.getElementById(`${id}-timer`).classList.remove('running');
        const music = document.getElementById(`${id}-music`);
        if (music) {
            music.pause();
            music.currentTime = 0;
        }
        const breather = document.getElementById(`${id}-breather`);
        if (breather) breather.classList.remove('active', breatherClasses[id]);
    }
}

function updateTimerDisplay(id) {
    const minutes = Math.floor(timers[id].remaining / 60);
    const seconds = timers[id].remaining % 60;
    document.getElementById(`${id}-timer`).textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function getTodayDate() {
    const today = new Date();
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
}

function saveProgress() {
    const today = getTodayDate();
    if (!progressData[today]) progressData[today] = {};
    progressData[today].morning = document.getElementById('morning-check').checked;
    progressData[today].midday = document.getElementById('midday-check').checked;
    progressData[today].evening = document.getElementById('evening-check').checked;
    localStorage.setItem('breathwork-progress', JSON.stringify(progressData));
    generateCalendar();
}

function resetProgress() {
    const today = getTodayDate();
    document.getElementById('morning-check').checked = false;
    document.getElementById('midday-check').checked = false;
    document.getElementById('evening-check').checked = false;
    progressData[today] = {morning: false, midday: false, evening: false};
    localStorage.setItem('breathwork-progress', JSON.stringify(progressData));
    generateCalendar();
}

function clearAllProgress() {
    if (confirm('Are you sure? This will clear all calendar progress history.')) {
        progressData = {};
        localStorage.setItem('breathwork-progress', JSON.stringify(progressData));
        resetProgress(); // Also resets today
        generateCalendar();
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
    
    // Header
    const header = document.createElement('div');
    header.classList.add('calendar-header');
    header.textContent = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    calendar.appendChild(header);
    
    // Weekdays
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
        const dayLabel = document.createElement('div');
        dayLabel.classList.add('calendar-weekday');
        dayLabel.textContent = day;
        calendar.appendChild(dayLabel);
    });
    
    // Empty slots for start of month
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.classList.add('calendar-day', 'empty');
        calendar.appendChild(empty);
    }
    
    // Days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const dayElem = document.createElement('div');
        dayElem.classList.add('calendar-day');
        dayElem.textContent = day;
        
        if (progressData[dateStr]) {
            const sessions = Object.values(progressData[dateStr]).filter(Boolean).length;
            if (sessions === 3) dayElem.classList.add('complete');
            else if (sessions > 0) dayElem.classList.add('partial');
            else dayElem.classList.add('incomplete');
        } else if (day > now.getDate()) {
            dayElem.classList.add('empty'); // Future days
        } else {
            dayElem.classList.add('incomplete'); // Past days with no data
        }
        
        calendar.appendChild(dayElem);
    }
}

// Load progress and generate calendar on load
window.onload = () => {
    const today = getTodayDate();
    if (progressData[today]) {
        document.getElementById('morning-check').checked = progressData[today].morning || false;
        document.getElementById('midday-check').checked = progressData[today].midday || false;
        document.getElementById('evening-check').checked = progressData[today].evening || false;
    }
    generateCalendar();
};

// Save on checkbox change
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', saveProgress);
});
