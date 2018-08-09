import React, { Component } from 'react';
import './App.css';
import { db } from './firebase';
// import firebase from 'firebase'
import { Navbar } from './components';
import Routes from './routes';

//Firebase Stuff

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
    };
  }

  componentDidMount() {
    db.doc('courses/online')
      .get()
      .then(doc => this.setState({ name: doc.data().name }));
  }
  render() {
    return (
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">{this.state.name}</h1>
        </header> */}
        {/* <div> */}
        <Navbar />
        <Routes />
        {/* </div> */}
      </div>
    );
  }
}

export default App;
//comment
