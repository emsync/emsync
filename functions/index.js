const path = require('path');
const functions = require('firebase-functions');
const express = require('express');

/* Express */
const app1 = express();

// app1.use('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'public/index.html'));
// });

// app1.get('*', (req, res, next) => {
//   console.log('hitting catch all route');
//   // res.send('hitting catch all route');
//   next();
// });

app1.get('/home', (request, response) => {
  console.log('Hit this route');
  response.send('Home2!!!!');
});

app1.get('/users', (request, response) => {
  console.log('Hit this route');
  response.send('Users!!!!');
});

app1.get('/songs', (request, response) => {
  console.log('Hit this route');
  response.send('Songs!!!!!!');
});

exports.api = functions.https.onRequest(app1);
