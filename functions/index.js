const path = require('path')
const functions = require('firebase-functions')
const express = require('express')
const asyncHandler = require('express-async-handler')
const request = require('request')
const { db } = require('../src/firebase')
const usersCollection = db.collection('users')
const roomCollection = db.collection('rooms')
const querystring = require('querystring')
var cookieParser = require('cookie-parser')
var cors = require('cors')

var client_id = '918c8a6c117b4c1383ea85d8791e5f72' // Your client id
var client_secret = 'a53e2dc52bc24656b8b41f8e8bd60c23' // Your secret
var redirect_uri = 'http://127.0.0.1:3000/callback' // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

var stateKey = 'spotify_auth_state'

/* Express */
const app = express()
app.use(cors()).use(cookieParser())

/* ------------------------------------
LOGIN ROUTES start
---------------------------------------- */
app.get('/login', function(req, res) {
  console.log('executing /login!!!!')
  var state = generateRandomString(16)
  res.cookie(stateKey, state)
  console.log('in /login, state is: --------', state)
  // your application requests authorization
  var scope = 'user-read-private user-read-email'
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  )
})

app.get('/callback', function(req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null
  var state = req.query.state || null
  var storedState = req.cookies ? req.cookies[stateKey] : null
  console.log('cookies ---------------- ', req.cookies)
  console.log(
    `in /callback, code is ${code}, state is ${state}, storedState is ${storedState}`
  )
  if (state === null || state !== storedState) {
    res.redirect(
      '/' +
        querystring.stringify({
          error: 'state_mismatch',
        })
    )
  } else {
    res.clearCookie(stateKey)
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization:
          'Basic ' +
          new Buffer(client_id + ':' + client_secret).toString('base64'),
      },
      json: true,
    }

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token

        console.log('Access Token: ', access_token)
        console.log('Refresh Token: ', refresh_token)
        // console.log('Body: ', body);

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { Authorization: 'Bearer ' + access_token },
          json: true,
        }

        // use the access token to access the Spotify Web API
        request.get(options, async function(error, response, body) {
          var data = {
            name: body.id,
            email: body.email,
            access_token: access_token,
            refresh_token: refresh_token,
          }
          console.log(body)

          await db
            .collection('users')
            .doc(data.name)
            .set(data)
        })

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          '/#' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token,
            })
        )
      } else {
        res.redirect(
          '/#' +
            querystring.stringify({
              error: 'invalid_token',
            })
        )
      }
    })
  }
})

app.get('/refresh_token', function(req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(client_id + ':' + client_secret).toString('base64'),
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    },
    json: true,
  }

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token
      console.log('Access Token: ', access_token)
      console.log('Refresh Token: ', refresh_token)
      res.send({
        access_token: access_token,
      })
    }
  })
})

/* ------------------------------------
LOGIN ROUTES end
---------------------------------------- */

app.get('/home', (request, response) => {
  console.log('Hit this route')
  response.send('Home2!!!!')
})

//GET all users
app.get(
  '/users',
  asyncHandler(async (req, res, next) => {
    console.log('getting users')
    const users = []
    const data = await usersCollection.get()
    data.forEach(doc => users.push(doc.data()))
    if (data === undefined) {
      res.send('No data found')
    } else {
      res.send(users)
    }
  })
)

//GET user by name
app.get(
  '/user',
  asyncHandler(async (req, res, next) => {
    console.log('getting user')
    // get user by name
    const user = await usersCollection.doc('user1').get()
    if (user === undefined) {
      res.send('No data found')
    } else {
      res.send(user.data())
    }
  })
)

//GET Album by ID

// "https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj?market=US" - H "Authorization: Bearer BQD42fP09rP2t4LeRD9WYT9AgEZdCsyv7zHCptRTtXluC3uJQQ8acpy1tvJo3WxHKmHqcF6k4_eyC-t9ItD1z8d-AxPuviNeFwj2AQmesj2PbKDxn1XmDLf9fTagMyP7_1JLb_d-7HPs8aVb"

app.get(
  '/album/',
  asyncHandler(async (req, res, next) => {
    console.log('getting album by title')
    //get user by name
    const user = await usersCollection.doc('user1').get()
    const userRefreshToken = user.data().refresh_token
    const albumId = req.params.albumId

    const options = {
      url: `https://api.spotify.com/v1/albums/${albumId}?market=US`,
      headers: { Authorization: `Bearer ${userRefreshToken}` },
    }

    const album = await request(options, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        console.log('album', body)
        res.send(JSON.parse(body))
      } else {
        res.send('NO album found')
      }
    })
  })
)

//GET song by Id

app.get(
  '/song/',
  asyncHandler(async (req, res, next) => {
    console.log('getting song by title')
    // i need roomID from request
    //get room by name
    const room = await roomsCollection.doc('user1').get()
    const userRefreshToken = user.data().refresh_token
    const albumId = req.params.albumId

    const options = {
      url: `https://api.spotify.com/v1/albums/${albumId}?market=US`,
      headers: { Authorization: `Bearer ${userRefreshToken}` },
    }

    const album = await request(options, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        console.log('album', body)
        res.send(JSON.parse(body))
      } else {
        res.send('NO album found')
      }
    })
  })
)

exports.api = functions.https.onRequest(app)
