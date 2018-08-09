import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { RoomsList } from "./RoomsList";

/**
 * COMPONENT
 */
export const UserHome = props => {
  console.log(props);
  return (
    props.rooms.length && (
      <div>
        <h3>Welcome</h3>
        <RoomsList rooms={props.rooms} />
      </div>
    )
  );
};

/**
 * CONTAINER
 */
const mapState = state => {
  console.log("state is", state);
  return {
    email: state.user.email,
    rooms: state.rooms
  };
};

export default connect(mapState)(UserHome);

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
};
