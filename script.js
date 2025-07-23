let timers = {};
let progressData = JSON.parse(localStorage.getItem('breathwork-progress')) || {};
let completedExercises = {};
let currentRoutine = null;

const routines = [
    {
        id: 'pursedlip',
        title: 'Pursed Lip Breathing',
        desc: 'Relax your neck and shoulders. Inhale slowly through your nose for 2 counts with your mouth closed. Pucker or purse your lips as though going to whistle. Exhale slowly by blowing air through pursed lips for a count of 4. Practice 4 to 5 times a day when beginning.<br>Benefits: Helps slow down your breathing pace, making it useful during activities like bending, lifting, or climbing stairs. It promotes relaxation and reduces stress.',
        breatherClass: 'pursedlip'
    },
    {
        id: 'diaphragmatic',
        title: 'Diaphragmatic Breathing',
        desc: 'Lie on your back with knees slightly bent and head on a pillow. Place one hand on your upper chest and one below your rib cage. Inhale slowly through your nose, feeling your stomach press into your hand. Exhale using pursed lips, tightening your abdominal muscles. Practice for 5 to 10 minutes, 3 to 4 times daily.<br>Benefits: Improves diaphragm use, reduces stress, and is beneficial for conditions like COPD, heart problems, high blood pressure, and migraine headaches.',
        breatherClass: 'diaphragmatic'
    },
    {
        id: 'breathfocus',
        title: 'Breath Focus Technique',
        desc: 'Sit or lie comfortably. Alternate between normal and deep breaths. Place a hand below your belly button and notice it rise and fall. Combine with imagery and a focus word like "peace". Start with 10-minute sessions, increasing to 20 minutes.<br>Benefits: Promotes relaxation through imagery and focus, helping to reduce anxiety and enhance overall wellbeing.',
        breatherClass: 'breathfocus'
    },
    {
        id: 'lions',
        title: 'Lion’s Breath',
        desc: 'Sit comfortably. Inhale deeply through your nose, then open your mouth wide, stick out your tongue, and exhale with a "haaa" sound. Do this 2 to 3 times.<br>Benefits: Energizing and relieves tension in the jaw and face, contributing to stress reduction and emotional release.',
        breatherClass: 'lions'
    },
    {
        id: 'alternatenostril',
        title: 'Alternate Nostril Breathing',
        desc: 'Sit comfortably. Close your right nostril and inhale through the left, then close the left and exhale through the right. Continue alternating for up to 5 minutes.<br>Benefits: Promotes relaxation, enhances cardiovascular function, lowers heart rate, and balances the nervous system for better sleep and stress management.',
        breatherClass: 'alternatenostril'
    },
    {
        id: 'equal',
        title: 'Equal Breathing',
        desc: 'Sit comfortably. Inhale and exhale through your nose for an equal count (3 to 5). Add a pause if comfortable. Continue for at least 5 minutes.<br>Benefits: Brings balance and equanimity, increases oxygen supply to the brain and lungs, improving mental wellbeing and reducing stress.',
        breatherClass: 'equal'
    },
    {
        id: 'coherent',
        title: 'Coherent Breathing',
        desc: 'Inhale for a count of 5, exhale for a count of 5. Continue for at least a few minutes.<br>Benefits: Maximizes heart rate variability, reduces stress, and can alleviate symptoms of depression when combined with yoga practices.',
        breatherClass: 'coherent'
    },
    {
        id: 'sitali',
        title: 'Sitali Breath',
        desc: 'Sit comfortably. Curl your tongue and inhale through your mouth, exhale through your nose. Continue for up to 5 minutes.<br>Benefits: Cools the body, calms the mind, reduces stress, and improves focus and digestion.',
        breatherClass: 'sitali'
    },
    {
        id: 'deep',
        title: 'Deep Breathing',
        desc: 'Sit or stand straight. Inhale through your nose, expanding your abdomen, rib cage, and upper chest. Exhale in reverse order. Practice regularly.<br>Benefits: Increases oxygen supply, promotes relaxation, and enhances overall physical and mental health.',
        breatherClass: 'deep'
    },
    {
        id: 'bhramari',
        title: 'Humming Bee Breath (Bhramari)',
        desc: 'Sit comfortably. Close your eyes and ears, inhale, then exhale with a high-pitched hum. Practice for 5-10 minutes.<br>Benefits: Relieves tension, anger, and anxiety, promotes calmness and better sleep.',
        breatherClass: 'bhramari'
    },
    {
        id: 'box',
        title: 'Box Breathing',
        desc: 'Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat.<br>Benefits: Improves focus, calms the mind, reduces stress, and enhances emotional regulation.',
        breatherClass: 'box'
    },
    {
        id: 'ujjayi',
        title: 'Ujjayi Breathing',
        desc: 'Inhale and exhale through your nose with a slight throat constriction, creating an ocean-like sound. Use equal counts.<br>Benefits: Builds internal heat, improves concentration, reduces stress, and supports yoga practice for overall wellbeing.',
        breatherClass: 'ujjayi'
    },
    {
        id: 'kapalabhati',
        title: 'Kapalabhati Pranayama',
        desc: 'Sit upright. Inhale deeply, then exhale in rapid bursts (20-30 pumps). Repeat 3-5 rounds.<br>Benefits: Increases alertness and energy, clears the mind, and supports detoxification for improved wellness.',
        breatherClass: 'kapalabhati'
    },
    {
        id: 'bhastrika',
        title: 'Bhastrika Pranayama',
        desc: 'Sit upright. Inhale and exhale forcefully through the nose in rapid succession (20-30 breaths). Repeat 3-5 rounds.<br>Benefits: Enhances vitality, mental clarity, reduces stress, and boosts overall energy levels.',
        breatherClass: 'bhastrika'
    },
    {
        id: 'wimhof',
        title: 'Wim Hof Breathing',
        desc: 'Sit or lie comfortably. Take 30-40 powerful breaths in and out through the mouth, fully inhaling to expand the chest and belly, then letting go on exhale without force. After the last exhale, hold your breath as long as comfortable. Then inhale deeply and hold for 15 seconds. Repeat for 3-4 rounds.<br>Benefits: Boosts immune function, reduces inflammation and stress, increases energy, focus, and resilience.',
        breatherClass: 'wimhof'
    },
    {
        id: 'tummo',
        title: 'Tummo Breathing',
        desc: 'Sit in a meditative posture. Inhale deeply through the nose, filling the lower belly. As you exhale, pull the navel in and up, contracting the pelvic floor and lower abdominal muscles to form a "vase" shape. Hold the contraction while taking shallow breaths. Visualize heat rising from the lower belly up the spine. Release and repeat cycles.<br>Benefits: Generates inner heat, enhances deep meditation, balances energy, reduces stress, and promotes profound wellbeing.',
        breatherClass: 'tummo'
    },
    {
        id: 'holotropic',
        title: 'Holotropic Breathwork (Shortened)',
        desc: 'Lie down comfortably. Breathe rapidly and deeply through the mouth without pauses, emphasizing full inhales and exhales to create a continuous flow. Maintain for 10-20 minutes, allowing emotions or sensations to arise. End with slower breaths to integrate.<br>Benefits: Facilitates emotional release, induces altered states for emotional exploration, reduces chronic stress, and supports psychological healing.',
        breatherClass: 'holotropic'
    }
];

function getDailyRoutine() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const index = dayOfYear % routines.length;
    return routines[index];
}

function setDailyRoutine() {
    currentRoutine = getDailyRoutine();
    document.getElementById('daily-title').textContent = currentRoutine.title;
    document.getElementById('daily-desc').innerHTML = currentRoutine.desc;
    if (['coherent', 'box', 'equal'].includes(currentRoutine.id)) {
        document.getElementById('custom-ratio').style.display = 'block';
    } else {
        document.getElementById('custom-ratio').style.display = 'none';
    }
}

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
        audio.loop = true; // Loop for ambient music
        audio.play().catch(() => {});
    }
    
    if (navigator.vibrate) navigator.vibrate(200);
    
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
        audio.src = '';
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

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
}

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
