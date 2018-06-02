import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


class DeviceForm extends Component {
  render() {
    const {
      device,
      connect,
      disconnect,
    } = this.props;

    const {
      name,
      address,
      connected,
      linkedDevice,
    } = device;

    return (
      <div>
        <Card raised>
          <CardContent>
            <Typography variant="display2" component="h1">
              name: {name || 'No name'}
            </Typography>
            <Typography variant="headline" component="h3">
              address: {address || 'No address'}
            </Typography>
            <Typography variant="title" component="h5">
              connected: {connected ? 'yes' : 'no'}
            </Typography>
            <Typography variant="title" component="h5">
              linked device: {(linkedDevice && linkedDevice.name) || 'No linked device'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => connect(address)}>Connect</Button>
            <Button size="small" onClick={() => disconnect(address)}>Disconnect</Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default DeviceForm;