import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';

class DeviceAdder extends Component {
    state = {
        open: false,
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
                        <Grid container spacing={32}>
                            <Grid item xs={7}>
                                <TextField
                                    margin="dense"
                                    id="name"
                                    label="Device Name"
                                    type="text"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    margin="dense"
                                    id="name"
                                    label="Device Address"
                                    type="text"
                                    fullWidth
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
