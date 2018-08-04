import time
import serial
import visa


class ArduinoLeonardo():
	 # --------------------------------------------------------------------------
	def __init__(self, visa_address='ASRL10::INSTR'):
		self.visa_address = visa_address
		if hasattr(visa, 'instrument'):
			self.instr = visa.instrument(self.visa_address)
		else:
			self.instr = visa.ResourceManager().open_resource(self.visa_address)
		# self.instr.timeout=50000
		self.instr.read_termination = '\n'

	# --------------------------------------------------------------------------
	def __del__(self):
		if hasattr(self, 'instr'):
			self.instr.close()

	def is_connected(self):
		try:
			session = self.instr.session
			return True
		except:
			return False
	
	def get_session(self):
		try:
			session = self.instr.session
			return session
		except:
			return None

	# --------------------------------------------------------------------------
	def disconnect(self):
		if hasattr(self, 'instr'):
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

	# reset device

	def resetDevice(self):
		return self._read(':SYSTEM:ERR?')

	def deleteErrors(self):
		for i in range(0,20):
			self.resetDevice()

	# :SYSTem: branch

	def getIDN(self):
		return self._read('*IDN?')
		
	def getError(self):
		return self._read(':SYSTEM:ERR?')
	
	# :CURRent: branch	

	def getCurrLevel(self):
		return self._read(':CURR:LEV?')

	def setCurrLevel(self, curr, unit): # units: mA, uA, nA
		cmd = ':CURR:LEV ' + str(curr) + unit
		self._write(cmd)

	def getCurrRange(self):
		return self._read(':CURR:RANG?')

	def setCurrRange(self, mode): # modes: 0 (0...10 mA, res: 76 nA), 2 (-20...20 mA, res: 153 nA), 4 (-10...10 mA, res: 76 nA)
		cmd = ':CURR:RANG ' + str(mode)
		self._write(cmd)

	def getCurrSpan(self):
		return self._read(':CURR:SPAN?')

	def setCurrSpan(self, curr, unit): # units: mA, uA, nA
		cmd = ':CURR:SPAN ' + str(curr) + unit
		self._write(cmd)

	def getCurrCenter(self):
		return self._read(':CURR:CENT?')

	def setCurrCenter(self, curr, unit): # units: mA, uA, nA
		cmd = ':CURR:CENT ' + str(curr) + unit
		self._write(cmd)

	def getCurrStart(self):
		return self._read(':CURR:STAR?')

	def setCurrStart(self, curr, unit): # units: mA, uA, nA
		cmd = ':CURR:STAR ' + str(curr) + unit
		self._write(cmd)

	def getCurrStop(self):
		return self._read(':CURR:STOP?')

	def setCurrStop(self, curr, unit): # units: mA, uA, nA
		cmd = ':CURR:STOP ' + str(curr) + unit
		self._write(cmd)

	# :SWEep: branch

	def getSweepMode(self):
		return self._read(':SWE:MOD?')

	def setSweepMode(self, mode): # modes: AUTO, MAN, STEP --> refer to manual
		cmd = ':SWE:MOD ' + mode
		self._write(cmd)

	def getContSweep(self):
		return self._read(':SWE:CONT?')

	def setContSweep(self, val): # val: ON, OFF
		cmd = ':SWE:CONT ' + val
		self._write(cmd)

	def getSweepDir(self):
		return self._read(':SWE:DIR?')

	def setSweepDir(self, val): # val: UP, DOWN
		cmd = ':SWE:DIR ' + val
		self._write(cmd)

	def getSweepTime(self):
		return self._read(':SWE:TIME?')

	def setSweepTime(self, time, unit): # units: s, ms, us
		cmd = ':SWE:TIME' + str(time) + unit
		self._write(cmd)
	def getSweepStep(self):
		return self._read(':SWE:STEP?')

	def setSweepStep(self, curr, unit): # units: mA, uA, nA
		cmd = ':SWE:STEP ' + str(curr) + unit
		self._write(cmd)

	def getSweepPoints(self):
		return self._read(':SWE:POIN?')

	def setSweepPoints(self, points): # units: mA, uA, nA
		cmd = ':SWE:POIN ' + str(points)

	def startSweep(self):
		self._write(':SWE:RUN ON')

	def stopSweep(self):
		self._write(':SWE:RUN OFF')

	def sweeping(self):
		return self._read(':SWE:RUN?')
