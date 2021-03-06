import { db } from "../firebase";
import store from "./index";

const ADD_ROOM = "ADD_ROOM";
const REMOVE_ROOM = "REMOVE_ROOM";
const UPDATE_ROOM = "UPDATE_ROOM";

const removeRoom = room => ({ type: REMOVE_ROOM, room });
const addRoom = room => {
  console.log("CALLED ADD ROOM");
  return { type: ADD_ROOM, room };
};
const updateRoom = room => ({ type: UPDATE_ROOM, room });

db.collection("rooms").onSnapshot(
  snapshot => {
    let changes = snapshot.docChanges();
    //returns an array of docs that were changed in this collection with a type property
    changes.forEach(change => {
      console.log(change.doc.data());
      console.log(change.type);
      // --> if you want to see the actual data in the doc
      if (change.type === "added") {
        console.log("here!");
        (async dispatch => {
          try {
            console.log("in the try");
            store.dispatch(addRoom(change.doc.data()));
          } catch (err) {
            console.error(err);
          }
        })();
      } else if (change.type === "removed") {
        (async dispatch => {
          try {
            store.dispatch(removeRoom(change.doc.data()));
          } catch (err) {
            console.error(err);
          }
        })();
      } else if (change.type === "modified") {
        (async dispatch => {
          try {
            store.dispatch(updateRoom(change.doc.data()));
          } catch (err) {
            console.error(err);
          }
        })();
      }
    });
  },
  err => {
    console.log(err);
  }
);

export default function(state = [], action) {
  switch (action.type) {
    case ADD_ROOM:
      console.log("called add!!!");
      return [...state, action.room];
    case REMOVE_ROOM:
      let roomsCopy = state.slice();
      let roomsRemoved = roomsCopy.filter(room => {
        return room.name !== action.room.name;
      });
      return roomsRemoved;
    case UPDATE_ROOM:
      let rooms = state.slice();
      let roomsRemovedToUpdate = rooms.filter(room => {
        return room.name !== action.room.name;
      });
      return [...roomsRemovedToUpdate, action.room];
    default:
      return state;
  }
}

//the issue I am prematurely foreseeing here is that by doing this based on the name, rather than a generated id like we'd have with sequelize, is that once you create a rooms name it 1) must be unique 2) cannot be updated ..... but thats a problem for later
