import React, { Component } from 'react';
import DeviceForm from './DeviceForm';

class DeviceFormContainer extends Component {
  render() {
    const { devices } = this.props;

    if (devices && devices.length > 0) {
      return devices.map((device) => (
        <DeviceForm
          key={device.address}
          device={device}
          {...this.props}
        />
      ));      
    } else { 
      return (
        <p>No devices yet :'(</p>
      );
    }
  }
}

export default DeviceFormContainer;