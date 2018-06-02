import React, { Component } from 'react';

class DeviceFormContainer extends Component {
    render() {
        const { devices } = this.props;

        if (devices && devices.length && devices.length > 0) {
            return (
                <ul>
                    {devices.map((device) => {
                        return (
                            <li key={device.address}>{device.name} | {device.address}</li>
                        );
                    })}
                </ul>
            );
        } else {
            return (
                <p>No devices yet :'(</p>
            );
        }
    }
}

export default DeviceFormContainer;