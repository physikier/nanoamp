import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextFieldAutocomplete from './TextFieldAutocomplete';
import './DeviceAdder.css';



class CalibratorDeviceAdder extends Component {
    state = {
        open: false,
        functionGeneratorName: '',
        functionGeneratorAdress: '',
        PIDControllerName: '',
        PIDControllerAdress: ''
    };

    openDialog = () => {
        this.setState({
            open: true,
        });
    }

    closeDialog = () => {
        this.setState({
            open: false,
        });
    }

    addDevice = () => {
        const { addDevice } = this.props;
        if (addDevice) {
            if (this.state.functionGeneratorAdress) {
                const functionGeneratorName = this.state.functionGeneratorName || 'Default left device name';
                addDevice(functionGeneratorName, this.state.functionGeneratorAdress, null);
            }
            if (this.state.PIDControllerAdress) {
                const PIDControllerName = this.state.PIDControllerName || 'Default right device name';
                addDevice(PIDControllerName, this.state.PIDControllerAdress, null);
            }
        }
        this.setState({open: false});
    }

    getNameSuggestions = () => {
        const { defaultDevices } = this.props;
        if (!defaultDevices) {
            return [];
        }

        const alreadyUsedDeviceNames = 
            this.props.devices ?
            this.props.devices.map(device => device.name):
            [];

        const nameSuggestionsNotInDevices = Object.values(defaultDevices).filter(suggestion => {
            return !alreadyUsedDeviceNames.includes(suggestion);
        });

        if (!nameSuggestionsNotInDevices) return [];
        return nameSuggestionsNotInDevices.map(suggestion => ({
            value: suggestion,
            label: suggestion,
        }));
    }

    getAddressSuggestions = (device) => {
        const { defaultDevices } = this.props;
        if (!defaultDevices) {
            return [];
        }
        
        const alreadyUsedDeviceAddresses = 
            this.props.devices ?
            this.props.devices.map(device => device.address):
            [];

        const addressSuggestionsNotInDevices = Object.keys(defaultDevices).filter(suggestion => {
            return !alreadyUsedDeviceAddresses.includes(suggestion);
        });

        if (!addressSuggestionsNotInDevices) return [];
        return addressSuggestionsNotInDevices.map(suggestion => ({
            value: suggestion,
            label: suggestion,
        }));
    }


    render() {
        return(
           /* { <div>
                <Button
                    variant="outlined"
                    color ="secondary"
                />
                <div>Hello World</div>
            </div> }*/
            <div>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={this.openDialog}
                >
                Open Calibrator
                </Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.closeDialog}
                    aria-labelledby="form-dialog_title"
                    className={'DeviceAdderDialog'}
                >
                <DialogTitle id="form-dialog-title">Add neccessary Devices</DialogTitle>
                <DialogContent className={'DeviceAdderDialogContainer'}>
                        <DialogContentText>
                            test
                        </DialogContentText>
                        <Typography variant="subheading" style={{ marginTop: 25 }}>
                            PID Controller:
                        </Typography>
                        <Grid container spacing={32}>
                            <Grid item xs={7}>
                                <TextFieldAutocomplete
                                    fullWidth
                                    value={{
                                        value: this.state.PIDControllerName,
                                        label: this.state.PIDControllerName
                                    }}
                                    onChange={(elem) => this.setState({
                                        PIDControllerName: (elem && elem.value) || ''
                                    })}
                                    placeholder="Choose a device name"
                                    label="Name"
                                    suggestions={this.getNameSuggestions()}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextFieldAutocomplete
                                    fullWidth
                                    value={{
                                        value: this.state.PIDControllerAdress,
                                        label: this.state.PIDControllerAdress
                                    }}
                                    onChange={(elem) => this.setState({
                                        PIDControllerAdress: (elem && elem.value) || ''
                                    })}
                                    placeholder="Insert Device Address"
                                    label="Address"
                                    suggestions={this.getAddressSuggestions()}
                                />
                            </Grid>
                        </Grid>
                        <Typography variant="subheading"  style={{ marginTop: 25 }}>
                            Function Generator:
                        </Typography>
                        <Grid container spacing={32}>
                            <Grid item xs={7}>
                                <TextFieldAutocomplete
                                    fullWidth
                                    value={{
                                        value: this.state.functionGeneratorName,
                                        label: this.state.functionGeneratorName
                                    }}
                                    onChange={(elem) => this.setState({
                                        functionGeneratorName: (elem && elem.value) || ''
                                    })}
                                    placeholder="Choose a device name"
                                    label="Name"
                                    suggestions={this.getNameSuggestions()}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextFieldAutocomplete
                                    fullWidth
                                    value={{
                                        value: this.state.functionGeneratorAdress,
                                        label: this.state.functionGeneratorAdress
                                    }}
                                    onChange={(elem) => this.setState({
                                        functionGeneratorAdress: (elem && elem.value) || ''
                                    })}
                                    placeholder="Insert Device Address"
                                    label="Address"
                                    suggestions={this.getAddressSuggestions()}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDialog} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.addDevice} color="primary">
                            Add Devices
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );

    }
}

export default CalibratorDeviceAdder;
