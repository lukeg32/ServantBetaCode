
import RPi.GPIO as GPIO
from time import sleep

PWMPin = 23

GPIO.setwarnings(False)         #disable warnings
GPIO.setmode(GPIO.BOARD)        #set pin numbering system
GPIO.setup(PWMPin,GPIO.OUT)

pi_pwm = GPIO.PWM(PWMPin,1000)      #create PWM instance with frequency
pi_pwm.start(0)             #start PWM of required Duty Cycle 
pi_pwm.ChangeDutyCycle(10)
sleep(1000)
#while True:
    #for duty in range(70,101,1):
        #pi_pwm.ChangeDutyCycle(duty) #provide duty cycle in the range 0-100
        #sleep(0.05)
    #sleep(0.5)
                 #
    #for duty in range(100,70,-1):
        #pi_pwm.ChangeDutyCycle(duty)
        ##sleep(0.05)
    #sleep(0.5)
                           
        
if  __name__ == '__main__':
    setup()
    try:
        loop()
    excep KeyboardInterrupt:
        destroy()
