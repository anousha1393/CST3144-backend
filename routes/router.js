import express from 'express';    // Import Express.js framework
import { connectToDatabase } from '../database_connection.js'   // Import function to connect to the database
import { ObjectId } from 'mongodb'; // Import ObjectId from mongodb 

// Define allowed IP addresses for accessing the API
const ALLOWED_IPS = ["127.0.0.1", "123.456.7.89"];
// Create a new Express router instance
const apiRouter = express.Router();

// Middleware to restrict access to the API based on IP addresses
apiRouter.use(function(req, res, next) {
    var userIsAllowed = ALLOWED_IPS.indexOf(req.ip) !== -1; // Check if the request IP is in the allowed list
    if (!userIsAllowed) {
        res.status(401).send("Not authorized!"); // Deny access if IP is not allowed
    } else {
        // Allow access if IP is in the allowed list
        next();
    }
});

// Connect to the MongoDB database
const database = await connectToDatabase();

// GET route to fetch all lessons data
apiRouter.get('/M00908970/lessons', async (req, res) => {
    try {
        // Fetch all lessons from the database
        const lessons = await database.collection('lessons').find().toArray();
        // Log the fetched lessons for debugging
        console.log('Lessons fetched:', lessons);      // Log the lessons data
        res.json(lessons);     // Respond with the lessons in JSON format
      } catch (error) {
        console.error('Error fetching lessons:', error);  // Log errors if fetching fails
        res.status(500).send('Error fetching lessons');   // Respond with an error message
      }
});

// Search Route
apiRouter.get('/M00908970/search', async (req, res) => {
    try {
    const searchQuery = req.query.q || ''; // Get the search query

    // Perform a case-insensitive search in the 'subject' and 'location' fields
    const results = await database.collection('lessons').find({
        $or: [
        { subject: { $regex: searchQuery, $options: 'i' } },
        { location: { $regex: searchQuery, $options: 'i' } } 
        ]
    }).toArray(); // Convert the cursor to an array

    res.status(200).json(results); // Send results as JSON
    } catch (error) {
    console.error('Error searching lessons:', error);        // Log errors if search fails
    res.status(500).send('Internal Server Error');        // Respond with an error message
    }
});

// POST route to post order to database
apiRouter.post('/M00908970/order', async (req, res) => {
    try {
      // Get the order data from the request body
      const order = req.body;
      // Insert the order into the database
      const result = await database.collection('order').insertOne(order);
  
      // Respond with the saved order
      res.status(200).json({
        message: 'Order submitted successfully!',    // Success message
        orderId: result.insertedId,                 // Include the generated order ID
        order: order                           // Return the saved order
      });
      console.log('Order Summary:', order);        // Log the order details for debugging
    } catch (error) {
      console.error('Error submitting order:', error);         // Log errors if submission fails
      res.status(500).send('Error submitting order');         // Respond with an error message
    }
});

// PUT route to update lesson data
apiRouter.put('/M00908970/lessons/:id', async (req, res) => {
    const { id } = req.params; // Extract lesson ID from the URL parameter
    const { spaces } = req.body; // Extract spaces value from the request body

    try {
    // Update the lesson's available spaces in the database
    const result = await database.collection('lessons').updateOne(
        { _id: new ObjectId(id) }, // Find the lesson by ID
        { $set: { spaces: spaces } } // Set the new spaces value
    );
    // Log the update result for debugging
    console.log('lessons updated:', result);

    if (result.matchedCount === 0) {
        // Respond if the lesson ID is not found
        return res.status(404).json({ message: 'Lesson not found' });
    }
    // Respond with a success message
    res.status(200).json({ message: 'Lesson updated successfully' });
    } catch (error) {
    console.error('Error updating lesson:', error);        // Log errors if update fails
    res.status(500).json({ message: 'Error updating lesson' });        // Respond with an error message
    }
});

// Export api function for use in other modules
export default apiRouter;
