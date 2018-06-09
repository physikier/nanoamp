import React, { Component } from 'react';
import DeviceForm from './DeviceForm';

class DeviceFormContainer extends Component {
  render() {
    const {
      devices,
      connect,
      disconnect,
    } = this.props;

    if (devices && devices.length && devices.length > 0) {
      return devices.map((device) => (
        <DeviceForm
          key={device.address}
          device={device}
          connect={connect}
          disconnect={disconnect}
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