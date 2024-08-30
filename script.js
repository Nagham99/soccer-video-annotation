const shortcuts = {
    'qa': 'Pass',
    'wa': 'Reception',
    'qz': 'cross',
    'u': 'under pressure',
    'ea': 'Block',
    'ws': 'LBR',
    'ex': 'take on against',
    'qf': 'own goal',
    'qs': 'on-target-shot',
    'ts':  'Goal out',
    'qs': 'on-target shot'

};

const sequences = [
    ['ea', 'ws', 'qa'], // block, LBR, pass
    ['wa', 'qa'],  // pass, reception
    
    // Add more sequences as needed
];

let practiceCount;
let correctCount = 0;
let incorrectCount = 0;
let currentCombo = [];
let practicing = false;
let userInput = '';
let startTime;
let totalTimeSpent = 0;
let practiceMode = ''; // 'all', 'sequence', 'both'

// Function to start practice session
function startPractice(mode) {
    practiceCount = parseInt(document.getElementById('rounds').value);
    if (isNaN(practiceCount) || practiceCount <= 0) {
        alert('Please enter a valid number of practice rounds.');
        return;
    }
    correctCount = 0;
    incorrectCount = 0;
    totalTimeSpent = 0;
    practicing = true;
    practiceMode = mode;
    document.getElementById('result').textContent = '';
    document.getElementById('summary').classList.add('hidden');
    document.querySelector('.start-all-actions-button').style.display = 'none';
    document.querySelector('.start-common-sequence-button').style.display = 'none';
    document.querySelector('.start-both-button').style.display = 'none';
    document.querySelector('.end-button').style.display = 'inline-block';
    document.getElementById('practice-area').classList.remove('hidden');
    practiceRound();
}

// Function to end practice session
function endPractice() {
    practicing = false;
    const averageSpeed = correctCount > 0 ? (totalTimeSpent / correctCount / 0.621371).toFixed(2) : 'N/A'; // Speed in MPH
    document.getElementById('prompt').textContent = `Practice ended. Correct: ${correctCount}, Incorrect: ${incorrectCount}`;
    document.getElementById('summary').classList.remove('hidden');
    document.getElementById('total-time').textContent = totalTimeSpent.toFixed(2);
    document.getElementById('total-speed').textContent = averageSpeed;
    document.querySelector('.start-all-actions-button').style.display = 'inline-block';
    document.querySelector('.start-common-sequence-button').style.display = 'inline-block';
    document.querySelector('.start-both-button').style.display = 'inline-block';
    document.querySelector('.end-button').style.display = 'none';
    document.removeEventListener('keydown', onKeyPress);
}

// Function to initiate a practice round
function practiceRound() {
    if (!practicing || practiceCount <= 0) {
        endPractice();
        return;
    }

    if (practiceMode === 'sequence') {
        // Randomly select a sequence
        currentCombo = getRandomSequence();
        document.getElementById('prompt').textContent = `Press '${currentCombo.join(', ')}' (${currentCombo.map(k => shortcuts[k]).join(', ')})`;
    } else if (practiceMode === 'both') {
        // Randomly select a mode: individual action or sequence
        if (Math.random() > 0.5) {
            // Individual action
            currentCombo = [getRandomKey(shortcuts)];
            document.getElementById('prompt').textContent = `Press '${currentCombo[0]}' (${shortcuts[currentCombo[0]]})`;
        } else {
            // Sequence
            currentCombo = getRandomSequence();
            document.getElementById('prompt').textContent = `Press '${currentCombo.join(', ')}' (${currentCombo.map(k => shortcuts[k]).join(', ')})`;
        }
    } else {
        // All actions
        currentCombo = [getRandomKey(shortcuts)];
        document.getElementById('prompt').textContent = `Press '${currentCombo[0]}' (${shortcuts[currentCombo[0]]})`;
    }

    // Reset user input and listen for keydown events
    userInput = '';
    startTime = new Date(); // Record the start time
    document.addEventListener('keydown', onKeyPress);
}

// Function to get a random key from an object
function getRandomKey(obj) {
    const keys = Object.keys(obj);
    return keys[Math.floor(Math.random() * keys.length)];
}

// Function to get a random sequence from the predefined sequences
function getRandomSequence() {
    const seq = sequences[Math.floor(Math.random() * sequences.length)];
    return seq;
}

// Function to handle key press events
function onKeyPress(event) {
    userInput += event.key.toLowerCase(); // Append each key pressed to the user input
    console.log(`User input: ${userInput}`); // Debug statement

    const inputArray = userInput.split(' ').filter(Boolean);
    console.log(`Input array: ${inputArray.join(', ')}`); // Debug statement

    if (inputArray.join('') === currentCombo.join('')) {
        const endTime = new Date(); // Record the end time
        const timeTaken = (endTime - startTime) / 1000; // Time in seconds

        document.getElementById('result').textContent = `Correct! You pressed '${currentCombo.join(', ')}' in ${timeTaken.toFixed(2)} seconds.`;
        document.getElementById('result').classList.remove('incorrect');
        document.getElementById('result').classList.add('correct');
        correctCount++;
        totalTimeSpent += timeTaken; // Add the time taken to total time spent
        practiceCount--;
        userInput = ''; // Reset input for the next round
        setTimeout(practiceRound, 1000); // Wait a moment before the next prompt
    } else if (userInput.length >= currentCombo.join('').length) {
        document.getElementById('result').textContent = `Incorrect! You pressed '${inputArray.join(' ')}'. Expected: '${currentCombo.join(' ')}'`;
        document.getElementById('result').classList.remove('correct');
        document.getElementById('result').classList.add('incorrect');
        incorrectCount++;
        practiceCount--;
        userInput = ''; // Reset input for the next round
        setTimeout(practiceRound, 1000); // Wait a moment before the next prompt
    }
}

// Add event listeners to buttons
document.querySelector('.start-all-actions-button').addEventListener('click', () => startPractice('all'));
document.querySelector('.start-common-sequence-button').addEventListener('click', () => startPractice('sequence'));
document.querySelector('.start-both-button').addEventListener('click', () => startPractice('both'));
document.querySelector('.end-button').addEventListener('click', endPractice);
