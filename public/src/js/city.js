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

    // Update the text content of the level and XP elements
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

// Example usage: update to 300 degrees
// Load the initial data when the page loads
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

// Select the containers to display challenges and badges
const challengesContainer = document.getElementById('challengesContainer');
const badgesContainer = document.getElementById('badgesContainer');

// Function to render challenges
function renderChallenges() {
    challengesContainer.innerHTML = ""; // Clear any existing content

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

// Function to render badges
function renderBadges() {
    badgesContainer.innerHTML = ""; // Clear any existing content

    badges.forEach((badge, index) => {
        const badgeCard = document.createElement('div');
        badgeCard.className = `badge-card bg-white shadow-lg rounded-lg p-4 ${badge.unlocked ? 'unlocked' : ''}`;

        // Apply grayscale and disable the button only for the first badge
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
// Function to mark a challenge as completed
window.completeChallenge = function(index) {
    const challenge = challenges[index];
    challenge.completed = true; // Update challenge status
    renderChallenges(); // Re-render challenges

    // Add animation to completed card
    const completedCard = document.querySelectorAll('.challenge-card')[index];
    completedCard.classList.add('animate-complete'); // Trigger the animation class

    // Generate confetti elements
    generateConfetti(completedCard);

    // Extract and log only the XP number
    const xpEarned = parseInt(challenge.reward); 
    console.log(xpEarned);
    addXP(xpEarned)
};

// Function to unlock a badge
window.unlockBadge = function(index) {
    const badge = badges[index];
    badge.unlocked = true; // Update badge status
    renderBadges(); // Re-render badges

    // Add animation to unlocked badge
    const unlockedBadge = document.querySelectorAll('.badge-card')[index];
    unlockedBadge.classList.add('animate-badge'); // Trigger the animation class

    // Generate confetti elements
    generateConfetti(unlockedBadge);

    // Extract and log only the XP number
    const xpEarned = parseInt(badge.reward); 
    console.log(xpEarned);
    addXP(xpEarned)
};

function generateConfetti(container) {
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * container.clientWidth + 'px'; // Random x position
        confetti.style.backgroundColor = getRandomColor(); // Random color for each confetti
        container.appendChild(confetti);
    }
}

// Function to get a random color
function getRandomColor() {
    const colors = ['#FF6B6B', '#FFB8B8', '#6BCB77', '#4D96FF', '#FFDE59', '#F3A712', '#A9DEF9'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Initial render
renderChallenges();
renderBadges();