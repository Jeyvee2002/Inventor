// Variable Declarations
const LOGGED_IN_USER_KEY = "loggedInUser";
const APP_SCRIPT_URL = "YOUR_APP_SCRIPT_URL_HERE"; // Replace with your URL

let loggedInUser;
let profileContainer; // Assuming you have a container element to display the profile

// Function Declarations
function getAndDisplayUserProfile() {
    const STORED_DATA = localStorage.getItem(LOGGED_IN_USER_KEY);

    if (STORED_DATA) {
        loggedInUser = JSON.parse(STORED_DATA);
        console.log("Retrieved data from localStorage:", loggedInUser);

        // Call the function to fetch other user details
        fetchOtherUserDetails(loggedInUser.user_id, loggedInUser.user_barcode);
    } else {
        console.log("No user data found in localStorage. Please log in first.");
        // Redirect to login page or show a message
    }
}

function fetchOtherUserDetails(userId, userBarcode) {
    const formData = new FormData();
    formData.append("formType", "getProfile"); // This is the new formType
    formData.append("user_id", userId);
    formData.append("user_barcode", userBarcode);

    fetch(APP_SCRIPT_URL, {
        method: "POST",
        body: formData
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data && data.status === "SUCCESS") {
            console.log("Fetched user profile data:", data.profile);
            displayProfile(data.profile); // Call a function to display the data
        } else {
            console.error("Failed to fetch user profile:", data.message);
        }
    })
    .catch(function(error) {
        console.error("Error during profile data fetch:", error);
    });
}

function displayProfile(profileData) {
    // This is where you will write the code to update your HTML elements
    // with the fetched profile data.
    if (profileContainer) {
        profileContainer.innerHTML = "<h2>Welcome, " + profileData.firstName + "</h2>";
        profileContainer.innerHTML += "<p>Employee ID: " + profileData.user_id + "</p>";
        profileContainer.innerHTML += "<p>Department: " + profileData.department + "</p>";
        // Add more elements as needed
    }
}

// Initializing functions
document.addEventListener("DOMContentLoaded", function() {
    // Assuming your HTML has a container with the id 'profile-container'
    profileContainer = document.getElementById("profile-container");
    getAndDisplayUserProfile();
});






function doPost(e) {
    var formType = e.parameter.formType;

    if (formType == "login") {
        return handleLogin(e);
    } else if (formType == "getProfile") {
        return handleGetProfile(e); // Added this new condition
    }

    return ContentService.createTextOutput("FAILURE: Invalid request.").setMimeType(ContentService.MimeType.JSON);
}

// Function that handles the new 'getProfile' request
function handleGetProfile(e) {
    var user_id = e.parameter.user_id;
    var user_barcode = e.parameter.user_barcode;

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();

    // Loop through the data to find the user
    for (var i = 1; i < values.length; i++) {
        var row = values[i];
        // Assuming your user_id is in column A (index 0) and barcode in column B (index 1)
        if (row[0] == user_id && row[1] == user_barcode) {
            // Found the user, now create an object with their profile data
            var userProfile = {
                status: "SUCCESS",
                message: "Profile fetched successfully.",
                profile: {
                    user_id: row[0],
                    user_barcode: row[1],
                    firstName: row[2], // Assuming this is your first name column
                    lastName: row[3],  // Assuming this is your last name column
                    department: row[4], // Assuming this is your department column
                    // Add other user data columns as needed
                }
            };
            return ContentService.createTextOutput(JSON.stringify(userProfile)).setMimeType(ContentService.MimeType.JSON);
        }
    }

    // If the loop finishes without finding the user
    var errorResponse = {
        status: "FAILURE",
        message: "User not found."
    };
    return ContentService.createTextOutput(JSON.stringify(errorResponse)).setMimeType(ContentService.MimeType.JSON);
}



/**
 * Applies a border to the entire row when a cell is edited.
 * @param {GoogleAppsScript.Events.Sheets.onEdit} e The onEdit event object.
 */
function onEdit(e) {
  // Variable Declarations
  const editedRange = e.range;
  const editedSheet = editedRange.getSheet();
  const editedRow = editedRange.getRow();
  
  // Get the last column of the edited sheet to create the full row range
  const lastColumn = editedSheet.getLastColumn();
  
  // Function Declarations
  function applyBorders() {
    // Create a range that spans the entire edited row
    const fullRowRange = editedSheet.getRange(editedRow, 1, 1, lastColumn);
    
    // Set the borders for the entire row
    fullRowRange.setBorder(true, true, true, true, false, false);
  }
  
  // Initializing functions
  applyBorders();
}




// FINAL


// Variable Declarations
const APPSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw5Jc70U3BxilCViYBLj95Dh0zyrA4X9p5vhU9flYVICTeC5ralnmwDLGfg0TGZz3-Njg/exec';
let loggedInUser = null;
let userData = null;

// Function Declarations
function getUserData() {
  // Check if a user ID is saved in local storage
  loggedInUser = localStorage.getItem('loggedInUser');
  if (loggedInUser) {
    // Parse the JSON string to get the user ID
    let user_id = JSON.parse(loggedInUser).user_id;

    // Create a FormData object to send to the server
    const FORM_DATA = new FormData();
    FORM_DATA.append('form_type', 'get_user_data');
    FORM_DATA.append('user_id', user_id);

    // Send the request to your Apps Script
    fetch(APPSCRIPT_URL, {
      method: 'POST',
      body: FORM_DATA,
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      // Store the user data in a global variable
      userData = data;
      // Now you can use userData to populate your profile page
      displayUserProfile(userData);
    }).catch(function(error) {
      console.error('Error fetching user data:', error);
      alert('An error occurred while fetching your data. Please try again.');
    });
  } else {
    // Redirect to login page if no user is logged in
    window.location.href = '/login.html';
  }
}

function displayUserProfile(user_data) {
  // Example of how to display the data on your page
  // You should get the elements on your profile page and set their values
  // For example:
  // document.getElementById('username').textContent = user_data.username;
  // document.getElementById('name').textContent = user_data.name;
  console.log('Displaying user profile:', user_data);
}

// Function Initialization
// Call this function when the profile page loads
getUserData();





// Inside your doPost(e) function
function doPost(e) {
  var form_type = e.parameter.form_type;

  if (form_type === 'login') {
    return handleLogin(e);
  } else if (form_type === 'get_user_data') {
    // Added this part to handle the new request type
    return getUserData(e);
  }

  return ContentService.createTextOutput("FAILURE: Invalid request.").setMimeType(ContentService.MimeType.JSON);
}

// New function to handle the get_user_data request
function getUserData(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('USER_PROFILE');
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var userId = e.parameter.user_id;
  
  // Looping through the sheet to find the matching user ID
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var sheetUserId = row[0]; // Assuming User ID is in the first column

    if (sheetUserId.toString() === userId.toString()) {
      // Create a JSON object with user information to send back
      var userData = {
        user_id: row[0],
        username: row[1], // Assuming username is in the second column
        email: row[2]    // Assuming email is in the third column
        // Add other fields as needed
      };
      
      return ContentService.createTextOutput(JSON.stringify(userData)).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // If no matching user is found
  return ContentService.createTextOutput(JSON.stringify({ error: "User not found" })).setMimeType(ContentService.MimeType.JSON);
}


// full code
// Variable Declarations
// No global variables are needed in this specific script.

// Function Declarations
function doGet(e) {
  // This is a placeholder. doGet is for GET requests,
  // doPost is for POST requests which you are using.
  return HtmlService.createHtmlOutput('<h1>Please use a POST request.</h1>');
}

function doPost(e) {
  var form_type = e.parameter.form_type;
  
  if (form_type === 'login') {
    return handleLogin(e);
  } else if (form_type === 'get_user_data') {
    return getUserData(e);
  }
  
  return ContentService.createTextOutput("FAILURE: Invalid request.").setMimeType(ContentService.MimeType.JSON);
}

// Function to handle login requests
function handleLogin(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('USER_PROFILE');
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var inputUsername = e.parameter.username;
  var inputPassword = e.parameter.password;
  
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var sheetUSERNAME = row[1]; // Username row
    var sheetPASSWORD = row[2]; // Password row
    
    if (sheetUSERNAME === inputUsername && sheetPASSWORD === inputPassword) {
      // Create JSON with userdata
      var userData = {
        user_id: row[0] // User ID in the Google Sheet
      };
      
      return ContentService.createTextOutput(JSON.stringify(userData)).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput("FAILURE").setMimeType(ContentService.MimeType.JSON);
}

// Function to handle data retrieval for a logged-in user
function getUserData(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('USER_PROFILE');
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var userId = e.parameter.user_id;
  
  // Looping through the sheet to find the matching user ID
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var sheetUserId = row[0]; // Assuming User ID is in the first column
    
    if (sheetUserId.toString() === userId.toString()) {
      // Create a JSON object with user information to send back
      var userData = {
        user_id: row[0],
        username: row[1], // Assuming username is in the second column
        email: row[2]     // Assuming email is in the third column
        // Add other fields as needed
      };
      
      return ContentService.createTextOutput(JSON.stringify(userData)).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  // If no matching user is found
  return ContentService.createTextOutput(JSON.stringify({ error: "User not found" })).setMimeType(ContentService.MimeType.JSON);
}

// Function Initialization
// No functions are initialized here as Apps Script functions are triggered by requests.




// Variable Declaration
const HTML_ELEMENT = document.documentElement;

// Function Declaration
/**
 * Toggles the dark mode class on the HTML element.
 * @param {boolean} isDarkMode - True to enable dark mode, false to disable.
 */
function toggleDarkMode(isDarkMode) {
  if (isDarkMode) {
    HTML_ELEMENT.classList.add('dark-mode');
  } else {
    HTML_ELEMENT.classList.remove('dark-mode');
  }
}

// Initializing Functions and Attaching Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  const PREFERS_DARK_SCHEME = window.matchMedia('(prefers-color-scheme: dark)');
  toggleDarkMode(PREFERS_DARK_SCHEME.matches);

  // Optional: Add a listener for real-time changes
  PREFERS_DARK_SCHEME.addEventListener('change', function(event) {
    toggleDarkMode(event.matches);
  });
});


/**
 * This function displays a greeting message.
 * @param {string} firstName The first name of the person.
 * @param {string} lastName The last name of the person.
 */
function greetPerson(firstName, lastName) {
    console.log("Hello, " + firstName + " " + lastName + "!");
}

greetPerson();