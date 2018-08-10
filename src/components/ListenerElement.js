import React, { Component } from "react";
import { List, Image } from "semantic-ui-react";
import { db } from "../firebase";

//props being passed here should just be a single listener (user) object
export class ListenerElement extends Component {
  constructor() {
    super();
    this.state = {
      listener: {}
    };
  }

  async componentDidMount() {
    const res = await this.props.listener.get();
    const listener = res.data();
    console.log("LISTENER IS", listener);
    this.setState({
      listener
    });
  }

  render() {
    return (
      <div>
        <Image avatar src={this.state.listener.imageUrl} />
        <List.Content>
          <List.Header as="a">{this.state.listener.name}</List.Header>
        </List.Content>
      </div>
    );
  }
}
//may want to include a link to the users profile after we have that sorted out
