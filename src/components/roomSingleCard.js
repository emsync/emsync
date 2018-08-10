import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Card, Icon, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
const Extra = props => {
  console.log("slug is", props.slug);
  return (
    <div>
      <Icon name="user" />
      {props.listeners} Listeners
      <Link to={`/rooms/${props.slug}`}>
        <Button content="Join" icon="right arrow" labelPosition="right" />
      </Link>
    </div>
  );
};

const RoomSingleCard = props => {
  return (
    <Card
      image={props.room.imageUrl}
      header={props.room.name}
      meta="Room"
      description={props.room.description}
      extra={
        <Extra listeners={props.room.listeners.length} slug={props.room.slug} />
      }
    />
  );
};

export default RoomSingleCard;
