// Grab References to Drop down menues
var sizeSelection = document.getElementById('size-selection');
var angleSelection = document.getElementById('angle-selection');
var plateImg = document.getElementById('current-well-plate');


// Circle Grid
$('.circle').height($('.circle').width());
// Well Plate Grid Matrix to keep track of which have been filled and such. 0 = empty, 1 = full
var wellPlateGrid;
// Creates the grid of well plate cells based on size given
// rows = num rows in well plate, cols = number of columns in well plate
function createWellPlate(rows, cols) {
    // Clear previous grid
    var cellGrid = document.getElementById('cell-grid');
    cellGrid.innerHTML = "";

    // String of html that creates our well plate
    var well_plate_html = '';
    for (let i = 0; i < rows; i++) {
        well_plate_html += '<div class="cell-row">';
        for (let j = 0; j < cols; j++) {
            // Create unique Id consisting of row and column number
            let id = "R" + i + "C" + j;
            let cellhtml = '<div class="circle" id="' + id + '"></div>';
            well_plate_html +=  cellhtml;
        }
        // Finish row tag
        well_plate_html += '</div>';
    }
    // Print for testing
    console.log("Rows: " + rows + " Cols: " + cols);
    console.log(well_plate_html);

    // Insert html into cell grid element
    cellGrid.innerHTML = well_plate_html;
    
    // Circle Grid 
    $('.circle').height($('.circle').width()); 
}

// Creates the customizable (clickable) grid of well plate cells based on selection given
function createCustomizableWellPlate(rows, cols) {
    // Clear previous grid
    var cellGrid = document.getElementById('custom-cell-grid');
    cellGrid.innerHTML = "";
    
    // String of html that creates our well plate
    var well_plate_html = '';
    for (let i = 0; i < rows; i++) {
        well_plate_html += '<div class="cell-row">';
        for (let j = 0; j < cols; j++) {
            // Create unique Id consisting of row and column number
            let id = "R" + i + "C" + j;
            let cellhtml = '<div class="circle" onClick="selectCell(this.id)" id="' + id + '"></div>';
            well_plate_html +=  cellhtml;
        }
        // Finish row tag
        well_plate_html += '</div>';
    }
    // Print for testing
    console.log("Rows: " + rows + " Cols: " + cols);
    console.log(well_plate_html);

    // Insert html into cell grid element
    cellGrid.innerHTML = well_plate_html;
    
    // Circle Grid 
    $('.circle').height($('.circle').width()); 
    
    // Create Matix to represent fill status of this well plate
    wellPlateGrid = new Array(rows);
    for (var i = 0; i < rows; i++) {
        wellPlateGrid[i] = new Array(cols); // make each element an array
    }

    // Default Cells to full
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let id = "R" + i + "C" + j;
            // If cell is filled (1) make it pink
            document.getElementById(id).style.background = "#f45b96";

            // Insert 1 into array at this cell
            wellPlateGrid[i][j] = 1;
        }
    }
}

// Fills drawn well plate based on input given in the form of a 2d array
// If a 0 is within a cell, it will be empty(white) and if it is 1 it will be filled (pink)
function fillWellPlate(wellPlateArray) {
    let rows = wellPlateArray.length;
    let cols = wellPlateArray[0].length;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let id = "R" + i + "C" + j;
            // If cell is filled (1) make it pink
            if (wellPlateArray[i][j] == 1) {
                document.getElementById(id).style.background = "#f45b96";
            } else {
                document.getElementById(id).style.background = "white";
            }
        }
    }
}

// On update to size selection update image of well plate
sizeSelection.addEventListener('change', (event) => {
    var size = sizeSelection.options[sizeSelection.selectedIndex].text;
    console.log(size);

    // Change Image to match selection and draw well plate of correct size to allow for specific cells to be choosen
    if (size == "6") {
        plateImg.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0),rgba(0, 0, 0, 0)), url('https://www.mattek.com/wp-content/uploads/6-well-Front.png')";
        createCustomizableWellPlate(2, 3);
    } else if (size == "12") {
        plateImg.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0),rgba(0, 0, 0, 0)), url('https://www.mattek.com/wp-content/uploads/12-well-Front.png')";
        createCustomizableWellPlate(3, 4);
    } else if (size == "24") {
        plateImg.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0),rgba(0, 0, 0, 0)), url('https://www.mattek.com/wp-content/uploads/24-well-Front.png')"; 
        createCustomizableWellPlate(4, 6); 
    } else {
        plateImg.style.backgroundImage = "";
        // Clear previous grid
        var cellGrid = document.getElementById('custom-cell-grid');
        cellGrid.innerHTML = "";
    }

  });

// Media Exhange Button
// When Pressed will clear page of all elements 
const exchangeButton = document.querySelector("#exchange-button");
exchangeButton.addEventListener('click', function(e) {
  // Save Data From Selectors
  var size = sizeSelection.options[sizeSelection.selectedIndex].text;
  var angle = angleSelection.options[angleSelection.selectedIndex].text;

  if (size != "Select Well Plate Size" && angle != "Select Well Plate Angle") {
    // TODO MAKE GET REQUEST TO NODEJS SERVER TO CALL MATCHING PYTHON SCRIPT TO WELL PLATE SELECTION FOR MEDIA EXHANGE

    // Generate Well Plate Image based on input
    if (size == "6") {
        createWellPlate(3, 2);
    }
    else if (size == "12") {
        createWellPlate(3, 4);
    }
    else if (size == "24") {
        createWellPlate(4, 6);
    }


    // Clear Error Text
    $("#error-text").hide();

    // Toggle Visibility of Well Plate Selectors
    toggleElements();

  } else {
      // If options were not selected then display error message and don't run scripts
      $("#error-text").show();
  }

});


// Cancel Button
// When Pressed will clear page of all elements related to media exhange and stops script from running
const cancelButton = document.querySelector("#cancel-button");
cancelButton.addEventListener('click', function(e) {

  // STOP PYTHON SCRIPT FROM RUNNING
  killChildProcess();

  // Toggle Visibility of Well Plate Selectors
  toggleElements();
});

// Stop Button
// When Pressed will attempt to stop the current media exhange
const stopButton = document.querySelector("#stop-button");
stopButton.addEventListener('click', function(e) {
    killChildProcess();
});

function killChildProcess() {
    // STOP PYTHON SCRIPT FROM RUNNING
    // Using fetch to make get request
    pythonurl = 'http://10.144.13.13:3000/abort'
            
    fetch(pythonurl)
        .then((response) => {
        return response.text();
    })
    .then((data) => {
        console.log(data);
    })
    .catch (err => {
        // Display Error message
        console.log("Failure to stop script");
    });
}


// When Clicked Each Cell in the Well Plate should change color and signal that they are filled
function selectCell(culture_id) {
    var culture  = document.getElementById(culture_id);

    // Change Color
    if (culture.style.background == "white") {
        culture.style.background = "#f45b96";
        // Record which cell cultures are filled in 2d array or sumthin
        // Culture ID is in structure: RiCj where i is the row number, and j is the col number
        wellPlateGrid[culture_id.charAt(1)][culture_id.charAt(3)] = 1;
    } else {
        culture.style.background = "white";
        // Record which cell cultures are filled in 2d array or sumthin
        // Culture ID is in structure: RiCj where i is the row number, and j is the col number
        wellPlateGrid[culture_id.charAt(1)][culture_id.charAt(3)] = 0;
    }

    console.log(wellPlateGrid[culture_id.charAt(1)][culture_id.charAt(3)]);

}







 // Helper Function that toggles the visibility of all elements within the column
function toggleElements() {

    // If Well Plate Selectors are hidden then make them visible again and info displayed during media exchange
    if (document.querySelector(".column").style.display == "none") {
        $(".column").show();

        $("#exchange-info").hide();
        $("#cancel-button").hide();
        $("#stop-button").hide();
    } else {
        $(".column").hide();
        
        $("#exchange-info").show();
        $("#cancel-button").show();
        $("#stop-button").show();
    }
}

  // Testing Calling Python scripts through get request to Node.js server
    // Media Exhange Button
    // When Pressed will clear page of all elements 
    const pythonButton = document.querySelector("#python-button");
    
    pythonButton.addEventListener('click', function(e) {
        // Using fetch to get data
        //https://cors-anywhere.herokuapp.com/
        pythonurl = 'http://10.144.13.13:3000/pythonhello'
        
        fetch(pythonurl)
            .then((response) => {
            return response.text();
        })
        .then((data) => {
            console.log(data);
        })
        .catch (err => {
        // Display Error message if no data is returned from search
            console.log("Error Running python script");
        });

    });

    const dispenseButton = document.querySelector("#dispense-button");
    
    dispenseButton.addEventListener('click', function(e) {
        // Using fetch to get data
        pythonurl = 'http://10.144.13.13:3000/pythondispense'
        
        fetch(pythonurl)
            .then((response) => {
            return response.text();
        })
        .then((data) => {
            console.log(data);
        })
        .catch (err => {
        // Display Error message if no data is returned from search
            console.log("Error running python script");
        });


    });


