#!/bin/bash

# create memmory mapped files
echo 23 > /sys/class/gpio/export
echo 24 > /sys/class/gpio/export

# make the direction and out put
echo out > /sys/class/gpio/gpio23/direction
echo out > /sys/class/gpio/gpio24/direction

# set the value to on
echo 1 > /sys/class/gpio/gpio23/value
echo 1 > /sys/class/gpio/gpio24/value
