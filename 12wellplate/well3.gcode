;M201 X500 Y500 Z50 E5000 ; sets maximum accelerations, mm/sec^2
;M203 X500 Y500 Z10 E60 ; sets maximum feedrates, mm/sec
;M204 P500 R1000 T500 ; sets acceleration (P, T) and retract acceleration (R), mm/sec^2
;M205 X8.00 Y8.00 Z0.40 E5.00 ; sets the jerk limits, mm/sec
;M205 S0 T0 ; sets the minimum extruding and travel feed rate, mm/sec
;M107
;G90 ; use absolute coordinates
;G28 ; home all axis
;G92 E0
;;G92 E0
;;G92 E0
;G21 ; set units to millimeters
;
;G0 X50 Y50 Z50
;G0 Z25
;G4 S1 ;wait
;G0 Z50

;G0 X100 Y50
;G0 Z25
G4 S1 ;wait
G0 Z50

G0 X50 Y100 Z50
G0 Z25
;G4 S1 ;wait
;G0 Z50
;
;G0 X100 Y100
;G0 Z25
;G4 S1 ;wait
;G0 Z50
;
;G0 X50 Y150 Z50
;G0 Z25
;G4 S1 ;wait
;G0 Z50
;
;G0 X100 Y150
;G0 Z25
;G4 S1 ;wait
;G0 Z50
;
;
;G0 Z32 ; Move print head up
;G0 X5 Y182.4 ; present print
;G0 Z100 ; Move print head further up
;G0 Z150 ; Move print head further up
;M140 S0 ; turn off heatbed
;M104 S0 ; turn off temperature
;M107 ; turn off fan
;M84 X Y E ; disable motors
