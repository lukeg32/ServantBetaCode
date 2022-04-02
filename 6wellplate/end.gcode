G0 F5000 X177 Y169 Z120

G0 X5 Y182.4 ; present print
;G0 Z100 ; Move print head further up
G0 Z120 ; Move print head further up
M140 S0 ; turn off heatbed
M104 S0 ; turn off temperature
M107 ; turn off fan
M84 X Y E ; disable motors

