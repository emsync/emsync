import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ListenersList from "./ListenersList";
import { db } from "../firebase";

const RoomView = props => {
  return props.room ? (
    <div>
      <h1>{props.room.name}</h1>
      <ListenersList listeners={props.room.listeners} />
    </div>
  ) : (
    <p>Loading...</p>
  );
};

const mapState = (state, ownProps) => {
  console.log("state is", state);
  const currentRoom = state.rooms.find(room => {
    console.log("match params are", ownProps.match.params);
    return room.slug === ownProps.match.params.slug;
  });

  return {
    room: currentRoom
  };
};

export default connect(mapState)(RoomView);