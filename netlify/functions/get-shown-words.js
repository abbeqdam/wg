const Airtable = require('airtable');

// Replace with your actual Airtable API key, base ID, and table name
const airtableApiKey = 'patmGUjaUdf343YVc.01a9ffb5e8d0af2b6508fefb3d7e4de2760c66c0ba9e03ab1f4cd6049e514c92';
const airtableBaseId = 'appGG9f9swWusolTE';
const airtableTableName = process.env.AIRTABLE_TABLE_NAME; // Assuming you have this environment variable set

const base = new Airtable({ apiKey: airtableApiKey }).base(airtableBaseId);

exports.handler = async function (event, context) {
  try {
    // Fetch the shown words from Airtable
    const records = await base(airtableTableName).select({
      view: 'Grid view', // Replace with your actual view name if different
    }).all();

    return {
      statusCode: 200,
      body: JSON.stringify({ records }),
    };
  } catch (error) {
    console.error('Error in function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch shown words' }),
    };
  }
};