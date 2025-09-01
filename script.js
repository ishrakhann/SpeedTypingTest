class TypingTest {
    constructor() {
        this.sampleTexts = [
            "The quick brown fox jumps over the lazy dog. Programming is the process of creating a set of instructions that tell a computer how to perform a task.",
            "Software development is the process of conceiving, specifying, designing, programming, documenting, testing, and bug fixing involved in creating and maintaining applications.",
            "Clean code is code that is easy to understand and easy to change. It reads like well-written prose and makes the programmer's intent clear to other developers.",
            "TypeScript is a strongly typed programming language that builds on JavaScript giving you better tooling at any scale. It helps catch errors early.",
            "React is a JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called components."
        ];
        this.currentText = '';
        this.words = [];
        this.currentWordIndex = 0;
        this.startTime = null;
        this.timer = null;
        this.timeLimit = 60;
        this.timeLeft = this.timeLimit;
        this.correctChars = 0;
        this.totalChars = 0;
        this.errors = 0;
        this.isRunning = false;

        this.initializeElements();
        this.bindEvents();
        this.loadNewText();
    }

    initializeElements() {
        this.textDisplay = document.getElementById('text-display');
        this.typingInput = document.getElementById('typing-input');
        this.restartBtn = document.getElementById('restart-btn');
        this.wpmDisplay = document.getElementById('wpm');
        this.accuracyDisplay = document.getElementById('accuracy');
        this.timerDisplay = document.getElementById('timer');
        this.resultsPanel = document.getElementById('results-panel');
        this.finalWpm = document.getElementById('final-wpm');
        this.finalAccuracy = document.getElementById('final-accuracy');
        this.finalTime = document.getElementById('final-time');
        this.finalErrors = document.getElementById('final-errors');
        this.newTestBtn = document.getElementById('new-test-btn');
    }

    bindEvents() {
        this.typingInput.addEventListener('input', (e) => this.handleInput(e));
        this.restartBtn.addEventListener('click', () => this.restartTest());
        this.newTestBtn.addEventListener('click', () => this.restartTest());
        
        // Prevent spacebar from scrolling
        this.typingInput.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
            }
        });
    }

    loadNewText() {
        const randomIndex = Math.floor(Math.random() * this.sampleTexts.length);
        this.currentText = this.sampleTexts[randomIndex];
        this.words = this.currentText.split(' ');
        this.renderText();
    }

    renderText() {
        let html = '';
        this.words.forEach((word, index) => {
            let wordClass = '';
            if (index < this.currentWordIndex) {
                wordClass = 'correct';
            } else if (index === this.currentWordIndex) {
                wordClass = 'current-word';
            }
            html += `<span class="${wordClass}">${word}</span> `;
        });
        this.textDisplay.innerHTML = html;
    }

    startTest() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = Date.now();
            this.startTimer();
            this.typingInput.focus();
        }
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.timerDisplay.textContent = `${this.timeLeft}s`;
            
            // Update progress rings
            this.updateProgressRings();
            
            if (this.timeLeft <= 0) {
                this.endTest();
            }
        }, 1000);
    }

    updateProgressRings() {
        const wpmProgress = document.querySelector('#wpm ~ .progress-ring');
        const accuracyProgress = document.querySelector('#accuracy ~ .progress-ring');
        
        if (wpmProgress) {
            const wpmValue = parseInt(this.wpmDisplay.textContent);
            const wpmOffset = 100 - Math.min(wpmValue / 100 * 100, 100);
            wpmProgress.style.strokeDashoffset = wpmOffset;
        }
        
        if (accuracyProgress) {
            const accuracyValue = parseInt(this.accuracyDisplay.textContent);
            const accuracyOffset = 100 - accuracyValue;
            accuracyProgress.style.strokeDashoffset = accuracyOffset;
        }
    }

    handleInput(e) {
        if (!this.isRunning) {
            this.startTest();
        }

        const input = this.typingInput.value;
        const currentWord = this.words[this.currentWordIndex];
        
        // Check if space was pressed (word completed)
        if (input.endsWith(' ')) {
            if (input.trim() === currentWord) {
                this.correctChars += currentWord.length;
            } else {
                this.errors++;
            }
            this.totalChars += currentWord.length;
            
            this.typingInput.value = '';
            this.currentWordIndex++;
            
            if (this.currentWordIndex >= this.words.length) {
                this.loadNewText();
                this.currentWordIndex = 0;
            }
            
            this.renderText();
            this.updateStats();
        }
    }

    updateStats() {
        const elapsedTime = (Date.now() - this.startTime) / 1000 / 60; // in minutes
        const wpm = Math.round((this.correctChars / 5) / elapsedTime);
        const accuracy = this.totalChars > 0 
            ? Math.round((this.correctChars / this.totalChars) * 100)
            : 100;
        
        this.wpmDisplay.textContent = isNaN(wpm) ? '0' : wpm;
        this.accuracyDisplay.textContent = `${accuracy}%`;
        this.updateProgressRings();
    }

    endTest() {
        clearInterval(this.timer);
        this.isRunning = false;
        
        this.finalWpm.textContent = this.wpmDisplay.textContent;
        this.finalAccuracy.textContent = this.accuracyDisplay.textContent;
        this.finalTime.textContent = `${this.timeLimit - this.timeLeft}s`;
        this.finalErrors.textContent = this.errors;
        
        this.resultsPanel.classList.remove('hidden');
        this.typingInput.disabled = true;
    }

    restartTest() {
        clearInterval(this.timer);
        this.isRunning = false;
        this.currentWordIndex = 0;
        this.timeLeft = this.timeLimit;
        this.correctChars = 0;
        this.totalChars = 0;
        this.errors = 0;
        
        this.wpmDisplay.textContent = '0';
        this.accuracyDisplay.textContent = '100%';
        this.timerDisplay.textContent = '60s';
        
        this.typingInput.value = '';
        this.typingInput.disabled = false;
        
        this.resultsPanel.classList.add('hidden');
        
        this.loadNewText();
        this.updateProgressRings();
    }
}

// Initialize the typing test when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TypingTest();
});