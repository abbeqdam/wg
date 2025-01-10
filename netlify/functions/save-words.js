const fs = require('fs');

const API_KEY = '$2a$10$w4f4jzXPp/NZPHWxhAv9z.3hKj1vP1IUAwDODZK0./hdMGNV.ybwe'; // Your JSONbin.io API key
const BIN_ID = '678134ccacd3cb34a8c984d4'; // Your bin ID

exports.handler = async function (event, context) {
  try {
    const { shownWords } = JSON.parse(event.body);

    // Update the shown_words.json file in JSONbin.io
    const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY,
      },
      body: JSON.stringify({ words: shownWords }),
    });

    if (!response.ok) {
      throw new Error(`JSONbin.io request failed with status ${response.status}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Shown words saved to JSONbin.io',
        data: data,
      }),
    };
  } catch (error) {
    console.error('Error in function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save shown words' }),
    };
  }
};