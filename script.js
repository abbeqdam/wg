let shownWords = [];

// Load shown words from JSON file
fetch('shown_words.json')
  .then(response => response.json())
  .then(data => {
    shownWords = data;
  });

  function getRandomWord() {
    // ... (rest of the code remains the same)
  
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