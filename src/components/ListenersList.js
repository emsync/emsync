import React from "react";
import { List, Image } from "semantic-ui-react";
import { ListenerElement } from "./ListenerElement";

//props that should be passed here should be the current rooms listeners array
const ListenersList = props => (
  <div>
    <h2>Listeners:</h2>
    <List>
      <List.Item>
        {props.listeners.map(listener => {
          return <ListenerElement key={listener.name} listener={listener} />;
        })}
      </List.Item>
    </List>
  </div>
);

export default ListenersList;
