const path = require('path');
const functions = require('firebase-functions');
const express = require('express');
const request = require('request');
// const { db } = require('../src/firebase');
const usersCollection = functions.database.ref('/users');
// const roomCollection = functions.database.collection('rooms');

/* Express */
const app = express();

app.get('/home', (request, response) => {
  console.log('Hit this route');
  response.send('Home2!!!!');
});


//GET track/artist/album through search

/* "https://api.spotify.com/v1/search?q=Muse&type=track%2Cartist&market=US&limit=10&offset=5" 
-H "Accept: application/json" 
-H "Content-Type: application/json" 
-H "Authorization: Bearer TOKEN GOES HERE*/

// search params should come as query obj
app.get(
  '/song', (req, res, next) => {
    console.log('getting item from Spotify');

    // testing data. DELETE 
    //  const testingData = {
    //    q:'Muse',
    //    type:'track%2Cartist',
    //    market:'US',
    //    limit:'10',
    //    offset:'5',
    //  }
    //  const testingToken = 'BQAOHmYLSecP25atvxov82QXzM2vE3pIhUtzo7C5soNq2I631sjlC9idQyMHo0QyGqFOVlOeP7cH7aQnFJNXqCfaKcU4BqVYQ1VVTdjmanuIvEnu3I-iX6gVo2q6dmWg1f8wbWbPM-wMGyMB';

    //  const options = {
    //    url: `https://api.spotify.com/v1/search?q=${testingData.q}&type=${testingData.type}&market=${testingData.market}&limit=${testingData.limit}&offset=${testingData.offset}`,
    //    headers: { 'Authorization': `Bearer ${testingToken}` }
    //   };

    return usersCollection.doc('funkyRoom').get().then(user => {

      const userRefreshToken = user.data().refresh_token;


      const options = {
        url: `https://api.spotify.com/v1/search?q=${req.query.q}&type=${req.query.type}&market=${req.query.market}&limit=${req.query.limit}&offset=${req.query.offset}`,
        headers: { Authorization: `Bearer ${userRefreshToken}` }
      };

      return options

    }).then((options) => {

      return request(options, (error, response, body) => {
        console.log('options', options)

        if (!error && response.statusCode === 200) {
          console.log('song', body);
          res.send(JSON.parse(body));
        } else {
          console.log(body)
          res.send('No song found');
        }
      });
    })
  });


exports.createRoom = functions.firestore
  .document("rooms/{roomId}")
  .onCreate((snap, context) => {
    const name = snap.data().name;
    const slug = slugify(name, {
      remove: null,
      lower: true
    });
    db.collection("rooms")
      .doc(snap.id)
      .update({
        slug
      });
  })


exports.api = functions.https.onRequest(app);
