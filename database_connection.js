// Import necessary modules from MongoDB client
import { MongoClient, ServerApiVersion } from 'mongodb';   // Import MongoClient and ServerApiVersion from MongoDB

// Connection details
const password = "T2q7yTUuMR6KRobp"; // Password for database access
const userName = "Anousha"; // Username for database access
const server = "cluster0.g3elw1x.mongodb.net"; // MongoDB server address
const databaseName = "Learn_Lounge"; // Name of the database

// Encode special characters in username and password
const encodedUsername = encodeURIComponent(userName);
const encodedPassword = encodeURIComponent(password);

// Create connection URI with encoded username and password
const connectionURI = `mongodb+srv://${encodedUsername}:${encodedPassword}@${server}/?retryWrites=true&w=majority`;

// Define an asynchronous function to connect to the MongoDB database
async function connectToDatabase() {
  try {
    // Create a new MongoDB client with the connection URI and server API options
    const client = new MongoClient(connectionURI, {
      serverApi: {
        version: ServerApiVersion.v1, // Specify the MongoDB Server API version
        strict: false, // Disable strict mode for API validation
        deprecationErrors: true, // Enable deprecation errors
      }
    });

    // Connect to the MongoDB database
    await client.connect();
    console.log('Successfully connected to MongoDB database');
    
    // Return the connected database object
    return client.db(databaseName);
  } catch (error) {
    // Log and re-throw any errors that occur during database connection
    console.error('Error connecting to MongoDB database:', error);
    throw error;
  }
}

// Export the connectToDatabase function for use in other modules
export { connectToDatabase };
