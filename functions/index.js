const path = require("path");
const functions = require("firebase-functions");
const express = require("express");
const slugify = require("slugify");
const request = require("request");
// const { db } = require('../src/firebase')
const usersCollection = functions.database.ref("/users");
const roomCollection = functions.database.ref("/roooms");
const querystring = require("querystring");
var cookieParser = require("cookie-parser");
var cors = require("cors");

var client_id = "918c8a6c117b4c1383ea85d8791e5f72"; // Your client id
var client_secret = "a53e2dc52bc24656b8b41f8e8bd60c23"; // Your secret
var redirect_uri = "http://127.0.0.1:3000/callback"; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = "spotify_auth_state";

/* Express */
const app = express();
app.use(cors()).use(cookieParser());

/* ------------------------------------
LOGIN ROUTES start
---------------------------------------- */
app.get("/login", function(req, res) {
  console.log("executing /login!!!!");
  var state = generateRandomString(16);
  res.cookie(stateKey, state);
  console.log("in /login, state is: --------", state);
  // your application requests authorization
  var scope = "user-read-private user-read-email";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      })
  );
});

app.get("/callback", function(req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;
  console.log("cookies ---------------- ", req.cookies);
  console.log(
    `in /callback, code is ${code}, state is ${state}, storedState is ${storedState}`
  );
  // if (state === null || state !== storedState) {
  if (false) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch"
        })
    );
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code"
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(client_id + ":" + client_secret).toString("base64")
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        console.log("Access Token: ", access_token);
        console.log("Refresh Token: ", refresh_token);
        // console.log('Body: ', body);

        var options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          var data = {
            name: body.id,
            email: body.email,
            access_token: access_token,
            refresh_token: refresh_token
          };
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          "/#" +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            })
        );
      } else {
        res.redirect(
          "/#" +
            querystring.stringify({
              error: "invalid_token"
            })
        );
      }
    });
  }
});

app.get("/refresh_token", function(req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64")
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      console.log("Access Token: ", access_token);
      console.log("Refresh Token: ", refresh_token);
      res.send({
        access_token: access_token
      });
    }
  });
});

/* ------------------------------------
LOGIN ROUTES end
---------------------------------------- */

app.get("/home", (request, response) => {
  console.log("Hit this route");
  response.send("Home2!!!!");
});

//GET all users
// app.get(
//   '/users',
//   asyncHandler(async (req, res, next) => {
//     console.log('getting users')
//     const users = []
//     const data = await usersCollection.get()
//     data.forEach(doc => users.push(doc.data()))
//     if (data === undefined) {
//       res.send('No data found')
//     } else {
//       res.send(users)
//     }
//   })
// )

//GET user by name
// app.get(
//   '/user',
//   asyncHandler(async (req, res, next) => {
//     console.log('getting user')
//     // get user by name
//     const user = await usersCollection.doc('user1').get()
//     if (user === undefined) {
//       res.send('No data found')
//     } else {
//       res.send(user.data())
//     }
//   })
// )

// GET user by name
// app.get('/user', (req, res, next) => {
//   console.log('getting user')
//   // get user by name
//    usersCollection.doc(req.query.name).get().then(user => {
//      if (user === undefined) {
//        res.send('No data found')
//      } else {
//        res.send(user.data())
//      }
//    })
// });

//GET Album by ID

// app.get('/album/', (req,res,next) => {
//   console.log('getting album by title');
//   //get user by name
//   const user = await usersCollection.doc('user1').get();
//   const userRefreshToken = user.data().refresh_token;
//   const albumId = req.query.albumId;

//   const options = { url: `https://api.spotify.com/v1/albums/${albumId}?market=US`,
//   headers: { Authorization: `Bearer ${userRefreshToken}` } };

//   const album = await request(options, (error,response,body) => {
//     if(!error && response.statusCode == 200){
//       console.log('album', body)
//       res.send(JSON.parse(body))
//     }else{
//       res.send('NO album found')
//     }
//   } )
// }));

//     const album = await request(options, (error, response, body) => {
//       if (!error && response.statusCode == 200) {
//         console.log('album', body)
//         res.send(JSON.parse(body))
//       } else {
//         res.send('NO album found')
//       }
//     })
//   })
// )

//GET song by Id
/* "https://api.spotify.com/v1/search?q=Muse&type=track%2Cartist&market=US&limit=10&offset=5"
-H "Accept: application/json"
-H "Content-Type: application/json"
-H "Authorization: Bearer TOKEN GOES HERE*/

app.get("/song", (req, res, next) => {
  console.log("getting item from Spotify");

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

  return usersCollection
    .doc("funkyRoom")
    .get()
    .then(user => {
      const userRefreshToken = user.data().refresh_token;

      const options = {
        url: `https://api.spotify.com/v1/search?q=${req.query.q}&type=${
          req.query.type
        }&market=${req.query.market}&limit=${req.query.limit}&offset=${
          req.query.offset
        }`,
        headers: { Authorization: `Bearer ${userRefreshToken}` }
      };

      return options;
    })
    .then(options => {
      return request(options, (error, response, body) => {
        console.log("options", options);

        if (!error && response.statusCode === 200) {
          console.log("song", body);
          res.send(JSON.parse(body));
        } else {
          console.log(body);
          res.send("No song found");
        }
      });
    });
});

exports.createRoom = functions.firestore
  .document("rooms/{roomId}")
  .onCreate((snap, context) => {
    const name = snap.data().name;
    console.log(name);
    const slug = slugify(name, {
      remove: null,
      lower: true
    });
    functions.firestore.document(`users/${snap.id}`).update({
      slug
    });
  });

exports.api = functions.https.onRequest(app);
