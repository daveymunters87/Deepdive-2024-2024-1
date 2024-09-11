let correctAnswersCount = 0;
const totalQuestionsCount = 4; // Zet het totale aantal vragen vast

function checkAnswers(sectionId, correctAnswers, checkButtonId) {
    const section = document.getElementById(sectionId);
    const checkButton = document.getElementById(checkButtonId);
    const questions = section.querySelectorAll('.question');

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

    nextPageButtonContainer.classList.add('hidden');
    summaryModal.classList.remove('hidden');
});

document.getElementById('closeSummary').addEventListener('click', function () {
    const summaryModal = document.getElementById('summaryModal');
    summaryModal.classList.add('hidden');
    window.location.href = 'informatiehuishouding.html';
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
