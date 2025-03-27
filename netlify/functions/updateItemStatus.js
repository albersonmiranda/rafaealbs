require('dotenv').config(); // Load environment variables
const { MongoClient, ObjectId } = require('mongodb'); // Import MongoDB client with ObjectId

const client = new MongoClient(process.env.MONGODB_URI);

exports.handler = async (event, context) => {
  const { id, status, collection } = JSON.parse(event.body);

  if (!['prendas', 'gifts'].includes(collection)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid collection name' }),
    };
  }

  try {
    await client.connect();
    const database = client.db('Cluster0'); // Replace with your database name
    const targetCollection = database.collection(collection);

    // Use ObjectId when updating by _id
    const result = await targetCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `${collection} status updated`, result }),
    };
  } catch (error) {
    console.error('Error updating item status:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  } finally {
    await client.close();
  }
};
