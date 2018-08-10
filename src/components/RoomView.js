import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { SingleRoomListeners } from "./SingleRoomListeners";

export const RoomView = props => {
  return <SingleRoomListeners />;
};

const mapState = (state, ownProps) => {
  const currentRoom = state.rooms.find(room => {
    return room.name === ownProps.match.params.name;
  });
  return {
    email: state.user.email,
    rooms: state.rooms
  };
};

export default connect(mapState)(RoomView);
