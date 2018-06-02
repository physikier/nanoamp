from flask import Flask, request, jsonify, abort
from HardwareBoard import HardwareBoard

app = Flask(__name__, static_folder='frontend/build', static_url_path='')
hardware_boards = {}

default_devices = {
    'ASRL8::INSTR': 'Left coil X',
    'ASRL10::INSTR': 'Right coil X',
    'ASRL12::INSTR': 'Left coil Y',
    'ASRL14::INSTR': 'Right coil Y',
    'ASRL16::INSTR': 'Left coil Z',
    'ASRL18::INSTR': 'Right coil Z',
}

@app.route("/get-default-devices", methods=['GET'])
def get_default_devices():
    return jsonify(default_devices)

@app.route("/connect", methods=['POST'])
def connect():
    visa_address = request.get_json()['visaAddress']
    hardware_board = HardwareBoard(visa_address=visa_address)
    hardware_board.connect()
    if hardware_board.is_connected():
        hardware_boards[visa_address] = hardware_board
        return jsonify({ 'visaAddress': visa_address })
    else:
        return 'Invalid visa address', 400

@app.route("/disconnect", methods=['POST'])
def disconnect():
    visa_address = request.get_json()['visaAddress']
    hardware_board = hardware_boards[visa_address]
    if hardware_board:
        hardware_board.disconnect()
        del hardware_board[visa_address]
        return jsonify({ 'visaAddress': visa_address })
    else:
        return 'Could not find hardware board for visa address ' + visa_address, 400

if __name__ == "__main__":
    app.run()