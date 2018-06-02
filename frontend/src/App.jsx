import React, { Component } from 'react';
import axios from 'axios';
import BACKEND_API from './apiConfig';
import DeviceAdder from './DeviceAdder';
import DeviceFormContainer from './DeviceFormContainer';
import './App.css';

class App extends Component {
  state = {
    hasError: false,
    errorMsg: '',
    devices: [],
  };

  addDevice = (deviceName, deviceAddress, linkedDeviceAddress = null) => {
    axios.post(BACKEND_API + '/add-device', {
      address: deviceAddress,
    })
    .then(response => {
      const device = {
        name: deviceName,
        address: deviceAddress,
        connected: false, 
      };

      if (linkedDeviceAddress) {
        const linkedDevice = this.state.devices.filter(device => {
          device.name === linkedDeviceAddress
        });
        if (linkedDevice.length > 0) {
          device.linkedDevice = linkedDevice[0];
          linkedDevice[0].linkedDevice = device;
        }
      }

      this.state.devices.push(device);
      this.setState({ devices: this.state.devices });
    })
    .catch(error => {
      const errorMsg = error && error.response && error.response.data;
      this.showError(errorMsg || error.toString());
    });
  }

  connect(deviceAddress) {
    console.log('connect to ' + deviceAddress);

    axios.post(BACKEND_API + '/connect', {
      address: deviceAddress,
    })
    .then(response => {
      this.state.devices.push({
        address: response.data.address,
        connected: true,
      });
      this.setState({
        devices: this.state.devices,
      });
    })
    .catch(error => {
      const errorMsg = error && error.response && error.response.data;
      this.showError(errorMsg || error.toString());
    });
  }

  disconnect(deviceAddress) {
    console.log('disconnect from ' + deviceAddress);

    axios.post(BACKEND_API + '/disconnect', {
      address: deviceAddress,
    })
    .then(response => {
      this.state.devices.push({
        address: response.data.address,
        connected: false,
      });
      this.setState({
        devices: this.state.devices,
      });
    })
    .catch(error => {
      const errorMsg = error && error.response && error.response.data;
      this.showError(errorMsg || error.toString());
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
        <DeviceAdder addDevice={this.addDevice} />
        <DeviceFormContainer devices={this.state.devices} />
      </div>
    );
  }
}

export default App;
