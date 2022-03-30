import argparse
import configparser
import os
import sys
import datetime
import time
import math
import requests
from termcolor import colored
from octoprint_cli import __version__
from octoprint_cli.api import api

# Initialize the gcode directory
if sys.argv[1] == "6":
    pathToFiles = "/home/pi/ServantBetaCode/6wellplate/"
    gcodeFiles = ["startwell1.gcode", "well2.gcode", "well3.gcode", "well4.gcode", "well5.gcode", "well6.gcode", "end.gcode"]
elif sys.argv[1] == "12":
    pathToFiles = "/home/pi/ServantBetaCode/12wellplate/"
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

if (code == 204):
    print("Connected")
else:
    print("Failed")
    print(code)
time.sleep(1)

# Operate printer
print("Going to the first well")
count = 1
for file in gcodeFiles:
    # Load the gcode file for this leg
    code = caller.selectFile(pathToFiles + file)
    print(pathToFiles + file)
    if code != 204:
        print("Failed to load file" + str(code))

    code = caller.printRequests('start')
    if code != 204:
        print("Failed to start")

    # Wait for motion to finish
#    waitingForPrint = True
#    while (waitingForPrint):
#        state = caller.getState()
#        if (state == 'Operational'):
#            waitingForPrint = False
#        else:
#            time.sleep(1)
    count += 1

    # Remove media
    print("Make media removal pump go brrrrr")
    time.sleep(3)
    print("Media removed!")

    # Dispense media
    print("Make media dispensing pump go brrrrr")
    time.sleep(3)
    print("New media dispensed")

    if (count != 7):
        print("Going to well", count)

# Disconnect from the printer
code = caller.post("/api/connection", {"command": "disconnect"})
if (code != 204):
    print("disconnect")
