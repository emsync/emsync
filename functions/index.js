const path = require('path');
const functions = require('firebase-functions');
const express = require('express');
const asyncHandler = require('express-async-handler')
const request =  require('request');
const { db } = require('../src/firebase');
const usersCollection = db.collection('users');
const roomCollection = db.collection('rooms');

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

const app = express();


//GET all users
app.get('/users', asyncHandler(async (req, res, next) => {
  console.log('getting users')
  const users = [];
  const data = await usersCollection.get();
  data.forEach(doc => users.push(doc.data()));
  if(data === undefined){
    res.send('No data found')
  }else{
    res.send(users)
  }
  }));


//GET user by name
app.get('/user', asyncHandler(async (req, res, next) => {
  console.log('getting user')
  // get user by name
  const user = await usersCollection.doc(req.query.name).get();
  if (user === undefined) {
    res.send('No data found')
  } else {
    res.send(user.data())
  }
}));


//GET Album by ID

// "https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj?market=US" - H "Authorization: Bearer BQD42fP09rP2t4LeRD9WYT9AgEZdCsyv7zHCptRTtXluC3uJQQ8acpy1tvJo3WxHKmHqcF6k4_eyC-t9ItD1z8d-AxPuviNeFwj2AQmesj2PbKDxn1XmDLf9fTagMyP7_1JLb_d-7HPs8aVb"


app.get('/album/', asyncHandler(async(req,res,next) => {
  console.log('getting album by title');
  //get user by name
  const user = await usersCollection.doc('user1').get();
  const userRefreshToken = user.data().refresh_token;
  const albumId = req.query.albumId;

  const options = { url: `https://api.spotify.com/v1/albums/${albumId}?market=US`, 
  headers: { Authorization: `Bearer ${userRefreshToken}` } };


  const album = await request(options, (error,response,body) => {
    if(!error && response.statusCode == 200){
      console.log('album', body)
      res.send(JSON.parse(body))
    }else{
      res.send('NO album found')
    }
  } )
}));



//GET track/artist/album through search

/* "https://api.spotify.com/v1/search?q=Muse&type=track%2Cartist&market=US&limit=10&offset=5" 
-H "Accept: application/json" 
-H "Content-Type: application/json" 
-H "Authorization: Bearer BQB_8qnpMYLkG6h6lGkBBH2M_ITJ0Gu_OSFxyTcnbdYoSqHEcbCuhhDGTUoIIBj8DY2oVsuk6jbmj0THdf1dj3FdOzbhEL3nriAmbK3Ob_M8lV7FInWIdC4F4xGmpINvmFMkCb7H5E9gZFW6"*/

// search params should come as query obj
app.get(
  '/song',
  asyncHandler(async (req, res, next) => {
    console.log('getting item from Spotify');
   
 // testing data. DELETE 
    // const testingData = {
    //   q:'Muse',
    //   type:'track%2Cartist',
    //   market:'US',
    //   limit:'10',
    //   offset:'5',
    //   user:'user1'
    // }
    // const testingToken = 'BQCbGUfNa3PTeTFRoxTViGYIuPKf-aRDM9zg10j7zGAuh3558pgKjaMDKoStQclEKdrfIJbAz3Bi2Yt6rgjokceKNKyC6pf7ZFKbydYrsKKC5aPIkL4Sd8NRYyHIRj98z35VLMo0g0Pvslmz';
    const user =  await usersCollection.doc(req.query.name).get();
    const userRefreshToken = user.data().refresh_token;

    ///testing options. DELETE

    // const options = {
    //   url: `https://api.spotify.com/v1/search?q=${testingData.q}&type=${testingData.type}&market=${testingData.market}&limit=${testingData.limit}&offset=${testingData.offset}`,
    //   headers: { Authorization: `Bearer ${testingToken}` }
    // };

    const options = { 
      url: `https://api.spotify.com/v1/search?q=${req.query.q}&type=${req.query.type}&market=${req.query.market}&limit=${req.query.limit}&offset=${req.query.offset}`, 
      headers: { Authorization: `Bearer ${userRefreshToken}` } };

    await request(options, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        console.log('song', body);
        res.send(JSON.parse(body));
      } else {
        res.send('No song found');
      }
    });
  })
);









https: exports.api = functions.https.onRequest(app);
