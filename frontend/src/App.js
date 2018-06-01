import React, { Component } from 'react';
import axios from 'axios';
import BACKEND_API from './apiConfig';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './App.css';

class App extends Component {
  constructor() {
    super();
    console.log(BACKEND_API);

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

  handleChange = event => {
    this.setState({
      visaAddress: event.target.value
    });
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

  renderButton = () => {
    if (this.state.connected) {
      // render disconnect button
      return (
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => this.disconnect(this.state.visaAddress)}
        >
          Disconnect
        </Button>
      );
    } else {
      return (
        // render connect button
        <Button
          variant="outlined"
          color="primary"
          onClick={() => this.connect(this.state.visaAddress)}
        >
          Connect to {this.state.visaAddress}
        </Button>
      );
    }
  }

  render() {
    return (
      <div className="App">
        {this.state.hasError &&
          <div className="alert alert-danger" role="alert">
            {this.state.errorMsg}
          </div>
        }
        <TextField
          id="visaAddress"
          label="Visa Address"
          value={this.state.visaAddress}
          onChange={this.handleChange}
          margin="normal"
        />
        {this.renderButton()}
      </div>
    );
  }
}

export default App;
