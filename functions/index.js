const functions = require('firebase-functions');
const express = require('express');
const asyncHandler = require('express-async-handler')
const request =  require('request');
const { db } = require('../src/firebase');
const usersCollection = db.collection('users');
const roomCollection = db.collection('rooms');

/*Express*/

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
  const user = await usersCollection.doc('user1').get();
  if (user === undefined) {
    res.send('No data found')
  } else {
    res.send(user.data())
  }
}));


//GET Album by ID

// "https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj?market=US" - H "Authorization: Bearer BQD42fP09rP2t4LeRD9WYT9AgEZdCsyv7zHCptRTtXluC3uJQQ8acpy1tvJo3WxHKmHqcF6k4_eyC-t9ItD1z8d-AxPuviNeFwj2AQmesj2PbKDxn1XmDLf9fTagMyP7_1JLb_d-7HPs8aVb"


app.get('/album/', asyncHandler(async(req,res,next)=>{
  console.log('getting album by title');
  //get user by name
  const user = await usersCollection.doc('user1').get();
  const userRefreshToken = user.data().refresh_token;
  const albumId = req.params.albumId;

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



//GET song by Id

app.get('/song/', asyncHandler(async (req, res, next) => {
  console.log('getting song by title');
  // i need roomID from request
  //get room by name
  const room = await roomsCollection.doc('user1').get();
  const userRefreshToken = user.data().refresh_token;
  const albumId = req.params.albumId;

  const options = {
    url: `https://api.spotify.com/v1/albums/${albumId}?market=US`,
    headers: { Authorization: `Bearer ${userRefreshToken}` }
  };


  const album = await request(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      console.log('album', body)
      res.send(JSON.parse(body))
    } else {
      res.send('NO album found')
    }
  })
}));





exports.api = functions.https.onRequest(app);
