const hiraganaGroups = {
    "Vowels":  ["あ", "い", "う", "え", "お"],  
    "K-Group": ["か", "き", "く", "け", "こ"],  
    "S-Group": ["さ", "し", "す", "せ", "そ"],  
    "T-Group": ["た", "ち", "つ", "て", "と"],  
    "N-Group": ["な", "に", "ぬ", "ね", "の"],  
};

document.addEventListener("DOMContentLoaded", function () {
    let words = [];
    let filteredWords = [];
    let currentIndex = 0;
    let score = 0;

    const scoreDisplay = document.getElementById("score");
    const progressDisplay = document.getElementById("progress-text");

    // Fetch words from API
    fetch("/api/words/")
        .then(response => response.json())
        .then(data => {
            console.log("Fetched data:", data);
            words = Array.isArray(data) ? data : [];
        })
        .catch(error => {
            console.error("Error fetching words:", error);
            document.getElementById("words-container").innerHTML =
                "<p class='text-danger'>Failed to load words.</p>";
        });

    // Apply filters when button is clicked
    document.getElementById("apply-filters").addEventListener("click", function () {
        let selectedFilters = Array.from(document.querySelectorAll(".hiragana-filter:checked"))
            .map(input => input.value);

        console.log("Selected Filters:", selectedFilters);

        if (selectedFilters.length === 0) {
            filteredWords = [...words];  
        } else {
            const allowedCharacters = new Set(
                selectedFilters.flatMap(filter => hiraganaGroups[filter])
            );

            filteredWords = words.filter(word => {
                if (!word.kanji) return false;
                return [...word.kanji].every(char => allowedCharacters.has(char));
            });
        }

        console.log("Filtered Words:", filteredWords);
        currentIndex = 0;
        score = 0;
        updateScore();
        updateProgress();
        showCard();
    });

    // Function to show one card at a time
    function showCard() {
        let container = document.getElementById("words-container");
        container.innerHTML = "";

        if (currentIndex >= filteredWords.length) {
            showCompletionMessage();
            return;
        }

        let word = filteredWords[currentIndex];
        let card = `
        <div class="col-md-6 offset-md-3">
            <div class="card shadow-lg p-3">
                <div class="card-body text-center">
                    <h3 class="kanji">${word.kanji || "No Kanji"}</h3>
                    <div class="reading-container">
                        <span class="reading-icon">🪭</span>
                        <span class="reading">(${word.romaji})</span>
                    </div>
                    <p class="meaning text-muted">${word.english || "No Meaning"}</p>
                    <input type="text" id="user-input" class="form-control mt-2" placeholder="Enter Romaji">
                    <button id="submit-answer" class="btn btn-success mt-2">Check</button>
                    <p id="message" class="mt-2 text-center"></p>
                </div>
            </div>
        </div>`;

        container.innerHTML = card;

        document.getElementById("submit-answer").addEventListener("click", checkAnswer);
    }

    // Function to check the user's answer
    function checkAnswer() {
        let userInput = document.getElementById("user-input").value.trim();
        let messageDisplay = document.getElementById("message");
        let word = filteredWords[currentIndex];

        if (userInput.toLowerCase() === word.romaji.toLowerCase()) {
            messageDisplay.innerHTML = `<span class="text-success">✅ Correct!</span>`;
            score++;
            updateScore();
            currentIndex++;
            updateProgress();
            setTimeout(showCard, 1000); 
        } else {
            messageDisplay.innerHTML = `<span class="text-danger">❌ Try again!</span>`;
        }
    }

    // Function to display the completion message in a styled card
    function showCompletionMessage() {
        let container = document.getElementById("words-container");
        container.innerHTML = ""; 

        let completionCard = `
            <div id="completion-card" class="completion-message">
                You finished all selected words!
            </div>`;

        container.innerHTML = completionCard;
    }

    // Function to update score display
    function updateScore() {
        scoreDisplay.innerHTML = `Score: <strong>${score}</strong>`;
    }

    function updateProgress() {
        progressDisplay.textContent = `${currentIndex} / ${filteredWords.length}`;
    }
});
