let levelElem = document.getElementById('Level');
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
addXP(200);

