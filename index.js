const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')
const User = require('./models/user')
const Exercise = require('./models/exercise')
const Log = require('./models/log')

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const PORT = process.env.PORT || 3000
app.post('/api/users', (req, res) => {
  const username = req.body.username
  const newUser = new User({ username: username })
  newUser.save().then(() => {

    res.json({ username: newUser.username, _id: newUser._id })
  })
})

app.get('/api/users', (req, res) => {
  User.find().then((users) => {
    res.json([...users])
  })
})

app.post('/api/users/:_Id/exercises', async (req, res) => {
  try {
    // Extract user ID from request parameters
    const userId = req.params._Id;

    // Extract exercise details from request body
    const { description, duration, date } = req.body;

    // Create a new exercise object
    const newExercise = new Exercise({
      username: userId,
      description: description,
      duration: duration,
      date: date || new Date() // Use current date if not provided
    });

    // Save the new exercise to the database
    const savedExercise = await newExercise.save();

    // Update the user's profile with the new exercise
    const user = await User.findById(userId);

    res.json({
      _id: user._id,
      username: user.username,
      description: savedExercise.description,
      duration: savedExercise.duration,
      date: savedExercise.date.toDateString(),

    });

  } catch (error) {
    // Handle errors
    console.error('Error adding exercise:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/*app.get('/api/users/:_Id/logs', async (req, res) => {
  try {
    // Extract user ID from request parameters
    const userId = req.params._Id;

    // Find the user in the database
    const user = await User.findById(userId);
    const exercises = await Exercise.find({ username: userId });

    res.json({
      _id: user._id,
      username: user.username,
      count: exercises.length,
      log: exercises.map(exercise => ({
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString()
      }))
    });


  } catch (error) {
    // Handle errors
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});*/

app.get('/api/users/:_Id/logs', async (req, res) => {
  try {
    // Extract user ID and query parameters from request
    const userId = req.params._Id;
    const { from, to, limit } = req.query;

    // Construct query object based on provided parameters
    const query = { username: userId };
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    // Find the user in the database
    const user = await User.findById(userId);
    let exercises = await Exercise.find(query).limit(parseInt(limit) || 0);

    // Convert the date property to a string using the toDateString() method
    exercises = exercises.map(exercise => ({
      date: exercise.date.toDateString(),
      duration: exercise.duration,
      description: exercise.description,


    }));

    res.json({
      _id: user._id,
      username: user.username,
      count: exercises.length,
      log: exercises
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



/*const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
*/
mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    /*User.insertMany(users);
    Post.insertMany(posts);*/
  })
}).catch((err) => {
  return console.log(`${err} did not connect`)
})