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
import subprocess



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
    GPIO.output(LEFT_MOTOR, GPIO.HIGH)

    pwmDispense.stop()
    GPIO.output(RIGHT_MOTOR, GPIO.HIGH)
    GPIO.cleanup()


def run_program():
    # Initialize the gcode directory
    if sys.argv[1] == "6":
        pathToFiles = "6wellplate/"
        gcodeFiles = ["startwell1.gcode", "well2.gcode", "well3.gcode", "well4.gcode", "well5.gcode", "well6.gcode", "end.gcode"]
    elif sys.argv[1] == "12":
        pathToFiles = "12wellplate/"
        gcodeFiles = ["startwell1.gcode", "well2.gcode", "well3.gcode", "well4.gcode", "well5.gcode", "well6.gcode", "well7.gcode", 'well8.gcode', 'well9.gcode', 'well10.gcode', 'well11.gcode', 'well12.gcode', "end.gcode"]
    else:
        print("Invalid plate size")

    # Initialize mode flags
    if sys.argv[2] == "full":
        dispense_flag = 1
        remove_flag = 1
    elif sys.argv[2] == "dispense":
        dispense_flag = 1
        remove_flag = 0
    elif sys.argv[2] == "remove":
        dispense_flag = 0
        remove_flag = 1

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
    print("Running in " + sys.argv[2] + "mode on a " + sys.argv[1] + "-well plate")

    if (code == 204):
        print("Connected")
    else:
        print("Failed")
        print(code)
    time.sleep(1)

    # Operate printer
    #initPWM()
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

        if (file != "end.gcode"):
            print("Going to well", count)

            # Remove media
            if remove_flag:
                print("Make media removal pump go brrrrr")
                remove(20, 5)
                print("Media removed!")

            # Dispense media
            if dispense_flag:
                print("Make media dispensing pump go brrrrr")
                dispense(55, 4.5)
                print("New media dispensed")



    # Disconnect from the printer
    code = caller.post("/api/connection", {"command": "disconnect"})
    if (code != 204):
        print("disconnect")

    destroy()
    subprocess.run(["./bashGPIO.sh"])

#destroy()
if __name__ == '__main__':
    initPWM()
    try:
        run_program()
    except:
        destroy()
        subprocess.run(["./bashGPIO.sh"])
