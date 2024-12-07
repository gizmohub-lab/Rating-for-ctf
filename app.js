const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Rating = require('./models/Rating');
require('dotenv').config(); // Load environment variables

// Initialize app
const app = express();
app.set('view engine', 'ejs');

// Ensure views directory is correctly set
app.set('views', __dirname + '/views');
// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || '';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.use(express.static(__dirname));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home route (user rating page)
app.get('/', (req, res) => {
  res.render('index');
});

// Admin panel route (display ratings)
app.get('/admin', async (req, res) => {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 });
    res.render('admin', { ratings });
  } catch (err) {
    res.status(500).send('Error fetching ratings');
  }
});

// Submit rating
app.post('/submit-rating', async (req, res) => {
  const { stars, description } = req.body;
  
  try {
    const newRating = new Rating({
      stars: parseInt(stars),
      description
    });
    await newRating.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error saving rating');
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
