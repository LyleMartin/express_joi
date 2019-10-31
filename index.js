const Joi = require('joi');
const express = require('express');

const app = express();

app.use(express.json({
  inflate: true,
  limit: '100kb',
  reviver: null,
  strict: true,
  type: 'application/json',
  verify: undefined
  }
));

// setup arrays for lists of users, events
const users = [];
const events = [];

app.post('/test', (req, res) => {
  res.json('Server is responding.');
})


app.get('/api/users', (req, res) => {
  res.json(users);
})


app.post('/api/events', (req, res) => {
  const schema = {
    show: Joi.string().min(1).required(),
    email: Joi.string().email()
  }

  const result = Joi.validate(req.body, schema);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  var info_req = req.body.show.toUpperCase();

  if (info_req == 'ALL') {
    res.json(events);
    return;
  }
  if (info_req == 'LAST') {
    var userEvents= events.filter(function (e) {
        return e.created.includes(get_yearMonthDate());
    });
    res.json(events);
    return;
  }
  if (info_req == 'ONE') {
    if ((req.body.email != undefined) && (req.body.email.length > 0)){
      var userEvents= events.filter(function (e) {
          return e.email.toUpperCase() == req.body.email.toUpperCase();
      });
      res.json(userEvents);
    }
    else {
      res.json('An email must be included for a ONE request.');
    }
  }
  // just in case not handled
  res.json('The request was not formed properly.')
})


app.post('/api/user', (req, res) => {
  const schema = {
    email: Joi.string().email().required(),
    password: Joi.string().min(10).required(),
    phone: Joi.string().regex(/^\d{3}-\d{3}-\d{4}$/)
  }
  const result = Joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const user = {
      id: users.length + 1,
      email: req.body.email,
      password: req.body.pwd,
      phone: req.body.phone
  }
  var usersList= users.filter(function (e) {
      return e.email.toUpperCase() == req.body.email.toUpperCase();
  });
  // if new name add it
  if (usersList.length == 0) {
    users.push(user);
    res.json(user);
  }
  else {
    res.send(`User already exists.`)
  }
})


app.post('/api/event', (req, res) => {
  const schema = {
      email: Joi.string().email().required(),
      event: Joi.string().min(5).required()
  }
  const result = Joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const event = {
      id: events.length + 1,
      email: req.body.email,
      event: req.body.event,
      created: get_dateTime()
  }
  events.push(event);
  res.send(event);
})

// date-time function
function get_yearMonthDate() {
  var date_ob = new Date();
  // current date
  // adjust 0 before single digit date
  var date = ("0" + date_ob.getDate()).slice(-2);
  // current month
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  // current year
  var year = date_ob.getFullYear();
  var cur_date = year + "-" + month + "-" + date;
  return cur_date
}

function get_dateTime() {
  var date_ob = new Date();
  // current date
  // adjust 0 before single digit date
  var date = ("0" + date_ob.getDate()).slice(-2);
  // current month
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  // current year
  var year = date_ob.getFullYear();
  // current hours
  var hours = date_ob.getHours();
  // current minutes
  var minutes = date_ob.getMinutes();
  // current seconds
  var seconds = date_ob.getSeconds();
  // prints date in YYYY-MM-DD format
  //console.log(year + "-" + month + "-" + date);

  // date & time in YYYY-MM-DD HH:MM:SS format
  var cur_date_time = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
  return cur_date_time;
}

// start the server running on env port or 3000
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
