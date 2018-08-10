import React from "react";
import { Grid, Image } from "semantic-ui-react";
import { connect } from "react-redux";
import RoomSingleCard from "./roomSingleCard";

export const RoomsList = props => {
  return (
    <Grid columns="three" divided>
      <Grid.Row>
        {props.rooms.map(room => {
          return (
            <Grid.Column>
              <RoomSingleCard room={room} />
            </Grid.Column>
          );
        })}
      </Grid.Row>
    </Grid>
  );
};
