const fs = require('fs');

exports.handler = async function(event, context) {
  try {
    const { shownWords } = JSON.parse(event.body);

    // Update the shown_words.json file
    const data = JSON.stringify(shownWords);
    fs.writeFileSync('shown_words.json', data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Shown words saved successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save shown words' }),
    };
  }
};