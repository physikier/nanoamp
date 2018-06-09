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
    stepSizeCoefficient: 1,
    stepSizeFieldStepSize: 1,
  };

  stepSizeChangeHandler = (event) => {
    const {
      stepSize,
      stepSizeFieldStepSize,
    } = this.state;

    const rawNewValue = event.target.value;
    let newValue = Number(parseFloat(rawNewValue).toFixed(this.decimalPlaces(stepSize) + 1));
    let newStepSizeFieldStepSize = stepSizeFieldStepSize;
    
    if (newValue <= 1) {
      const newValueString = newValue.toString();
      const valueLastNumber = parseInt(newValueString.substr(newValueString.length - 1), 10);
      const valueString = stepSize.toString();
      const stepSizeLastNumber = parseInt(valueString.substr(valueString.length - 1), 10);

      if (valueLastNumber <= 0) {
        const decimalLength = valueString.includes('.') ? valueString.split('.').pop().length : 0;
        newValue = parseFloat(stepSize - stepSize/10).toPrecision(1);
        if (newValue < 0.000001) {
          newValue = stepSize;
        } else {
          newStepSizeFieldStepSize = 1/Math.pow(10, decimalLength + 1);
        }
      } else if (valueLastNumber === 1 && stepSizeLastNumber === 9) {
        newStepSizeFieldStepSize = stepSizeFieldStepSize * 10;
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
    /////////////////////////////////////////////////////////////////
    // LOGIC:
    //   minimum allowed number 0
    //
    //   set new number to event target value
    //   if new number is smaller than current number:
    //     if current number minus step smaller or equal to 0:
    //       set new number to 0
    //     else if new number smaller than 1 and greater than 0:
    //       if current unit is not nano amp:
    //         multiply new number by 1000
    //         multiply current step size by 1000
    //         set new unit to next smaller unit
    //       else:
    //         set new number to 0
    //   else if new number is greater than current number:
    //     if new number is greater or equal than 1000
    //       if current unit is not milli amp:
    //         divide new number by 1000
    //         divide current step size by 1000
    //         set new unit to next bigger unit
    //       else:
    //         set new number to 1000
    //
    //   set new number to state
    /////////////////////////////////////////////////////////////////
    const {
      currLevel,
      unit,
      stepSize,
      stepSizeCoefficient,
    } = this.state;

    const rawNewValue = event.target.value;
    let newValue = Number(parseFloat(rawNewValue).toFixed(this.decimalPlaces(stepSize) + 1));

    let newStepSizeCoefficient = stepSizeCoefficient;
    let newUnit = unit;

    if (newValue < currLevel) {
      if (newValue <= 0) {
        newValue = 0;
      } else if (newValue < 1 && newValue > 0) {
        if (unit !== this.units[this.units.length - 1]) {
          newValue = newValue * 1000;
          newStepSizeCoefficient = stepSizeCoefficient * 1000;
          newUnit = this.units[this.units.indexOf(unit) + 1];
        } else {
          newValue = 0;
        }
      }
    } else if (newValue > currLevel) {
      if (newValue >= 1000) {
        if (unit !== this.units[0]) {
          newValue = newValue / 1000;
          newStepSizeCoefficient = stepSizeCoefficient / 1000;
          newUnit = this.units[this.units.indexOf(unit) - 1];
        } else {
          newValue = 1000;
        }
      }
    }

    this.setState({
      currLevel: newValue,
      unit: newUnit,
      stepSizeCoefficient: newStepSizeCoefficient,
    });
  }

  decimalPlaces = (number) => {
    var match = ('' + number).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) return 0;
    return Math.max(
      0,
      // Number of digits right of decimal point.
      (match[1] ? match[1].length : 0)
      // Adjust for scientific notation.
      - (match[2] ? +match[2] : 0)
    );
  }

  render = () => {
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
                    id={`device${address}CurrentLevel`}
                    type='number'
                    inputProps={{
                      step: this.state.stepSize * this.state.stepSizeCoefficient
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
                      step: this.state.stepSizeFieldStepSize,
                      value: this.state.stepSize,
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