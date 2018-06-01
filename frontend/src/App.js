import React, { Component } from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      visaAddress: 'ASRL8::INSTR',
      hasError: false,
      errorMsg: '',
    };
  }

  handleChange = event => {
    this.setState({
      visaAddress: event.target.value
    });
  }

  connect(visaAddress) {
    console.log('connect to ' + visaAddress);

    axios.post('http://localhost:5000/connect', {
      visaAddress: visaAddress
    })
    .then(response => {
      console.log(response.data.returnValue);
    })
    .catch(error => {
      this.showError(error.toString());
    })
  }

  showError = errorMsg => {
    this.setState({
      hasError: true,
      errorMsg: errorMsg,
    }, () => {
      setTimeout(() => {
        this.setState({
          hasError: false,
          errorMsg: '',
        });
      }, 5000);
    });
  }

  render() {
    return (
      <div className="App">
        {this.state.hasError &&
          <div className="alert alert-danger" role="alert">
            {this.state.errorMsg}
          </div>
        }
        <TextField
          id="visaAddress"
          label="Visa Address"
          value={this.state.visaAddress}
          onChange={this.handleChange}
          margin="normal"
        />
        <Button
          variant="outlined"
          color="primary"
          onClick={() => this.connect(this.state.visaAddress)}
        >
          Connect to {this.state.visaAddress}
        </Button>
      </div>
    );
  }
}

export default App;
