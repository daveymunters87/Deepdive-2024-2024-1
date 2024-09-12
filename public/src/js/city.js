let levelElem = document.getElementById('Level');
let levelNumberElem = document.getElementById('LevelNumber');
let xpElem = document.getElementById('XP');

console.log("logging");

async function getLevelData() {
    if (!localStorage.getItem('levelData')) {
        const request = await fetch('./data.json');
        const levelData = await request.json();
        localStorage.setItem('levelData', JSON.stringify(levelData));
        return levelData;
    } else {
        let levelData = localStorage.getItem('levelData');
        levelData = JSON.parse(levelData);
        return levelData;
    }
}

async function loadLevelData() {
    const levelData = await getLevelData();
    let level = levelData['Level'];
    let currentXP = levelData['CurrentXP'];
    let totalXP = levelData['TotalXP'];
    console.log(level, currentXP, totalXP);

    levelElem.textContent = `Level ${level}`;
    xpElem.textContent = `${currentXP}/${totalXP} XP`;
    let degrees = 360 / (totalXP / currentXP);
    levelNumberElem.textContent = level;
    console.log(degrees);
    updateProgressBar(degrees);
}

function addXP(addedXP) {
    getLevelData().then(levelData => {
        let level = levelData['Level'];
        let currentXP = levelData['CurrentXP'];
        let totalXP = levelData['TotalXP'];

        // Add XP
        currentXP += addedXP;

        // Check if level up is required
        while (currentXP >= totalXP) {
            currentXP -= totalXP;
            level++;
        }

        // Update the data in localStorage
        let updatedData = {
            "Level": level,
            "CurrentXP": currentXP,
            "TotalXP": totalXP
        };
        localStorage.setItem('levelData', JSON.stringify(updatedData));

        // Update the page with new level and XP
        levelElem.textContent = `Level ${level}`;
        xpElem.textContent = `${currentXP}/${totalXP} XP`;
        levelNumberElem.textContent = level;

        console.log(`New Level: ${level}, Current XP: ${currentXP}/${totalXP}`);
        let degrees = 360 / (totalXP / currentXP);
        console.log(degrees);
        updateProgressBar(degrees);
    });
}

function updateProgressBar(deg) {
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.background = `conic-gradient(#01689B 0deg ${deg}deg, transparent ${deg}deg)`;
}

loadLevelData();

const challenges = [
    {
        title: "Voltooi 5 Modules",
        description: "Maak 5 modules volledig af om deze uitdaging te voltooien.",
        reward: "500 XP",
        completed: false
    },
    {
        title: "Behaal een Score van 100%",
        description: "Behaal een perfecte score in één van de modules om deze uitdaging te voltooien.",
        reward: "200 XP",
        completed: false
    },
    {
        title: "Log 7 Dagen Achter Elkaar In",
        description: "Log dagelijks in voor een week om deze uitdaging te voltooien.",
        reward: "900 XP",
        completed: true
    }
];

const badges = [
    {
        title: "Behaal perfecte module",
        imgSrc: "images/badge1.png",
        reward: "200 XP",
        unlocked: false
    },
    {
        title: "Behaal level 5",
        imgSrc: "images/badge2.png",
        reward: "500 XP",
        unlocked: false
    },
    {
        title: "Sta op nummer 1",
        imgSrc: "images/badge3.png",
        reward: "1000 XP",
        unlocked: false
    },
    {
        title: "Sta in de top 10",
        imgSrc: "images/badge4.png",
        reward: "250 XP",
        unlocked: true
    }
];

const challengesContainer = document.getElementById('challengesContainer');
const badgesContainer = document.getElementById('badgesContainer');

function renderChallenges() {
    challengesContainer.innerHTML = ""; 

    challenges.forEach((challenge, index) => {
        const challengeCard = document.createElement('div');
        challengeCard.className = `challenge-card bg-white transition-transform duration-300 transform hover:scale-110 shadow-lg rounded-lg p-4 ${challenge.completed ? 'completed' : ''}`;

        challengeCard.innerHTML = `
            <h3 class="font-bold text-xl mb-2">${challenge.title}</h3>
            <p class="text-sm text-gray-500 mb-4">${challenge.description}</p>
            <p class="font-semibold text-green-500">Beloning: ${challenge.reward}</p>
            <button class="mt-4 px-4 py-2 bg-[#154273] text-white rounded ${challenge.completed ? 'hidden' : ''}" onclick="completeChallenge(${index})">Voltooi Challenge</button>
            ${challenge.completed ? '<span class="text-green-500 font-bold">Voltooid!</span>' : ''}
        `;

        challengesContainer.appendChild(challengeCard);
    });
}

function renderBadges() {
    badgesContainer.innerHTML = ""; 

    badges.forEach((badge, index) => {
        const badgeCard = document.createElement('div');
        badgeCard.className = `badge-card bg-white shadow-lg rounded-lg p-4 ${badge.unlocked ? 'unlocked' : ''}`;

        const isFirstBadge = index === 0 && !badge.unlocked;

        badgeCard.innerHTML = `
            <img src="${badge.imgSrc}" alt="${badge.title}" class="mx-auto h-48 w-48 transition-transform duration-300 transform hover:scale-125 ${isFirstBadge ? 'grayscale' : ''}">
            <p class="font-bold mt-4">${badge.title}</p>
            <p class="font-semibold text-green-500">${badge.unlocked ? 'Beloning: ' + badge.reward : ''}</p>
            <button class="mt-4 px-4 py-2 ${isFirstBadge ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#154273]'} text-white rounded ${badge.unlocked ? 'hidden' : ''}" ${isFirstBadge ? 'disabled' : ''} onclick="unlockBadge(${index})">${badge.unlocked ? 'Ontgrendeld!' : (isFirstBadge ? 'Nog niet behaald' : 'Ontgrendel Badge')}</button>
            ${badge.unlocked ? '<span class="text-green-500 font-bold">Ontgrendeld!</span>' : ''}
        `;

        badgesContainer.appendChild(badgeCard);
    });
}

window.completeChallenge = function(index) {
    const challenge = challenges[index];
    challenge.completed = true; 
    renderChallenges(); 

    const completedCard = document.querySelectorAll('.challenge-card')[index];
    completedCard.classList.add('animate-complete'); 

    generateConfetti(completedCard);

    const xpEarned = parseInt(challenge.reward); 
    console.log(xpEarned);
    addXP(xpEarned)
};

window.unlockBadge = function(index) {
    const badge = badges[index];
    badge.unlocked = true;
    renderBadges(); 

    const unlockedBadge = document.querySelectorAll('.badge-card')[index];
    unlockedBadge.classList.add('animate-badge'); 

    generateConfetti(unlockedBadge);

    const xpEarned = parseInt(badge.reward); 
    console.log(xpEarned);
    addXP(xpEarned)
};

function generateConfetti(container) {
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * container.clientWidth + 'px'; 
        confetti.style.backgroundColor = getRandomColor();
        container.appendChild(confetti);
    }
}

function getRandomColor() {
    const colors = ['#FF6B6B', '#FFB8B8', '#6BCB77', '#4D96FF', '#FFDE59', '#F3A712', '#A9DEF9'];
    return colors[Math.floor(Math.random() * colors.length)];
}

renderChallenges();
renderBadges();