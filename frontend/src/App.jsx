import React, { Component } from 'react';
import axios from 'axios';
import socketio from 'socket.io-client';
import BACKEND_API from './apiConfig';
import DeviceAdder from './components/DeviceAdder';
import DeviceFormContainer from './components/DeviceFormContainer';
import Calibrator from './components/Calibrator';
import './App.css';

class App extends Component {
  socket = null;
  state = {
    hasError: false,
    errorMsg: '',
    // devices is the array that holds all information of the devices
    // device = {
    //   name: 'device name',
    //   address: 'device address',
    //   connected: false,
    //   linkedDevice: {object to linked device}
    // }
    devices: [],
    defaultDeviceNames: {},
    defaultCalibratorDeviceNames: {}
  };

  componentWillMount() {
    this.socket = socketio(`${BACKEND_API}`);
    this.socket.on('chart_data', (data) => {
      console.log('chart_data: ', data);
    });
    this.getDevices();
    this.getDefaultDeviceNames();
  }

  getDefaultDeviceNames = () => {
    axios.get(BACKEND_API + '/get-default-device-names')
    .then(response => {
      if (response.data) {
        this.setState({ defaultDeviceNames: response.data });
      }
    })
    .catch(error => {
      const errorMsg = error && error.response && error.response.data;
      this.showError(errorMsg || error.toString());
    });

  }

  getDefaultCalibratorDeviceNames = () => {
    axios.get(BACKEND_API + '/get-default-calibrator-device-names')
    .then(response => {
      if (response.data) {
        this.setState({ defaultCalibratorDeviceNames: response.data });
      }
    })
    .catch(error => {
      const errorMsg = error && error.response && error.response.data;
      this.showError(errorMsg || error.toString());
    });
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

  buildPlot = () => {
     axios.get(BACKEND_API + '/build_plot')
  }
  render() {
    return (
      <div className="App">
        {this.state.hasError &&
          <div className="alert alert-danger" role="alert">
            {this.state.errorMsg}
          </div>
        }
        <DeviceAdder
          addDevice={this.addDevice}
          devices={this.state.devices}
          defaultDevices={this.state.defaultDeviceNames}
        />
        <DeviceFormContainer
          socket={this.socket}
          devices={this.state.devices}
          connect={this.connect}
          disconnect={this.disconnect}
        />
        <Calibrator
          addDevice={this.addDevice}
        />
        <div>
        {this.buildPlot}
        </div>
      </div>
    );
  }
}

export default App;


