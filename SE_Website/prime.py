import argparse
import configparser
import os
import sys
import datetime
import time
import math
import requests
import subprocess
import RPi.GPIO as GPIO
from termcolor import colored
from octoprint_cli import __version__
from octoprint_cli.api import api

# Motor
LEFT_MOTOR = 16
RIGHT_MOTOR = 18

def initPWM():
    global pwmDispense
    global pwmRemoval
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(LEFT_MOTOR, GPIO.OUT)
    GPIO.output(LEFT_MOTOR, GPIO.HIGH)
    pwmRemoval = GPIO.PWM(LEFT_MOTOR, 1000) # Set Frequency to 1 KHz
    pwmRemoval.start(100) # Set the starting Duty Cycle

    GPIO.setup(RIGHT_MOTOR, GPIO.OUT)
    GPIO.output(RIGHT_MOTOR, GPIO.HIGH)
    pwmDispense = GPIO.PWM(RIGHT_MOTOR, 1000) # Set Frequency to 1 KHz
    pwmDispense.start(100) # Set the starting Duty Cycle

def remove(speed, delay):
    pwmRemoval.ChangeDutyCycle(speed)
    time.sleep(delay)
    pwmRemoval.ChangeDutyCycle(100)

def dispense(speed, delay):
    pwmDispense.ChangeDutyCycle(speed)
    time.sleep(delay)
    pwmDispense.ChangeDutyCycle(100)

# might have a major bug
def destroy():
    pwmRemoval.stop()
    GPIO.output(LEFT_MOTOR, GPIO.LOW)

    pwmDispense.stop()
    GPIO.output(RIGHT_MOTOR, GPIO.LOW)
    GPIO.cleanup()


if __name__ == '__main__':
    initPWM()
    try:
        dispense(20, 5)
    except:
        destroy()
        subprocess.run(["./bashGPIO.sh"])
