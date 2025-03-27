require('dotenv').config(); // Load environment variables
const { MongoClient, ObjectId } = require('mongodb'); // Import MongoDB client

const client = new MongoClient(process.env.MONGODB_URI);

exports.handler = async (event, context) => {
  try {
    await client.connect();
    const database = client.db('Cluster0'); // Replace with your database name
    const giftsCollection = database.collection('gifts');

    const documents = await giftsCollection.find({}).toArray();
    
    // Convert MongoDB _id to string id for frontend compatibility
    const formattedDocuments = documents.map(doc => ({
      ...doc,
      id: doc._id.toString() // Add string id field for frontend
    }));

    console.log('Query result:', formattedDocuments);

    return {
      statusCode: 200,
      body: JSON.stringify(formattedDocuments),
    };
  } catch (error) {
    console.error('Error fetching gifts:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  } finally {
    await client.close();
  }
};
