import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Card, Icon, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
const Extra = props => {
  return (
    <div>
      <Icon name="user" />
      {props.listeners} Listeners
      <Link to={`/rooms/${props.name}`}>
        <Button content="Join" icon="right arrow" labelPosition="right" />
      </Link>
    </div>
  );
};

export const roomSingleCard = props => (
  <Card
    image={props.imageUrl}
    header={props.name}
    meta="Room"
    description={props.description}
    extra={<Extra listeners={props.listeners.length} name={props.name} />}
  />
);
