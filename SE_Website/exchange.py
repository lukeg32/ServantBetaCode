import argparse
import configparser
import os
import sys
import datetime
import time
import math
import requests
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
    GPIO.cleanup()

    pwmDispense.stop()
    GPIO.output(RIGHT_MOTOR, GPIO.LOW)
    GPIO.cleanup()




# Initialize the gcode directory
if sys.argv[1] == "6":
    pathToFiles = "6wellplate/"
    gcodeFiles = ["startwell1.gcode", "well2.gcode", "well3.gcode", "well4.gcode", "well5.gcode", "well6.gcode", "end.gcode"]
elif sys.argv[1] == "12":
    pathToFiles = "12wellplate/"
    gcodeFiles = ["startwell1.gcode", "well2.gcode", "well3.gcode", "well4.gcode", "well5.gcode", "well6.gcode", "end.gcode"]
else:
    print("Invalid plate size")

# Intialize the OctoPrint caller
caller = api("http://10.144.13.13:88", "4AA2ACB8B0DF46479FCB03F9FDC17A60", verbose=False)

# Test the caller connection
if not caller.connectionTest():
    print("cannot reach server")
if not caller.authTest():
    print("API key issues")

# Connect to the printer
time.sleep(1)
data = {'command': 'connect', 'Content-Type': 'application/json'}
code = caller.post("/api/connection", data)
print("asdf")

if (code == 204):
    print("Connected")
else:
    print("Failed")
    print(code)
time.sleep(1)

# Operate printer
initPWM()
print("Going to the first well")
count = 1
for file in gcodeFiles:
    # Load the gcode file for this leg
    code = caller.selectFile(pathToFiles + file)
    print(pathToFiles + file)
    if code != 204:
        print("Failed to load file " + str(code))
        break

    code = caller.printRequests('start')
    if code != 204:
        print("Failed to start")
        break

    # Wait for motion to finish
    waitingForPrint = True
    while (waitingForPrint):
        state = caller.getState()
        if (state == 'Operational'):
            waitingForPrint = False
        else:
            time.sleep(1)
    count += 1

    # Remove media
    print("Make media removal pump go brrrrr")
    remove(20, 1)
    print("Media removed!")

    # Dispense media
    print("Make media dispensing pump go brrrrr")
    dispense(20, 1)
    print("New media dispensed")



    if (count != 7):
        print("Going to well", count)

# Disconnect from the printer
code = caller.post("/api/connection", {"command": "disconnect"})
if (code != 204):
    print("disconnect")

destroy()
