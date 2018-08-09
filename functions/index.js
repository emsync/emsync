const functions = require('firebase-functions');
const express = require('express');

/* Express */
const app1 = express();
app1.get('*', (request, response) => {
  console.log('Hit this route');
  response.send('Hello from Express on Firebase!');
});

const api1 = functions.https.onRequest(app1);

exports.helloWorld = api1;
