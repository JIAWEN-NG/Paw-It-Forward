const express = require('express');
const cors = require('cors');

//server settings
const PORT = 8000;
const app = express();

app.use(express.json()); // Tells our server to read and understand JSON objects
app.use(cors()); // Tells the server to allow communication across origins


// Health check endpoint
app.get("/", (req, res) => {
    return res.status(200).json({
      message: "Server is up and running!",
    });
  });

// Starts the actual server
app.listen(PORT, () => {
    console.log(`[SYSTEM] Server started on port ${PORT}...`);
  });
  