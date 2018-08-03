from hardware.arduino_leonardo import ArduinoLeonardo

class HardwareBoard():
	def __init__(self, visa_address, name):
		self.visa_address = visa_address
		self.name = name or ''

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
	
	def is_connected(self):
		if hasattr(self, 'hardware') and self.hardware.is_connected():
			return True
		else:
			return False

	def get_hardware(self):
		return self.hardware

	def get_visa_address(self):
		return self.visa_address
	
	def get_name(self):
		return self.name
	
	def set_name(self, name):
		self.name = name or ''
	
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