import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

class DeviceAdder extends Component {
    state = {
        open: false,
        leftDeviceName: '',
        leftDeviceAddress: '',
        rightDeviceName: '',
        rightDeviceAddress: '',
    };

    openDialog = () => {
        this.setState({
            open: true,
        });

        // <TextField
        //   id="visaAddress"
        //   label="Visa Address"
        //   value={this.state.visaAddress}
        //   onChange={this.handleChange}
        //   margin="normal"
        // />
    }

    closeDialog = () => {
        this.setState({
            open: false,
        });
    }

    addDevice = () => {
        const { addDevice } = this.props;
        if (addDevice) {
            if (this.state.leftDeviceAddress) {
                const leftDeviceName = this.state.leftDeviceName || 'Default left device name';
                addDevice(leftDeviceName, this.state.leftDeviceAddress, this.state.rightDeviceAddress);
            }
            if (this.state.rightDeviceAddress) {
                const rightDeviceName = this.state.rightDeviceName || 'Default right device name';
                addDevice(rightDeviceName, this.state.rightDeviceAddress, this.state.leftDeviceAddress);
            }
        }
        this.setState({open: false});
    }

    render() {
        return (
            <div>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={this.openDialog}
                >
                    Add Device
                </Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.closeDialog}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Add Device</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To add a device just choose one from the suggestions or insert your own device data.
                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
                            invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
                        </DialogContentText>
                        <Typography variant="subheading" style={{ marginTop: 25 }}>
                            Left Device:
                        </Typography>
                        <Grid container spacing={32}>
                            <Grid item xs={7}>
                                <TextField
                                    margin="dense"
                                    id="name"
                                    label="Left Device Name"
                                    type="text"
                                    fullWidth
                                    value={this.state.leftDeviceName}
                                    onChange={(event) => this.setState({leftDeviceName: event.target.value})}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    margin="dense"
                                    id="name"
                                    label="Left Device Address"
                                    type="text"
                                    fullWidth
                                    value={this.state.leftDeviceAddress}
                                    onChange={(event) => this.setState({leftDeviceAddress: event.target.value})}
                                />
                            </Grid>
                        </Grid>
                        <Typography variant="subheading"  style={{ marginTop: 25 }}>
                            Right Device (optional):
                        </Typography>
                        <Grid container spacing={32}>
                            <Grid item xs={7}>
                                <TextField
                                    margin="dense"
                                    id="name"
                                    label="Right Device Name"
                                    type="text"
                                    fullWidth
                                    value={this.state.rightDeviceName}
                                    onChange={(event) => this.setState({rightDeviceName: event.target.value})}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    margin="dense"
                                    id="name"
                                    label="Right Device Address"
                                    type="text"
                                    fullWidth
                                    value={this.state.rightDeviceAddress}
                                    onChange={(event) => this.setState({rightDeviceAddress: event.target.value})}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDialog} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.addDevice} color="primary">
                            Add Device
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default DeviceAdder;
