let shownWords = [];

// Load shown words from JSON file
fetch('shown_words.json')
  .then(response => response.json())
  .then(data => {
    shownWords = data;
  });

function getRandomWord() {
  // Fetch words from XML file
  fetch('words.xml')
    .then(response => response.text())
    .then(xmlString => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      const words = Array.from(xmlDoc.getElementsByTagName("word")).map(word => word.textContent);

      // Filter out shown words
      const availableWords = words.filter(word => !shownWords.includes(word));

      // If all words have been shown, reset shownWords
      if (availableWords.length === 0) {
        shownWords = [];
        availableWords = words;
      }

      // Select a random word
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      const selectedWord = availableWords[randomIndex];

      // Display the word
      document.getElementById("word").textContent = selectedWord;

      // Add the word to shownWords
      shownWords.push(selectedWord);

      // Save shown words to JSON file
      saveShownWords();
    });
}

function copyWord() {
  // Copy the word to clipboard
  const word = document.getElementById("word").textContent;
  navigator.clipboard.writeText(word);
}

function saveShownWords() {
  // Save shownWords array to JSON file
  const jsonString = JSON.stringify(shownWords);
  // In a real-world scenario, you would send this data to a server to update the JSON file.
  // For this example, we'll just log it to the console.
  console.log(jsonString);
}

// Load a random word when the page loads
getRandomWord();