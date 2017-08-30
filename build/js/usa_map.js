var stateCodes = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN",
  "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

var states = [];
var stateID;
var stateG;
var stateClip;
var path;
var pathWidth;
var pathHeight;
var pathX;
var pathY;
var b;
var recalled = false;

for (var i = 0; i < stateCodes.length; i++) {
  states.push(document.getElementById(stateCodes[i]));
  states[i].style.cursor = 'pointer';
}

function clickState(stateClicked) {
  var CurrentUser = firebase.auth().currentUser;

  var stateElement = document.getElementById(stateClicked.id);
  ClickedIdName = stateElement.id;
  clickedStateName  = stateElement.attributes.value.nodeValue;
  localStorage.setItem('storedIdName', ClickedIdName);
  localStorage.setItem('storedStateName', clickedStateName);

  if (isSignedIn == true) {

    if (CurrentUser.emailVerified == true) {
      window.open("state_editor.html", "_self");
      // window.location.replace("state_editor.html");
    } else {
      console.log("User is signed in but has not verified their email address");
      alert("Please verify your email before creating your Travel Map");
    };

  } else {
    logginModal();
  };
}

function mouseOverState(hoverState) {
  document.getElementById('state-name').innerHTML = hoverState.attributes.value.nodeValue;
}

function showEditedStates() {

  var CurrentUser = firebase.auth().currentUser;

  // for (var i = 0, b = 0; i < stateCodes.length; i++) {
  //
  // 	// if (stateID) {
  // 	// 	break;
  // 	// 	i--;
  // 	// }
  //
  // 	if (stateCodes[i] == statesEdited[b]) {
  // 		console.log(stateCodes[i] + " and " + statesEdited[b] + " matched");
  //
  // 		var stateID = document.getElementById(stateCodes[i]);
  // 		var stateG = document.getElementById(stateCodes[i] + "g");
  // 		var stateClip = document.getElementById(stateCodes[i] + "_clip");
  //
  // 		var path = stateID.getBBox();
  // 		var pathWidth = path.width;
  // 		var pathHeight = path.height;
  // 		var pathX = path.x;
  // 		var pathY = path.y;
  if (recalled == false) {
    b = 0;
  }

  firebase.storage().ref(CurrentUser.uid + "/" + statesEdited[b] + "/").child('cropped_state_image.png').getDownloadURL().then(function(url) {

    if (url != null) {

      matchEditedState();

      var newG = stateG.insertBefore(document.createElementNS('http://www.w3.org/2000/svg', 'g'), stateG.childNodes[5]);
      var storedImg = newG.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'image'));
      storedImg.setAttribute('height', pathHeight);
      storedImg.setAttribute('width', pathWidth);
      storedImg.setAttribute('x', pathX);
      storedImg.setAttribute('y', pathY);

      storedImg.setAttribute('href', url)

      newG.setAttribute('clipPath', 'url(#' + stateCodes[i] + '_clip)');

      stateG.removeChild(stateID);

      if (statesEdited[b + 1] != undefined) {
        b++;
        i = 0;
      };

    } else {

      if (statesEdited[b + 1] != undefined) {
        b++;
        i = 0;
      };

    };

    recall();
  }, function(error) {
    console.log(error);
  });
  // } // end of if statement
  // } // end of new for loop
  // }
}

function matchEditedState() {

  // for (var i = 0, b = 0; i < stateCodes.length; i++) {
  for (var i = 0; i < stateCodes.length; i++) {
    // if (stateID) {
    // 	break;
    // 	i--;
    // }

    if (stateCodes[i] == statesEdited[b]) {

      stateID = document.getElementById(stateCodes[i]);
      stateG = document.getElementById(stateCodes[i] + "g");
      stateClip = document.getElementById(stateCodes[i] + "_clip");

      path = stateID.getBBox();
      pathWidth = path.width;
      pathHeight = path.height;
      pathX = path.x;
      pathY = path.y;

    }
  }

}


function recall() {
  recalled = true;
  showEditedStates();
}
