const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()

var userIds = [];

app.use(bodyParser.urlencoded({extended: false}));
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user', function(req, res) {
  let newuser = req.body.username;
  let userid = userIds.length;
  userIds.push(newuser);
  res.json({username: newuser, _id: userid})
  console.log(`${newuser} will be userId: ${userid}`);
});

app.get('/api/exercise/users', (req, res) => {
  let userArray = [];
  for (id in userIds) {userArray.push({username: userIds[id], _id: id})};
  console.log(userArray);
  res.json(userArray);
});

app.post('/api/exercise/add', function(req, res) {
  let { userId: userId, description: description, duration: duration, date: date} = req.body;
  if (!date) {console.log(`no date`)};

  
  
  let utcDate = (!date) ? (Number((new Date()))) : (Number(new Date(date)));

  /*let userId = req.body.userId;
  let description = req.body.description;
  let duration = req.body.duration;*/
  //userIds.push(newuser);
  //res.json({username: newuser, _id: userid})
  console.log(`${description} will be userId: ${userId} and the date is ${date} and utcdate is ${utcDate}`);
  console.log(new Date(utcDate).toDateString());
  let expected = {"username": userIds[userId], "description": description, "duration": duration, "_id": userId, "date": (new Date(utcDate).toDateString())};
  console.log(expected);
  res.json({"username": userIds[userId], "description": description, "duration": Number(duration), "_id": Number(userId), "date": (new Date(utcDate).toDateString())});
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
