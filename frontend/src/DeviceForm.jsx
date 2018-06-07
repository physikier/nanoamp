import React, { Component } from 'react';
// import { InputProps } from '@material-ui/core/Input'
// import { withStyles } from '@material-ui/core/styles';
// import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
//import { FormControlLabel } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

class DeviceForm extends Component {

  state = {
    currLevel: 0,
    stepSize: 1,
    unit: "mA"
  };
  render() {
    const {
      device,
      connect,
      disconnect,
      classes,
    } = this.props;

    const {
      name,
      address,
      connected,
      linkedDevice,
    } = device;

    const radioOnChangeHandler = (event) => {
      const value = event.target.value;
      console.log(value);
    };

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
            <TextField type="number"
              label="current level"
              //defaultValue="0" 
              InputProps={{ inputProps: { min: "0", max: "100", step: this.state.stepSize } }}
              value={this.state.currLevel}
              onChange={(e) => { this.setState({ currLevel: e.target.value }) }}
            >
            </TextField>
            <TextField type="number"
              label="step"
              defaultValue="1"
              InputProps={{ inputProps: { min: "0", max: "12", step: "1" } }}
              //value={this.state.stepSize}
              onChange={(e) => {
                this.setState({ stepSize: e.target.value || 1 });
                console.log(e);
              }}
            >
            </TextField>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                unit
                </FormLabel>
              <RadioGroup
                aria-label="unit"
                style={{ display: 'flex', flexDirection: 'row' }}
                value={this.state.unit}
                onChange={radioOnChangeHandler}
              >
                <FormControlLabel
                  value="mA"
                  control={<Radio color="primary" />}
                  label="mA"
                />
                <FormControlLabel
                  value="uA"
                  control={<Radio color="primary" />}
                  label="uA"
                />
                <FormControlLabel
                  value="nA"
                  control={<Radio color="primary" />}
                  label="nA"
                />
              </RadioGroup>
            </FormControl>
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