import { db } from "../firebase";
import store from "./index";
import firebase from "firebase";

const GET_ROOM = "GET_ROOM";
const ADD_QUEUE = "ADD_QUEUE";
const REMOVE_QUEUE = "REMOVE_QUEUE";
const ADD_LISTENER = "ADD_LISTENER";
const REMOVE_LISTENER = "REMOVE_LISTENER";

const getRoom = room => ({ type: GET_ROOM, room });
const addQueue = song => {
  return { type: ADD_QUEUE, song };
};
const removeQueue = song => ({ type: REMOVE_QUEUE, song });
const addListener = listener => ({ type: ADD_LISTENER, listener });
const removeListener = listener => ({ type: REMOVE_LISTENER, listener });

// const currentState = store.getState();
// const currentRoom = currentState.room;

//THUNK CREATORS
export const fetchRoom = id => async dispatch => {
  console.log("id in fetch room is", id);
  db.collection("/rooms")
    .doc(id)
    .get()
    .then(doc => {
      if (doc.exists) {
        dispatch(getRoom(doc.data()));
      } else {
        console.log("Room id doesnt exist!");
      }
    })
    .catch(err => {
      console.log("error in room reducer", err);
    });
};

export const removeFromQueue = (song, roomId) => async dispatch => {
  db.collection("/rooms")
    .doc(roomId)
    .update({
      queue: firebase.firestore.FieldValue.arrayRemove(song)
    })
    .then(() => {
      dispatch(removeQueue(song));
      console.log("Song successfully removed from queue");
    })
    .catch(err => {
      console.log("error in room reducer", err);
    });
};

export const addToQueue = (song, roomId) => async dispatch => {
  console.log(roomId);
  db.collection("/rooms")
    .doc(roomId)
    .update({
      queue: firebase.firestore.FieldValue.arrayUnion(song)
    })
    .then(() => {
      dispatch(addQueue(song));
      console.log("Song successfully added to queue");
    })
    .catch(err => {
      console.log("error in room reducer", err);
    });
};

export const newListener = (userId, roomId) => async dispatch => {
  db.collection("users")
    .doc(userId)
    .get()
    .then(doc => {
      if (doc.exists) {
        db.collection("/rooms")
          .doc(roomId)
          .update({
            listeners: firebase.firestore.FieldValue.arrayUnion(doc.data())
          })
          .then(() => {
            dispatch(addListener(doc.data()));
            console.log("Listener just added to room!");
          })
          .catch(err => {
            console.log("error in room reducer", err);
          });
      }
    })
    .catch(err => {
      console.log("err!", err);
    });
};

export const departingListener = (userId, roomId) => async dispatch => {
  db.collection("users")
    .doc(userId)
    .get()
    .then(doc => {
      if (doc.exists) {
        db.collection("/rooms")
          .doc(roomId)
          .update({
            listeners: firebase.firestore.FieldValue.arrayRemove(doc.data())
          })
          .then(() => {
            dispatch(removeListener(doc.data()));
            console.log("Listener justleft the room!");
          })
          .catch(err => {
            console.log("error in room reducer", err);
          });
      }
    })
    .catch(err => {
      console.log("err!", err);
    });
};
export default function(state = {}, action) {
  switch (action.type) {
    case GET_ROOM:
      return action.room;
    case ADD_QUEUE:
      const queue = state.queue.slice();
      queue.push(action.song);
      return { ...state, queue };
    case REMOVE_QUEUE:
      let queueToRemove = state.queue.slice();
      let updatedQueue = queueToRemove.filter(song => {
        return song !== action.song;
      });
      return { ...state, queue: updatedQueue };
    case ADD_LISTENER:
      const listeners = state.listeners.slice();
      listeners.push(action.listener);
      return { ...state, listeners };
    case REMOVE_LISTENER:
      let listenersToRemove = state.listeners.slice();
      let updatedListeners = listenersToRemove.filter(listener => {
        return listener.id !== action.listener.id;
      });
      return { ...state, listeners: updatedListeners };
    default:
      return state;
  }
}

//the issue I am prematurely foreseeing here is that by doing this based on the name, rather than a generated id like we'd have with sequelize, is that once you create a rooms name it 1) must be unique 2) cannot be updated ..... but thats a problem for later
