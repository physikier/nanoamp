from flask import Flask, request
from HardwareBoard import HardwareBoard

app = Flask(__name__, static_folder='frontend/build', static_url_path='')
devices = [
		'ASRL8::INSTR',
		'ASRL10::INSTR'
	]

@app.route("/connect", methods=['POST'])
def connect():
    visa_address = request.get_json()['visaAddress']
    hardware_board = HardwareBoard(visa_address=visa_address)
    return_value = hardware_board.connect()
    if return_value >= 0:
        return '{"returnValue": 0}'
    else:
        return '{"returnValue": ' + return_value + '}'

if __name__ == "__main__":
    app.run()