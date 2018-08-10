import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import { firebase } from '../firebase';
import { Link } from 'react-router-dom';

export default class NavBar extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      userName: 'wormat23',
    };
  }
  handleClick = () => {
    // firebase
    //   .auth()
    //   .signInWithCustomToken('36KJ5G634G6345634586345968')
    //   .then(function() {
    //     console.log('signed in!');
    //   })
    //   .catch(function(error) {});
    this.setState({ loggedIn: !this.state.loggedIn });
  };

  render() {
    return (
      //if logged in show username
      <div>
        <Menu stackable inverted>
          <Menu.Item as={Link} to="/">
            <img
              src="https://avatars2.githubusercontent.com/u/42189420?s=200&v=4"
              alt="emSync Logo"
            />
          </Menu.Item>

          {!this.state.loggedIn ? (
            <Menu.Item name="login" onClick={this.handleClick} key={1}>
              Login
            </Menu.Item>
          ) : null}

          <Menu.Item key={2}>Test</Menu.Item>

          {/* If user is logged in */}
          {this.state.loggedIn
            ? [
                <Menu.Item
                  className="navRight"
                  position="right"
                  name="welcomeUser"
                >
                  Welcome {this.state.userName}
                </Menu.Item>,
                <Menu.Item
                  className="navRight"
                  name="logout"
                  onClick={this.handleClick}
                >
                  Logout
                </Menu.Item>,
              ]
            : null}
        </Menu>
      </div>
    );
  }
}
