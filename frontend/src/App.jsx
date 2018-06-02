import React, { Component } from 'react';
import axios from 'axios';
import BACKEND_API from './apiConfig';
import DeviceAdder from './DeviceAdder';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      hasError: false,
      errorMsg: '',
      // devices is an array of objects
      // devices: {
      //   visaAddress: 'ABC123',
      //   connected: false,
      // }
      devices: []
    };
  }

  connect(visaAddress) {
    console.log('connect to ' + visaAddress);

    axios.post(BACKEND_API + '/connect', {
      visaAddress: visaAddress,
    })
    .then(response => {
      this.state.devices.push({
        visaAddress: response.data.visaAddress,
        connected: true,
      });
      this.setState({
        devices: this.state.devices,
      });
    })
    .catch(error => {
      this.showError(error.response.data || error.toString());
    });
  }

  disconnect(visaAddress) {
    console.log('disconnect from ' + visaAddress);

    axios.post(BACKEND_API + '/disconnect', {
      visaAddress: visaAddress,
    })
    .then(response => {
      this.state.devices.push({
        visaAddress: response.data.visaAddress,
        connected: false,
      });
      this.setState({
        devices: this.state.devices,
      });
    })
    .catch(error => {
      this.showError(error.response.data || error.toString());
    });
  }

  showError = errorMsg => {
    this.setState({
      hasError: true,
      errorMsg: errorMsg,
    }, () => {
      setTimeout(() => {
        this.setState({
          hasError: false,
          errorMsg: '',
        });
      }, 7500);
    });
  }

  render() {
    return (
      <div className="App">
        {this.state.hasError &&
          <div className="alert alert-danger" role="alert">
            {this.state.errorMsg}
          </div>
        }
        <DeviceAdder connect={this.connect} />
      </div>
    );
  }
}

export default App;
