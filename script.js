let shownWords = [];

// Load shown words from JSONbin.io
fetch(`https://api.jsonbin.io/v3/b/678134ccacd3cb34a8c984d4/latest`, { // Your new bin ID
  headers: {
    'X-Master-Key': API_KEY, // Your API key (from Netlify environment variables)
  },
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`JSONbin.io request failed with status ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    shownWords = data.record.words || [];
  })
  .catch(error => {
    console.error('Error loading shown words:', error);
  });

function showWord() {
  // Fetch words from XML file
  fetch('words.xml')
    .then(response => response.text())
    .then(xmlString => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      const words = Array.from(xmlDoc.getElementsByTagName("word")).map(word => word.textContent);

      // Filter out shown words
      const availableWords = words.filter(word => !shownWords.includes(word));

      // If all words have been shown, display "No more words"
      if (availableWords.length === 0) {
        document.getElementById("word").textContent = "No more words!";
        return; // Exit the function
      }

      // Select a random word
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      const selectedWord = availableWords[randomIndex];

      // Display the word
      document.getElementById("word").textContent = selectedWord;

      // Set the password text content
      const passwordElement = document.querySelector('.password');
      passwordElement.textContent = "12345678";

      // Add the word to shownWords
      shownWords.push(selectedWord);

      // Save shown words by sending a request to the Netlify function
      fetch('/.netlify/functions/save-words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shownWords }),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Shown words saved:', data);
      })
      .catch(error => {
        console.error('Error saving shown words:', error);
      });
    });

  // Hide the "Generate Credentials" button
  document.getElementById('show-word-button').style.display = 'none';

  // Show the word container
  document.getElementById('word-container').style.display = 'block';
}

function copyUsername() {
  // Copy the username to clipboard
  const username = document.getElementById("word").textContent;
  navigator.clipboard.writeText(username);
}

function copyPassword() {
  // Copy the password to clipboard
  navigator.clipboard.writeText("12345678"); 
}

// Add an event listener to the button
document.getElementById('show-word-button').addEventListener('click', showWord);