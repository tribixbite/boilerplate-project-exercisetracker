const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()

var userIds = [];
var exerciseLogs = {};

app.use(bodyParser.urlencoded({extended: false}));
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user', function(req, res) {
  let newuser = req.body.username;
  let userId = userIds.length;
  exerciseLogs[userId] = [];
  userIds.push(newuser);
  res.json({username: newuser, _id: userId})
  console.log(`${newuser} will be userId: ${userId}`);
});

app.post('/api/exercise/add', function(req, res) {
  let { userId: userId, description: description, duration: duration, date: date} = req.body;
  if (!date) {console.log(`no date`)};
  
  let utcDate = (!date) ? (Number((new Date()))) : (Number(new Date(date)));

  console.log(`${description} will be userId: ${userId} and the date is ${date} and utcdate is ${utcDate}`);
  console.log(new Date(utcDate).toDateString());
  let exerciseRes = {"username": userIds[userId], "description": description, "duration": Number(duration), "_id": Number(userId), "date": (new Date(utcDate).toDateString())};
  let exerciseObj = {"description": description, "duration": Number(duration), "date": (new Date(utcDate).toDateString())};
  exerciseLogs[userId].push(exerciseObj);
  console.log(`exercise log is now ${exerciseLogs[userId][0]['description'].toString()}`)
  res.json(exerciseRes);
});

app.get('/api/exercise/users', (req, res) => {
  let userArray = [];
  for (id in userIds) {userArray.push({username: userIds[id], _id: id})};
  console.log(userArray);
  res.json(userArray);
});

app.get('/api/exercise/log', (req, res) => {
  let userId = req.params.userId;
  console.log(exerciseLogs[userId]);
  let log = [exerciseLogs[userId]];
  res.json({'log': log});
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
