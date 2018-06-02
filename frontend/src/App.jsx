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

  componentWillMount() {
    this.getDevices();
  }

  getDevices = () => {
    axios.get(BACKEND_API + '/get-devices')
    .then(response => {
      if (response.data && response.data.length > 0) {
        response.data.forEach(device => {
          this.state.devices.push({
            name: device.name || 'Default name',
            address: device.address || 'ERR_NO_ADDRESS',
            connected: device.connected || false,
          });
        });
        this.setState({ devices: this.state.devices });
      }
    })
    .catch(error => {
      const errorMsg = error && error.response && error.response.data;
      this.showError(errorMsg || error.toString());
    });
  }

  addDevice = (deviceName, deviceAddress, linkedDeviceAddress = null) => {
    const sameDevice = this.state.devices.filter(device => device.address === deviceAddress);
    if (sameDevice.length > 0) {
      this.showError('Device with address "' + deviceAddress + '" already exists!');
      return;
    }

    axios.post(BACKEND_API + '/add-device', {
      address: deviceAddress,
      name: deviceName,
    })
    .then(response => {
      const device = {
        name: deviceName,
        address: deviceAddress,
        connected: false, 
      };

      if (linkedDeviceAddress) {
        const linkedDevice = this.state.devices.filter(device => {
          return device.address === linkedDeviceAddress
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

  connect = deviceAddress => {
    const device = this.state.devices.filter(device => device.address === deviceAddress);
    if (device.length < 1) {
      this.showError('No device with address "' + deviceAddress + '" found!');
      return;
    }

    axios.post(BACKEND_API + '/connect', {
      address: deviceAddress,
    })
    .then(response => {
      device[0].connected = true;
      this.setState({ devices: this.state.devices });
    })
    .catch(error => {
      const errorMsg = error && error.response && error.response.data;
      this.showError(errorMsg || error.toString());
    });
  }

  disconnect = deviceAddress => {
    const device = this.state.devices.filter(device => device.address === deviceAddress);
    if (device.length < 1) {
      this.showError('No device with address "' + deviceAddress + '" found!');
      return;
    }

    axios.post(BACKEND_API + '/disconnect', {
      address: deviceAddress,
    })
    .then(response => {
      device[0].connected = false;
      this.setState({ devices: this.state.devices });
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
        <DeviceFormContainer
          devices={this.state.devices}
          connect={this.connect}
          disconnect={this.disconnect}
        />
      </div>
    );
  }
}

export default App;
