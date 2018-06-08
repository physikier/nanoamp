import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

class DeviceForm extends Component {
  units = ['mA', 'uA', 'nA'];
  state = {
    currLevel: 1,
    unit: 'mA',
    stepSize: 1,
    stepSizeLabel: 'mA',
    stepSizeFieldStepSize: 1,
  };

  stepSizeChangeHandler = (event) => {
    const rawNewValue = event.target.value;
    const precisionLength = !rawNewValue.includes('.') ? rawNewValue.length : 1;
    let newValue = parseFloat(rawNewValue).toPrecision(precisionLength);
    let newStepSizeFieldStepSize = this.state.stepSizeFieldStepSize;
    
    if (newValue <= 1) {
      const newValueString = newValue.toString();
      const valueLastNumber = parseInt(newValueString.substr(newValueString.length - 1), 10);
      const valueString = this.state.stepSize.toString();
      const stepSizeLastNumber = parseInt(valueString.substr(valueString.length - 1), 10);

      if (valueLastNumber <= 0) {
        const decimalLength = valueString.includes('.') ? valueString.split('.').pop().length : 0;
        newValue = parseFloat(this.state.stepSize - this.state.stepSize/10).toPrecision(1);
        if (newValue < 0.000001) {
          newValue = this.state.stepSize;
        } else {
          newStepSizeFieldStepSize = 1/Math.pow(10, decimalLength + 1);
        }
      } else if (valueLastNumber === 1 && stepSizeLastNumber === 9) {
        newStepSizeFieldStepSize = this.state.stepSizeFieldStepSize * 10;
      }
    }

    this.setState({
      stepSize: newValue,
      stepSizeFieldStepSize: newStepSizeFieldStepSize,
      stepSizeLabel: this.computeStepSizeLabel(newValue),
    });
  }

  computeStepSizeLabel = (value) => {
    if (value >= 1) {
      return 'mA';
    } else if (value < 1 && value >= 0.001) {
      return 'mA ≙ ' + (value * 1000).toString() + 'uA';
    } else if (value < 0.001 && value >= 0.000001) {
      return 'mA ≙ ' + (value * 1000000).toString() + 'nA';
    } else {
      return 'number too small'
    }
  }

  currLevelChangeHandler = (event) => {
    const rawNewValue = event.target.value;
    const precisionLength = rawNewValue.length - 1;
    let newValue = parseFloat(rawNewValue).toPrecision(precisionLength < 1 ? 1 : precisionLength);

    let newUnit = this.state.unit;
    let newCurrLevel = this.state.currLevel;

    if (newValue <= 0) {
      const index = this.units.indexOf(this.state.unit);
      if (index < this.units.length - 1) {
        newCurrLevel = 999;
        newUnit = this.units[index + 1];
      } else {
        if (newValue < 0) {
          newCurrLevel = 1;
          newUnit = this.units[0];
        } else {
          newCurrLevel = 0;
        }
      }
    } else if (newValue >= 1000) {
      const index = this.units.indexOf(this.state.unit);
      if (index > 0) {
        newCurrLevel = 1;
        newUnit = this.units[index - 1];
      }
    } else {
      newCurrLevel = newValue;
    }

    this.setState({
      currLevel: newCurrLevel,
      unit: newUnit,
    });
  }

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
            <FormControl>
              <Grid container spacing={8} alignItems="flex-end">
                <Grid item>
                  <FormLabel>current level</FormLabel>
                  <TextField
                    type='number'
                    inputProps={{
                      step: this.state.stepSize
                    }}
                    value={this.state.currLevel}
                    onChange={this.currLevelChangeHandler}
                  />
                </Grid>
                <Grid item>
                  <span>{this.state.unit}</span>
                </Grid>
              </Grid>
              <Grid container spacing={8} alignItems="flex-end">
                <Grid item>
                  <FormLabel>step</FormLabel>
                  <TextField
                    type='number'
                    inputProps={{
                      step: this.state.stepSizeFieldStepSize
                    }}
                    value={this.state.stepSize}
                    onChange={this.stepSizeChangeHandler}
                  />
                </Grid>
                <Grid item>
                  <span>{this.state.stepSizeLabel}</span>
                </Grid>
              </Grid>
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