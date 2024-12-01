import express from 'express';    // Import Express.js framework
import { connectToDatabase } from '../database_connection.js'   // Import function to connect to the database
import { ObjectId } from 'mongodb'; // Import mongodb 

const ALLOWED_IPS = ["127.0.0.1", "123.456.7.89"];
const apiRouter = express.Router();

apiRouter.use(function(req, res, next) {
    var userIsAllowed = ALLOWED_IPS.indexOf(req.ip) !== -1;
    if (!userIsAllowed) {
        res.status(401).send("Not authorized!");
    } else {
        next();
    }
});

// Connect to the MongoDB database
const database = await connectToDatabase();

// GET route to fetch all lessons data
apiRouter.get('/M00908970/lessons', async (req, res) => {
    try {
        const lessons = await database.collection('lessons').find().toArray();
        console.log('Lessons fetched:', lessons);  // Log the lessons data
        res.json(lessons);
      } catch (error) {
        console.error('Error fetching lessons:', error);
        res.status(500).send('Error fetching lessons');
      }
});

// Search Route
apiRouter.get('/M00908970/search', async (req, res) => {
    try {
    const searchQuery = req.query.q || ''; // Get the search query

     // Search for the query in multiple fields using $or
    const results = await database.collection('lessons').find({
        $or: [
        { subject: { $regex: searchQuery, $options: 'i' } },
        { location: { $regex: searchQuery, $options: 'i' } } 
        ]
    }).toArray(); // Convert the cursor to an array

    res.status(200).json(results); // Send results as JSON
    } catch (error) {
    console.error('Error searching lessons:', error);
    res.status(500).send('Internal Server Error');
    }
});

// POST route to post order to database
apiRouter.post('/M00908970/order', async (req, res) => {
    try {
      // Get the order data from the request body
      const order = req.body;
      const result = await database.collection('order').insertOne(order);
  
      // Respond with the saved order
      res.status(200).json({
        message: 'Order submitted successfully!',
        orderId: result.insertedId,
        order: order // Return the saved order
      });
      console.log('Order Summary:', order);
    } catch (error) {
      console.error('Error submitting order:', error);
      res.status(500).send('Error submitting order');
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

    console.log('lessons updated:', result);

    if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Lesson not found' });
    }

    res.status(200).json({ message: 'Lesson updated successfully' });
    } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ message: 'Error updating lesson' });
    }
});

// Export api function for use in other modules
export default apiRouter;
