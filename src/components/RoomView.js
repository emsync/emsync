import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ListenersList from "./ListenersList";
import { db } from "../firebase";
import { fetchRoom, addToQueue } from "../store/room";
class RoomView extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.props.fetchRoom();
  }

  handleClick() {
    console.log("clicked!");
    this.props.addToQueue({ name: "Baby", artist: "Justin Biebser" });
  }

  render() {
    return this.props.room ? (
      <div>
        <h1>{this.props.room.name}</h1>
        <ListenersList listeners={this.props.room.listeners} />
        <button onClick={this.handleClick}>Add to queue!</button>
      </div>
    ) : (
      <p>Loading...</p>
    );
  }
}

const mapDispatch = (dispatch, ownProps) => ({
  fetchRoom: () => dispatch(fetchRoom(ownProps.match.params.name)),
  addToQueue: song => dispatch(addToQueue(song, ownProps.match.params.name))
});

const mapState = (state, ownProps) => {
  console.log("state is", state);
  console.log("ownProps are", ownProps);
  const currentRoom = state.rooms.find(room => {
    console.log("match params are", ownProps.match.params.name);
    return room.slug === ownProps.match.params.name;
  });

  return {
    room: currentRoom
  };
};

export default connect(
  mapState,
  mapDispatch
)(RoomView);
