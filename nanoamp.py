import sys
from PyQt5 import QtCore, QtGui, QtWidgets, uic
from hardware.arduino_leonardo import ArduinoLeonardo


#Class contains all QT Widgets
class NanoAmp(QtWidgets.QMainWindow):
	hardware_boards = {}
	devices = [
		'ASRL8::INSTR',
		'ASRL10::INSTR'
	]

	def __init__(self):
		super(NanoAmp, self).__init__()
		uic.loadUi("./ui/nanoamp.ui", self)
		self.MainWindow = QtWidgets.QMainWindow(self)
		self.connect_ui_elements()
		self.create_radio_dicts()
		self.show()
	
	def create_radio_dicts(self):
		self.radio_groups
		for i in range(len(self.devices)):
			radio_dict = {
				'mA': getattr(self, 'rbtn_unit_ma_src_' + str(i)),
				'uA': getattr(self, 'rbtn_unit_ua_src_' + str(i)),
				'nA': getattr(self, 'rbtn_unit_na_src_' + str(i))
			}
			self.radio_groups.append(radio_dict)

	def connect_ui_elements(self):

		#Closures
		def connect_button_action(device_number):
			return lambda: self.connect_hardware(self.get_hardware_board(device_number))

		def disconnect_button_action(device_number):
			return lambda: self.disconnect_hardware(self.get_hardware_board(device_number))

		def idn_button_action(device_number):
			return lambda: self.print_to_text_browser(self.get_hardware_board(device_number).get_idn_info())

		def error_button_action(device_number):
			return lambda: self.print_to_text_browser(self.get_hardware_board(device_number).get_error())

		def reset_button_action(device_number):
			return lambda: self.get_hardware_board(device_number).reset_button_action()

		def get_current_level_button_action(device_number):
			return lambda: self.print_to_text_browser(self.get_hardware_board(device_number).get_current_level())

		def set_current_level_spinbox_action(device_number):
			return lambda: self.set_current_level(device_number)

		def set_stepsize_spinbox_action(device_number):
			return lambda: self.set_current_stepsize(device_number)

		for i in range(len(self.devices)):
			self.hardware_boards[self.devices[i]] = self.initiate_hardware_connection(visa_address=self.devices[i])
			#Buttons:
			getattr(self, 'btn_connect_src_' + str(i)).clicked.connect(connect_button_action(i))
			getattr(self, 'btn_disconnect_src_' + str(i)).clicked.connect(disconnect_button_action(i))
			getattr(self, 'btn_idn_src_' + str(i)).clicked.connect(idn_button_action(i))
			getattr(self, 'btn_error_src_' + str(i)).clicked.connect(error_button_action(i))
			getattr(self, 'btn_reset_src_' + str(i)).clicked.connect(reset_button_action)
			getattr(self, 'btn_current_level_src_' + str(i)).clicked.connect(get_current_level_button_action(i))
			getattr(self, 'spinBox_current_level_src_' + str(i)).valueChanged.connect(set_current_level_spinbox_action(i))
			getattr(self, 'spinBox_stepsize_src_' + str(i)).valueChanged.connect(set_stepsize_spinbox_action(i))
			getattr(self, 'rbtn_unit_ua_src_' + str(i))

	def __del__(self):
		for hardware_board in self.hardware_boards.values():
			hardware_board.disconnect()

	def get_hardware_board(self, device_number):
		return self.hardware_boards[self.devices[device_number]]

	def print_to_text_browser(self, value):
		self.textBrowser_src_1.append(value)

	def initiate_hardware_connection(self, visa_address):
		hardware_board = HardwareBoard(visa_address=visa_address)
		return hardware_board

	def connect_hardware(self, hardware_board):
		hardware = hardware_board.connect()
		if hardware:
			self.set_status_led(self.get_sender_number(), 'on')
			self.print_to_text_browser('successfully connected device: ' + hardware_board.get_visa_address())
		else:
			self.print_to_text_browser('could not connect device: ' + hardware_board.get_visa_address())

	def disconnect_hardware(self, hardware_board):
		if hardware_board.disconnect():
			self.set_status_led(self.get_sender_number(), 'off')
			self.print_to_text_browser('successfully diconnected device: ' + hardware_board.get_visa_address())
		else:
			self.print_to_text_browser('could not disconnect device: ' + hardware_board.get_visa_address())

	def set_status_led(self, device_number, stat):
		if stat == 'on':
			green = QtGui.QPixmap("img/green_dot.png")
			getattr(self, 'label_status_src_' + str(device_number)).setPixmap(green)
		elif stat == 'off':
			red = QtGui.QPixmap("img/red_dot.png")
			getattr(self, 'label_status_src_' + str(device_number)).setPixmap(red)

	def get_current_units(self, device_number):
		try:
			if getattr(self, 'rbtn_unit_ma_src_' + str(device_number)).isChecked():
				return 'mA'
			elif getattr(self, 'rbtn_unit_ua_src_' + str(device_number)).isChecked():
				return 'uA'
			elif getattr(self, 'rbtn_unit_na_src_' + str(device_number)).isChecked():
				return 'nA'
		except:
			self.print_to_text_browser('no unit selected')
	
	# def set_current_level_acording_to_unit(self, device_number):
	# 	if getattr(self, 'rbtn_unit_ma_src_' + str(device_number)).isChecked():
	# 		unit = 'mA'
	# 	elif getattr(self, 'rbtn_unit_ua_src_' + str(device_number)).isChecked():
	# 		unit = 'uA'
	# 	elif getattr(self, 'rbtn_unit_na_src_' + str(device_number)).isChecked():
	# 		unit = 'nA'



	def set_current_level(self, device_number):
		unit = self.get_current_units(device_number)
		value = getattr(self, 'spinBox_current_level_src_' + str(device_number)).value()
		self.get_hardware_board(device_number).set_current_level(value, unit)
	
	def set_current_stepsize(self, device_number):
		step = getattr(self, 'spinBox_stepsize_src_' + str(device_number)).value()
		getattr(self, 'spinBox_current_level_src_' + str(device_number)).setSingleStep(int(step))
	
	def get_sender_number(self):
		sender_name = self.sender().objectName()
		sender_number = int(sender_name.split('_').pop())
		return sender_number


class HardwareBoard():
	def __init__(self, visa_address):
		self.visa_address = visa_address

	def connect(self):
		try:
			self.hardware =  ArduinoLeonardo(self.visa_address)
			return self.hardware
		except:
			return None

	def disconnect(self):
		if hasattr(self, 'hardware'):
			return self.hardware.disconnect()
		else:
			return True

	def get_hardware(self):
		return self.hardware

	def get_visa_address(self):
		return self.visa_address
	
	def get_idn_info(self):
		try:
			return self.hardware.getIDN()
		except:
			return self.error_handling_function()
	
	def reset(self):
		try:
			return self.hardware.resetDevice()
		except:
			return self.error_handling_function()

	def get_error(self):
		try:
			return self.hardware.getError()
		except:
			return self.error_handling_function()

	def get_current_level(self):
		try:
			return self.hardware.getCurrLevel()
		except:
			return self.error_handling_function()

	def set_current_level(self, current_level, unit):
		try:
			return self.hardware.setCurrLevel(current_level, unit)
		except:
			return self.error_handling_function()

	def error_handling_function(self):
		return 'not feasible ! --> please check hardware connection'

def main():
	app = QtWidgets.QApplication(sys.argv)
	NanoAmp()
	sys.exit(app.exec())

if __name__ == '__main__':
	main()
