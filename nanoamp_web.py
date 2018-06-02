from flask import Flask, request, jsonify, abort
from HardwareBoard import HardwareBoard

app = Flask(__name__, static_folder='frontend/build', static_url_path='')
hardware_boards = {}

default_device_names = {
    'ASRL8::INSTR': 'Left coil X',
    'ASRL10::INSTR': 'Right coil X',
    'ASRL12::INSTR': 'Left coil Y',
    'ASRL14::INSTR': 'Right coil Y',
    'ASRL16::INSTR': 'Left coil Z',
    'ASRL18::INSTR': 'Right coil Z',
}

@app.route("/get-default-device-names", methods=['GET'])
def get_default_device_names():
    return jsonify(default_device_names)

@app.route("/get-devices", methods=['GET'])
def get_devices():
    devices = []
    for hardware in hardware_boards.values():
        device = {}
        device['address'] = hardware.get_visa_address()
        device['name'] = hardware.get_name()
        device['connected'] = hardware.is_connected()
        devices.append(device)
    return jsonify(devices)

@app.route("/add-device", methods=['POST'])
def add_device():
    visa_address = request.get_json().get('address')
    if hardware_boards.get(visa_address):
        return 'Address ' + visa_address + ' already registered', 400

    name = request.get_json().get('name')
    hardware_board = HardwareBoard(visa_address=visa_address, name=name)
    hardware_boards[visa_address] = hardware_board
    return jsonify({ 'address': visa_address })

@app.route("/remove-device", methods=['POST'])
def remove_device():
    visa_address = request.get_json().get('address')
    if not hardware_boards.get(visa_address):
        return 'No device with this address ' + visa_address, 400

    del hardware_boards[visa_address]
    return jsonify({ 'address': visa_address })

@app.route("/connect", methods=['POST'])
def connect():
    visa_address = request.get_json().get('address')
    hardware_board = hardware_boards.get(visa_address)
    if not hardware_board:
        return 'No device with this address ' + visa_address, 400

    hardware_board.connect()
    if hardware_board.is_connected():
        return jsonify({ 'address': visa_address })
    else:
        return 'Invalid visa address', 400

@app.route("/disconnect", methods=['POST'])
def disconnect():
    visa_address = request.get_json().get('address')
    hardware_board = hardware_boards.get(visa_address)
    if hardware_board:
        hardware_board.disconnect()
        return jsonify({ 'address': visa_address })
    else:
        return 'No device with this address ' + visa_address, 400

if __name__ == "__main__":
    app.run()