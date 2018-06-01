from flask import Flask, render_template, send_from_directory
from HardwareBoard import HardwareBoard

app = Flask(__name__, static_folder='templates/static', static_url_path='')
devices = [
		'ASRL8::INSTR',
		'ASRL10::INSTR'
	]

@app.route("/")
def main():
    return render_template('index.html')

@app.route("/connect", methods=['POST'])
def connect(visa_address):
    hardware_board = HardwareBoard(visa_address=visa_address)
    hardware_board.connect()
    # hardware_board = HardwareBoard(visa_address='ASRL10::INSTR')
    # hardware_board.connect()
    return 'successfully connected'

if __name__ == "__main__":
    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run()