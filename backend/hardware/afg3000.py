import time
import pyvisa
import visa
import numpy as np


class AFG3252():

    def __init__(self,device, channel=None):
        """
        Provides communication with a HMP2030 power supply
        via USB (virtual COM) or LAN.
        
        Connection Examples:
        
            afg = AFG3262('ASRL11::INSTR')
            afg = AFG3252('TCPIP0::129.69.46.235::inst0::INSTR')
        
        """
        if 'ASRL' in device:
            self.__connect_serial(device)
        else:
            self.__connectLAN(device)


            
        

    def __connect_serial(self, device):
        
        if hasattr(pyvisa,"instrument"): #old visa
            instr=visa.instrument(device)
            instr.timeout=1
        else:
            instr = visa.ResourceManager().open_resource(device)
            instr.timeout=1000
        
        self.instr = instr



    def __connectLAN(self, device):
        """connects to the tektronix function generator"""
        if hasattr(pyvisa,"instrument"): #old visa
            self.__ip = device
            self.__instr = visa.Instrument(self.__ip,term_chars='\n')
            self.__instr.timeout=2
        else:
            self.__ip = device
            rm = visa.ResourceManager()
            self.__instr = rm.open_resource(device) 
            self.__instr.read_termination = '\n'
            self.__instr.write_termination = '\n'
            self.__instr.timeout=2000
        self.__instr.chunk_size=4096         

    
    def identification(self):
        """asks for identification information"""
        idn = self.__instr.ask('*IDN?')
        return idn

    def check_ch(self,ch):
        """checks the channel number"""
        if ch in [1,2]:
            return ch
        else:
            raise ValueError('Wrong channel number. Chose 1 or 2.')
    
    
    def get_amp(self, ch=1):
        """asks for amplitude Vpp"""
        self.check_ch(ch)
        get_amp = self.__instr.ask('source{0:d}:voltage?'.format(ch))
        return get_amp

    def set_amp(self,voltage, ch=1):
        """sets amplitude to a desired value Vpp"""
        self.check_ch(ch)
        if voltage<=0:
            raise ValueError('The selected amplitude must be greater than zero.')
        if voltage is None:
            raise ValueError('No voltage value selected.')
        if voltage>5:
            raise ValueError('The selected amplitude is too high: max amplitude: 5Vpp.')
        else:
            set_amp = self.__instr.write('source{0:d}:voltage {1:1.5f}'.format(ch,voltage))


    def get_freq(self, ch=1):
        """asks for selected frequency of the desired channel"""
        self.check_ch(ch)
        get_freq = self.__instr.ask('source{0:d}:frequency?'.format(ch))
        return get_freq

    def set_freq(self,frequency, ch=1):
        """sets frequency to a desired value in Hz"""
        self.check_ch(ch)
        if frequency<=0:
            raise ValueError('The selected frequency must be greater than zero. Or maybe you are just dumb!')
        if frequency>240E6:
            raise ValueError('The selected frequency is too high, max frequrency: 240MHz. Or maybe you are just dumb!')
        else:
            set_freq = self.__instr.write('source{0:d}:frequency {1:1.5f}'.format(ch,frequency))


    def get_offset(self, ch=1):
        """asks for selected offset in volts of the desired channel"""
        self.check_ch(ch)
        get_offset = self.__instr.ask('source{0:d}:voltage:offset?'.format(ch))
        return get_offset

    def set_offset(self,offset, ch=1):
        """sets offset to a desired value in volts"""
        self.check_ch(ch)
        if offset+float(self.get_amp())/2>2.5:
            raise ValueError('The selected offset is too high. Or maybe you are just dumb!')
        else:
            set_offset = self.__instr.write('source{0:d}:voltage:offset {1:1.5f}'.format(ch,offset))


    def run(self, ch=1):
        """turns output on"""
        self.check_ch(ch)
        self.__instr.write('output{0:d}:state ON'.format(ch))
        
    def stop(self, ch=1):
        """turns output off"""
        self.check_ch(ch)
        self.__instr.write('output{0:d}:state OFF'.format(ch))        

    def ask_run(self, ch=1):
        """asks wheather output is on or off"""
        self.check_ch(ch)
        run = self.__instr.ask('output{0:d}?'.format(ch))
        return run

    def set_waveform(self, func="SIN", ch=1):
        "sets the output waveform: select form the following arguments: SINusoid, SQUare, PULSe,"
        " RAMP, PRNoise, DC, SINC," 
        "GAUSsian, LORentz, ERISe, EDECay, HAVersine,..."
        self.check_ch(ch)
        self.__instr.write('SOUR{0:d}:FUNC:SHAP {1:s}'.format(ch,func))

    def get_waveform(self, ch=1):
        "asks for the output waveform"
        self.check_ch(ch)
        run = self.__instr.ask('SOUR{0:d}:FUNC:SHAP?'.format(ch))
        return run

    def trig(self):
        "generates a trigger event"
        self.__instr.write("*TRG")

    def trig_source(self, mode='TIM'):
        "Sets the trigger source for an external trigger signal"
        self.__instr.write('TRIG:SOUR {0:s}'.format(mode))

    def init_trig(self):
        self.__instr.write("ABOR")

    def trig_mode(self, mode="TRIG"):
        "sets output channel for Tigger Out"
        self.__instr.write('OUTP:TRIG:MODE {0:s}'.format(mode))

    def get_trig_mode(self):
        "sets output channel for Tigger Out"
        return self.__instr.ask('OUTP:TRIG:MODE?')        


    def phase(self, deg="0", ch=1):
        self.check_ch(ch)
        self.__instr.write("SOUR:PHASE:ADJUST {0:s}DEG".format(deg))


####### AM modulation ##########

    def set_AMmod_state(self, arg="ON", ch=1):
        "enables or disables AM modulation. Use ON or OFF as argument"
        self.check_ch(ch)
        self.__instr.write('SOUR{0:d}:AM:STAT {1:s}'.format(ch, arg))

    def set_AMmod_internal(self, func="INT", ch=1):
        "sets the source of modulating signal of AM modulation. Select INTernal or EXTernal"
        self.check_ch(ch)
        self.__instr.write('SOUR{0:d}:AM:SOUR {1:s}'.format(ch,func))

    def set_AMmod_waveform(self, func="RAMP", ch=1):
        "sets the internal modulation waveform: select form the following arguments: "
        "SINusoid, SQUare, TRI, RAMP, PRNoise"
        "be sure you already set the source as internal with set_AMmod_internal()"
        self.check_ch(ch)
        self.__instr.write('SOUR{0:d}:AM:INT:FUNC {1:s}'.format(ch,func))

    def set_AMmod_freq(self, freq=10, ch=1):
        "sets the internal modulation frequency"
        self.check_ch(ch)
        self.__instr.write('SOUR{0:d}:AM:INT:FREQ {1:.1f}Hz'.format(ch, freq))

    def set_AMmod_depth(self, depth=50, ch=1):
        "sets the modulation depth."
        self.check_ch(ch)
        self.__instr.write('SOUR{0:d}:AM:DEPT {1:.1f}'.format(ch, depth))

#### FM modulation ########


    def set_FMmod_state(self, arg="ON", ch=1):
        "enables or disables FM modulation. Use ON or OFF as argument"
        self.check_ch(ch)
        self.__instr.write('SOUR{0:d}:FM:STAT {1:s}'.format(ch, arg))

    def set_FMmod_internal(self, func="INT", ch=1):
        "sets the source of modulating signal of FM modulation. Select INTernal or EXTernal"
        self.check_ch(ch)
        self.__instr.write('SOUR{0:d}:FM:SOUR {1:s}'.format(ch,func))

    def set_FMmod_waveform(self, func="RAMP", ch=1):
        "sets the internal modulation waveform: select form the following arguments: SINusoid, SQUare, TRI, RAMP, PRNoise"
        self.check_ch(ch)
        self.__instr.write('SOUR{0:d}:FM:INT:FUNC {1:s}'.format(ch,func))

    def set_FMmod_freq(self, freq=10, ch=1):
        "sets the internal modulation frequency"
        self.check_ch(ch)
        self.__instr.write('SOUR{0:d}:FM:INT:FREQ {1:.1f}Hz'.format(ch, freq))

    def set_FMmod_deviation(self, dev=300, ch=1):
        "sets the deviation of the center frequency in Frequency modulation mode"
        self.check_ch(ch)
        self.__instr.write('SOUR{0:d}:FM:DEV {1:.1f}Hz'.format(ch,dev))


################### burst ##############

    def burst_state(self, state='ON', ch=1):
        "enables or disables the burst mode for the specified channel"
        self.check_ch(ch)
        self.__instr.write('SOUR{0:d}:BURS:STAT {1:s}'. format(ch, state))

    def burst_mode(self, mode='TRIG', ch=1):
        "sets the burst mode for the specified channel"
        self.check_ch(ch)
        self.__instr.write('SOUR{0:d}:BURS:MODE {1:s}'. format(ch, mode))


    def burst_cycles(self, cycles=1, ch=1):
        "sets the number of cycles to be output in burst mode for the specified channel"
        self.check_ch(ch)
        self.__instr.write('SOR{0:d}:BURS:NCYC {1:d}'.format(ch, cycles))

############ sweep ##############

    def set_frequency_mode(self, mode='CW', ch=1):
        'sets the frequency sweep state. Select either CW, FIXed or SWEep'
        self.check_ch(ch)
        self.__instr.write('SOUR{0:d}:FREQ:MODE {1:s}'. format(ch, mode))

    def set_frequency_sweep_span(self, span=100, ch=1):
        'sets the frequency span in sweep mode'
        self.check_ch(ch)
        self.__instr.write('SOUR{0:d}:FREQ:SPAN {1:0.3f}Hz'. format(ch, span))

    def set_center_frequency(self, center=5E3, ch=1):
        'sets the center frequency in sweep mode'
        self.check_ch(ch)
        self.__instr.write('SOUR{0:d}:FREQ:CENT {1:0.3f}Hz'. format(ch, center))

    def set_sweep_mode(self, mode='MAN', ch=1):
        "sets the sweep mode trigger. Select either AUTO or MANual"
        self.check_ch(ch)
        self.__instr.write("SOUR{0:d}:SWE:MODE {1:s}".format(ch, mode))

    def set_sweep_time(self, time=1, ch=1):
        "sets the sweep time of the sweep in seconds. The sweep time does not include hold time"
        "and return time"
        self.check_ch(ch)
        self.__instr.write("SOUR{0:d}:SWE:TIME {1:0.3f}".format(ch, time))

    def set_sweep_rtime(self, rtime=1, ch=1):
        "sets the return time of the sweep in seconds"
        self.check_ch(ch)
        self.__instr.write("SOUR{0:d}:SWE:RTIM {1:0.3f}".format(ch, rtime))

    def set_sweep_htime(self, htime=0, ch=1):
        "sets the hold time of the sweep in seconds"
        self.check_ch(ch)
        self.__instr.write("SOUR{0:d}:SWE:HTIM {1:0.3f}".format(ch, htime))

    def set_sweep_form(self, form="LIN", ch=1):
        "selects LINear or LOGarithmic spacing for the sweep"
        self.check_ch(ch)
        self.__instr.write("SOUR{0:d}:SWE:SPAC {1:s}".format(ch, form))


