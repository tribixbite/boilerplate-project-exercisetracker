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
  for (id in userIds) {
    userArray.push({username: userIds[id], _id: id})
  };
  console.log(userArray);
  res.json(userArray);

});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
