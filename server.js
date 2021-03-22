const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()

var userIds = [];
var exerciseLogs = {};
process.env.TZ = 'UTC';

app.use(bodyParser.urlencoded({extended: false}));
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user', function(req, res) {
  console.log(`new user request: ${JSON.stringify(req.body)}`);
  
  let newuser = req.body.username;
  let userId = userIds.length;
  exerciseLogs[userId] = [];
  userIds.push(newuser);
  res.json({username: newuser, _id: userId})
  console.log(`${newuser} will be userId: ${userId}`);
});

app.post('/api/exercise/add', function(req, res) {
  console.log(`add request: ${JSON.stringify(req.body)}`);
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
  let { userId: userId, from: fromDate, to: toDate, limit: limit} = req.query;
  console.log(`log request: ${JSON.stringify(req.query)}`);
  let log = exerciseLogs[userId];
  console.log(log);
  if (log == undefined) {
    console.log("no log entries")
    return res.send("no log entries for that user")
    };
  let limitCheck = (!limit) ? (1000) : parseInt(limit);
  let utcToDate = (!toDate) ? (Number((new Date()))) : (Number(new Date(toDate)));
  
  console.log(fromDate + " is fromdate and todate is " + toDate);
  if (fromDate) {
    var utcFromDate = (Number(new Date(fromDate)));

    let dateLog = [];
    let x = 1;
    for (logEntry in log) {
      console.log(JSON.stringify(logEntry));
      console.log(JSON.stringify(log));
      console.log(log[logEntry].date.toString());
      let utcLogDate = Number(new Date(log[logEntry].date));
      console.log(`this log date is ${utcLogDate}`)
      if (utcFromDate <= utcLogDate <= utcToDate || logEntry +1 <= limitCheck){
        console.log("date in parameters");
        dateLog.push(log[logEntry]);
      }
    x++;
    console.log(`old log: ${log.length} and new log: ${dateLog.length}`)
    }
    log = dateLog;
  };

  console.log(`${limit} was limit now: ${limitCheck} is limit and ${utcToDate} is todate`);
  console.log(exerciseLogs[userId]);
  console.log("new filtered log:");
  log = log.slice(0, limit);
  console.log(log);
  console.log(log.length);

  res.json({'log': log, 'count': log.length});
});




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
