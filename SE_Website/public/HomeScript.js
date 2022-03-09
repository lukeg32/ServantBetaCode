// Grab References to Drop down menues
var sizeSelection = document.getElementById('size-selection');
var angleSelection = document.getElementById('angle-selection');
var plateImg = document.getElementById('current-well-plate');
var cellGrid = document.getElementById('cell-grid');

// Circle Grid
$('.circle').height($('.circle').width());
// Creates the grid of well plate cells based on selection given
function createWellPlate(rows, cols) {
    // Clear previous grid
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
    console.log(well_plate_html);
    // Insert html into cell grid element
    cellGrid.innerHTML = well_plate_html;
    //TODO MAnually Set height
    // Circle Grid 
    $('.circle').height($('.circle').width());  
}

// On update to size selection update image of well plate
sizeSelection.addEventListener('change', (event) => {
    var size = sizeSelection.options[sizeSelection.selectedIndex].text;
    console.log(size);

    // Change Image to match selection
    if (size == "6") {
        plateImg.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0),rgba(0, 0, 0, 0)), url('https://www.mattek.com/wp-content/uploads/6-well-Front.png')";
    } else if (size == "12") {
        plateImg.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0),rgba(0, 0, 0, 0)), url('https://www.mattek.com/wp-content/uploads/12-well-Front.png')";
    } else if (size == "24") {
        plateImg.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0),rgba(0, 0, 0, 0)), url('https://www.mattek.com/wp-content/uploads/24-well-Front.png')";  
    } else {
        plateImg.style.backgroundImage = "";
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

  // TODO STOP PYTHON SCRIPT FROM RUNNING

  // Toggle Visibility of Well Plate Selectors
  toggleElements();
});


// When Clicked Each Cell in the Well Plate should change color and signal that they are filled
function selectCell(culture_id) {
    var culture  = document.getElementById(culture_id);

    // Change Color
    if (culture.style.background == "white") {
        culture.style.background = "linear-gradient(to left top, #ff34d3e3, #c94dae)";
    } else {
        culture.style.background = "white";
    }

    // TODO Record which cell cultures are filled in 2d array or sumthin
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


