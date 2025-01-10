const Airtable = require('airtable');
const { airtableApiKey, airtableBaseId, airtableTableName } = process.env;

const base = new Airtable({ apiKey: 'patmGUjaUdf343YVc.01a9ffb5e8d0af2b6508fefb3d7e4de2760c66c0ba9e03ab1f4cd6049e514c92' }).base('appGG9f9swWusolTE');

exports.handler = async function (event, context) {
  try {
    const { shownWords } = JSON.parse(event.body);

    // Update the shown words in Airtable
    const records = await base(airtableTableName).select({
      view: 'Grid view',
    }).all();

    // Extract the existing words from the records
    const existingWords = records.map(record => record.get('word'));

    // Combine existing words with new shown words, removing duplicates
    const allWords = Array.from(new Set([...existingWords, ...shownWords]));

    // Update the record in Airtable with the combined words
    await base(airtableTableName).update(records[0].id, {
      word: allWords,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Shown words saved to Airtable' }),
    };
  } catch (error) {
    console.error('Error in function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save shown words' }),
    };
  }
};