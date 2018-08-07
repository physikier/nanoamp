#!/usr/bin/env python3

from flask import Flask, request, jsonify
from flask_cors import CORS

from HardwareBoard import HardwareBoard

import threading
from time import sleep
import websockets
import asyncio

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

default_calibrator_device_names = {
    'TCPIP0::129.69.46.235::inst0::INSTR': 'Tektronix AFG3252',
    'ASRL3::INSTR' : 'SRS PID SIM960'
}

@app.route("/get-default-device-names", methods=['GET'])
def get_default_device_names():
    return jsonify(default_device_names)

@app.route("/get_default-calibrator-device-names", methods=['GET'])
def get_default_calibrator_device_names():
    return jsonify(default_calibrator_device_names)

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


class SocketTest(object):
    def __init__(self, interval=1):
        self.interval = interval
        thread = threading.Thread(target=self.run, args=())
        thread.daemon = True
        thread.start()
    
    async def echo(websocket, path):
        async for message in websocket:
            await websocket.send(message)

    def run(self):
        asyncio.get_event_loop().run_until_complete(
            websockets.serve(self.echo, 'localhost', 8765))
        asyncio.get_event_loop().run_forever()

        for i in range(10):
            print(f'emit socket sample data: {i + 1}')
            socket_io.emit('chart_data', { 'number': 42 })
            sleep(self.interval)


@app.route("/connect", methods=['POST'])
def connect():
    visa_address = request.get_json().get('address')
    hardware_board = hardware_boards.get(visa_address)
    if not hardware_board:
        return 'No device with this address ' + visa_address, 400

    instance = SocketTest(1)
    print('i was here')

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


if __name__ == '__main__':
    CORS(app)
    app.run(debug=True)
