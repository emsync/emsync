const functions = require('firebase-functions');
const express = require('express');

/* Express */
const app1 = express();
app1.get('/home', (request, response) => {
  console.log('Hit this route');
  response.send('Home!!!!');
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
