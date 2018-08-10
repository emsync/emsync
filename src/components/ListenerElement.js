import React from "react";
import { List, Image } from "semantic-ui-react";

//props being passed here should just be a single listener (user) object
export const ListenerElement = props => {
  return (
    <div>
      <Image avatar src={props.listener.imageUrl} />
      <List.Content>
        <List.Header as="a">{props.listener.name}</List.Header>
      </List.Content>
    </div>
  );
};

//may want to include a link to the users profile after we have that sorted out
