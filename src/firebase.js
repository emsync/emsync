var firebase = require('firebase');
require('firebase/firestore');
require('firebase-auth');

var config = {
  apiKey: 'AIzaSyBmrJUFvLhI_GAqKyR9D0ZF2NLaat4va6g',
  authDomain: 'emsync-ae69c.firebaseapp.com',
  databaseURL: 'https://emsync-ae69c.firebaseio.com',
  projectId: 'emsync-ae69c',
  storageBucket: 'emsync-ae69c.appspot.com',
  messagingSenderId: '554264331102',
};

firebase.initializeApp(config);

const db = firebase.firestore();
module.exports = { db, firebase };
