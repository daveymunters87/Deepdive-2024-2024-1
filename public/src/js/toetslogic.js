document.addEventListener('DOMContentLoaded', function () {
    let correctAnswersCount = 0;
    const totalQuestionsCount = 4; // Zet het totale aantal vragen vast

    function checkAnswers(sectionId, correctAnswers, checkButtonId) {
        const section = document.getElementById(sectionId);
        const checkButton = document.getElementById(checkButtonId);
        const questions = section.querySelectorAll('.question');

        // Voeg blur toe aan de sectie en zet pointer-events uit
        section.classList.add('blurred');

        questions.forEach((question) => {
            const inputs = question.querySelectorAll('input');
            inputs.forEach(input => {
                const label = input.parentElement;
                if (input.checked) {
                    if (correctAnswers[input.name] === input.value) {
                        label.classList.remove('bg-red-500');
                        label.classList.add('bg-green-500');
                        correctAnswersCount++;
                    } else {
                        label.classList.remove('bg-green-500');
                        label.classList.add('bg-red-500');
                    }
                } else {
                    label.classList.remove('bg-green-500', 'bg-red-500');
                }
            });
        });

        checkButton.classList.add('hidden');
    }

    document.getElementById('nextPageButton').addEventListener('click', function () {
        const summaryModal = document.getElementById('summaryModal');
        const correctAnswerSummary = document.getElementById('correctAnswerSummary');
        const nextPageButtonContainer = document.getElementById('nextPageButtonContainer');

        correctAnswerSummary.innerText = `Je hebt ${correctAnswersCount} van de ${totalQuestionsCount} vragen correct beantwoord!`;

        calculateXp(); // Bereken en toon de XP onder de GIF

        nextPageButtonContainer.classList.add('hidden');
        summaryModal.classList.remove('hidden');
    });

    document.getElementById('closeSummary').addEventListener('click', function () {
        const summaryModal = document.getElementById('summaryModal');
        summaryModal.classList.add('hidden');
    
        // Verwijder de XP tekst na sluiten
        const xpElement = summaryModal.querySelector('.text-green-500');
        if (xpElement) xpElement.remove();
    
        document.querySelectorAll('.blurred').forEach(element => element.classList.remove('blurred'));
    
        window.location.href = "informatiehuishouding.html";
    });

    document.getElementById('checkMetadata').addEventListener('click', function () {
        const correctAnswers = {
            metadata1: 'B',
            metadata2: 'A'
        };
        checkAnswers('metadataQuestions', correctAnswers, 'checkMetadata');
    });

    document.getElementById('checkArchivering').addEventListener('click', function () {
        const correctAnswers = {
            archivering1: 'B',
            archivering2: 'B'
        };
        checkAnswers('archiveringQuestions', correctAnswers, 'checkArchivering');
    });

    function calculateXp() {
        let xpEarned = correctAnswersCount * 100; // 100 XP per correct antwoord
        if (xpEarned > 0) {
            const xpElement = document.createElement('p');
            xpElement.className = 'text-green-500 font-semibold text-lg mt-4';
            xpElement.textContent = `+${xpEarned} XP`;

            // Zorg ervoor dat de XP onder de GIF komt
            const summaryGif = document.getElementById('summaryGif');
            summaryGif.insertAdjacentElement('afterend', xpElement);
        }

        console.log(xpEarned); // Log alleen het XP-getal
        addXP(xpEarned);
    }

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
    
    function addXP(addedXP) {
        getLevelData().then(levelData => {
            let level = levelData['Level'];
            let currentXP = levelData['CurrentXP'];
            let totalXP = levelData['TotalXP'];
    
            currentXP += addedXP;
    
            while (currentXP >= totalXP) {
                currentXP -= totalXP;
                level++;
            }
    
            let updatedData = {
                "Level": level,
                "CurrentXP": currentXP,
                "TotalXP": totalXP
            };
            localStorage.setItem('levelData', JSON.stringify(updatedData));
    
            levelElem.textContent = `Level ${level}`;
            xpElem.textContent = `${currentXP}/${totalXP} XP`;
            levelNumberElem.textContent = level;
    
            console.log(`New Level: ${level}, Current XP: ${currentXP}/${totalXP}`);
            let degrees = 360 / (totalXP / currentXP);
            console.log(degrees);
            updateProgressBar(degrees);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        const checkButtons = document.querySelectorAll('#checkMetadata, #checkArchivering');
        const summaryModal = document.getElementById('summaryModal');
        const closeSummary = document.getElementById('closeSummary');

        checkButtons.forEach(button => {
            button.addEventListener('click', function () {
                checkAnswers();
            });
        });

        closeSummary.addEventListener('click', function () {
            summaryModal.classList.add('hidden');
            const xpElement = summaryModal.querySelector('.text-green-500');
            if (xpElement) xpElement.remove();
        });
    });
});
