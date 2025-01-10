// Function to fetch a random word from the XML file
function getRandomWord() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "words.xml", true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const xmlDoc = xhr.responseXML;
          const words = xmlDoc.getElementsByTagName("word");
          const randomIndex = Math.floor(Math.random() * words.length);
          resolve(words[randomIndex].textContent);
        }
      };
      xhr.onerror = reject;
      xhr.send();
    });
  }
  
  // Function to fetch shown words from the JSON file on GitHub
  function getShownWords() {
    return fetch('https://raw.githubusercontent.com/abbeqdam/wg/main/shown-words.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch(error => {
        console.error("Error fetching shown words:", error);
        // Handle the error (e.g., return an empty array)
        return []; 
      });
  }
  
  // Function to check if a word has been shown before
  function isWordShown(word, shownWords) {
    return shownWords.includes(word);
  }
  
  // Function to add a word to the shown words list and update the JSON file
  function markWordAsShown(word) {
    return getShownWords()
      .then(shownWords => {
        shownWords.push(word);
        return fetch('https://api.github.com/repos/abbeqdam/wg/contents/shown-words.json', {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: 'Update shown words',
            content: btoa(JSON.stringify(shownWords)),
            sha: 'YOUR_FILE_SHA' // Get the SHA of the file from GitHub
          })
        });
      })
      .catch(error => {
        console.error("Error updating shown words:", error);
      });
  }
  
  // Get a random word from the XML file
  getRandomWord()
    .then(word => {
      // Fetch shown words from GitHub
      return getShownWords().then(shownWords => {
        // Keep getting a new word until an unused one is found
        while (isWordShown(word, shownWords)) {
          word = getRandomWord(); // You might want to add a check to avoid infinite loops if all words are shown
        }
        return word;
      });
    })
    .then(word => {
      // Display the word on the page
      document.getElementById("word").textContent = word;
  
      // Copy word to clipboard when button is clicked
      document.getElementById("copy-button").addEventListener("click", () => {
        navigator.clipboard.writeText(word)
          .then(() => {
            // Optional: Display a success message
          })
          .catch(err => {
            console.error("Failed to copy: ", err);
          });
      });
  
      // Mark the word as shown
      return markWordAsShown(word);
    })
    .catch(error => {
      console.error("Error fetching word:", error);
      // Handle the error (e.g., display an error message)
    });