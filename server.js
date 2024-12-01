// Import necessary modules and functions
import express from 'express';    // Import Express.js framework
import bodyParser from 'body-parser';   // Middleware to parse request bodies
import apiRouter from './routes/router.js';   // Import function to connect to the database
import cors from 'cors'; // Import cors middleware

// Create an instance of Express
const app = express();

// Cors Middleware
app.use(cors());

// Logger Middleware: Logs details of each incoming request
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next(); // Pass control to the next middleware
});

// Configure bodyPaser to parse incoming JSON data
app.use(bodyParser.json());

// Serve files from the 'images' directory
app.use(express.static('images'));

// use your router, any URL that starts with '/api' will be sent to 'apiRouter'
app.use(apiRouter);

// Start the server and listen on port 8080
app.listen(3000, "0.0.0.0", () => console.log('Server listening on port 3000'));
