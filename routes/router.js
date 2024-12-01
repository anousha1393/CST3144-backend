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

// Export api function for use in other modules
export default apiRouter;
