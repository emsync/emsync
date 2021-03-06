import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Constants, AuthSession, Font } from 'expo';
import axios from 'axios';
import qs from 'qs';
import styles from './styles';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      fontLoaded: false,
      resultOne: '', //GET
      resultTwo: '', //
      userData: {},
    };
    this.handlePress = this.handlePress.bind(this);
  }
  static navigationOptions = {
    header: null,
  };

  componentDidMount = async () => {
    await Font.loadAsync({
      myriadPro: require('./public/MPR.ttf'),
    });
    this.setState({ fontLoaded: true });
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.fontLoaded && (
          <TouchableOpacity onPress={this.handlePress}>
            <Text style={styles.text}>Connect Spotify</Text>
          </TouchableOpacity>
        )}
        <Image
          source={require(`./public/ghost.gif`)}
          style={{ resizeMode: 'contain', width: 300, height: 300 }}
        />
      </View>
    );
  }
  handlePress = async () => {
    const { navigate } = this.props.navigation;
    await this.retrieveAccessToken();
    console.log('Created in SpotifyAuthentication', this.state.resultTwo);
    navigate('AccountSetupView', {
      userData: this.state.userData,
      resultOne: this.state.resultOne,
      resultTwo: this.state.resultTwo,
    });
  };

  retrieveAccessToken = async () => {
    let redirectUrl = 'exp://expo.io/@alanyoho/next';
    let resultOne = await AuthSession.startAsync({
      authUrl:
        `https://accounts.spotify.com/authorize?response_type=code` +
        `&client_id=f51009c9ffae4a90bc7a1364f46bb2fb` +
        `&scope=${encodeURIComponent(
          'streaming user-read-private user-read-email app-remote-control'
        )}` +
        `&redirect_uri=${encodeURIComponent(redirectUrl)}`,
    });
    //  console.log('result One:', resultOne)
    this.setState({ resultOne });
    try {
      let code = `${this.state.resultOne.params.code}`;
      const returnData = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUrl,
          client_id: 'f51009c9ffae4a90bc7a1364f46bb2fb',
          client_secret: 'b5f81a8017144d80bc2e499b21a68e10',
        }),
      });
      console.log('result Two:', returnData.data);

      this.setState({ resultTwo: returnData.data });
      console.log('access Token: ', returnData.data.access_token);
    } catch (error) {
      console.log('error: ', error);
    }
    await this.retrieveCurrentUser();
  };

  retrieveCurrentUser = async () => {
    try {
      const userData = await axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/me',
        headers: {
          Authorization: `Bearer ${this.state.resultTwo.access_token}`,
        },
      });
      this.setState({ userData: userData.data });
    } catch (error) {
      console.error(error);
    }
  };
}
