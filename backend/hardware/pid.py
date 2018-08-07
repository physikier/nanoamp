import time
import serial
import visa


class PIDController():

	 # --------------------------------------------------------------------------
	def __init__(self, visa_address='ASRL12::INSTR'):
		self.visa_address = visa_address
		if hasattr(visa,'instrument'):
			self.instr = visa.instrument(self.visa_address)
		else:
			self.instr = visa.ResourceManager().open_resource(self.visa_address)
		# self.instr.timeout=50000
		self.instr.read_termination = '\r\n'

		

	# --------------------------------------------------------------------------
	def __del__(self):
		if hasattr(self,"instr"):
			self.instr.close()

	# --------------------------------------------------------------------------
	def disconnect(self):
		if hasattr(self, "instr"):
			self.instr.close()
			try:
				hasattr(self.instr, 'session')
				return False
			except:
				return True
	
	# --------------------------------------------------------------------------
	def _write(self, string):
		try: # if the connection is already open, this will work
			self.instr.write(string)
		except: # else we attempt to open the connection and try again
			try: # silently ignore possible exceptions raised by del
				# self.disconnect()
				del self.instr
			except Exception:
				pass
			self.instr = visa.instrument(self.visa_address)
			self.instr.write(string)

	# --------------------------------------------------------------------------
	def _read(self, string):
		try:
			val = self.instr.query(string)
		except:
			self.instr = visa.instrument(self.visa_address)
			val = self.instr.query(string)
		return val

	# --------------------------------------------------------------------------
	# command implementation
	# --------------------------------------------------------------------------


	def getOutput(self):
		return self._read("OMON?")

	def getMeasureInput(self):
		return self._read("MMON?")