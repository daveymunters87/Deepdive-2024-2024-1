document.addEventListener('DOMContentLoaded', function() {
    // Challenges data
    const challenges = [
        {
            title: "Voltooi 5 Modules",
            description: "Maak 5 modules volledig af om deze uitdaging te voltooien.",
            reward: "50 XP",
            completed: false
        },
        {
            title: "Behaal een Score van 100%",
            description: "Behaal een perfecte score in één van de modules om deze uitdaging te voltooien.",
            reward: "100 XP",
            completed: false
        },
        {
            title: "Log 7 Dagen Achter Elkaar In",
            description: "Log dagelijks in voor een week om deze uitdaging te voltooien.",
            reward: "30 XP",
            completed: true
        }
    ];

    const badges = [
        {
            title: "Behaal perfecte module",
            imgSrc: "images/badge1.png",
            reward: "20 XP",
            unlocked: false
        },
        {
            title: "Behaal level 20",
            imgSrc: "images/badge2.png",
            reward: "50 XP",
            unlocked: false
        },
        {
            title: "Sta op nummer 1",
            imgSrc: "images/badge3.png",
            reward: "100 XP",
            unlocked: false
        },
        {
            title: "Sta in de top 10",
            imgSrc: "images/badge4.png",
            reward: "30 XP",
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
            challengeCard.className = `challenge-card bg-white shadow-lg rounded-lg p-4 ${challenge.completed ? 'completed' : ''}`;

            challengeCard.innerHTML = `
                <h3 class="font-bold text-xl mb-2">${challenge.title}</h3>
                <p class="text-sm text-gray-500 mb-4">${challenge.description}</p>
                <p class="font-semibold text-green-500">Beloning: ${challenge.reward}</p>
                <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded ${challenge.completed ? 'hidden' : ''}" onclick="completeChallenge(${index})">Voltooi Challenge</button>
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

            badgeCard.innerHTML = `
                <img src="${badge.imgSrc}" alt="${badge.title}" class="mx-auto h-48 w-48 transition-transform duration-300 transform hover:scale-125">
                <p class="font-bold mt-4">${badge.title}</p>
                <p class="font-semibold text-green-500">${badge.unlocked ? 'Beloning: ' + badge.reward : ''}</p>
                <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded ${badge.unlocked ? 'hidden' : ''}" onclick="unlockBadge(${index})">Ontgrendel Badge</button>
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
    };

    // Function to generate confetti elements
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
});
