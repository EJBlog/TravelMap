var stateCodes = [
  ["AL","Alabama"], ["AK","Alaska"], ["AZ","Arizona"], ["AR","Arkansas"], ["CA","California"], ["CO","Colorado"], ["CT","Connecticut"],
["DE","Delaware"], ["FL","Florida"], ["GA","Georgia"], ["HI","Hawaii"], ["ID","Idaho"], ["IL","Illinois"], ["IN","Indiana"], ["IA","Iowa"], ["KS","Kansas"],
["KY","Kentucky"], ["LA","Louisiana"], ["ME","Maine"], ["MD","Maryland"], ["MA","Massachusetts"], ["MI","Michigan"], ["MN","Minnesota"], ["MS","Mississippi"],
["MO","Missouri"], ["MT","Montana"], ["NE","Nebraska"], ["NV","Nevada"], ["NH","New Hampshire"], ["NJ","New Jersey"], ["NM","New Mexico"], ["NY","New York"],
["NC","North Carolina"], ["ND","North Dakota"],["OH","Ohio"], ["OK","Oklahoma"], ["OR","Oregon"], ["PA","Pennsylvania"], ["RI","Rhode Island"],
["SC","South Carolina"], ["SD","South Dakota"], ["TN","Tennessee"], ["TX","Texas"], ["UT","Utah"], ["VT","Vermont"], ["VA","Virginia"],
["WA","Washington"], ["WV","West Virginia"], ["WI","Wisconsin"], ["WY","Wyoming"]
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
  states.push(document.getElementById(stateCodes[i][0]));
  states[i].style.cursor = 'pointer';
}

function clickState(stateClicked) {
  var CurrentUser = firebase.auth().currentUser;

  var stateElement = document.getElementById(stateClicked.id);
  ClickedIdName = stateElement.id;

  if (stateElement.attributes.value != undefined) {
      clickedStateName = stateElement.attributes.value.nodeValue;
      localStorage.setItem('storedStateName', clickedStateName);
  }
  else {
    for (var i = 0; i < stateCodes.length; i++) {
      if (stateCodes[i][0] == ClickedIdName) {
        clickedStateName = stateCodes[i][1];
        localStorage.setItem('storedStateName', clickedStateName);
      }
    }
  }

  localStorage.setItem('storedIdName', ClickedIdName);

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

function mouseOverStateId(hoverState) {
  // document.getElementById('state-name').innerHTML = hoverState.id;

    for (var i = 0; i < stateCodes.length; i++) {
      if (stateCodes[i][0] == hoverState.id) {
        document.getElementById('state-name').innerHTML = stateCodes[i][1];
      }
    }
  }

function showEditedStates() {

  var CurrentUser = firebase.auth().currentUser;

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
      storedImg.setAttribute('class', 'hovering')
      storedImg.setAttribute('onclick', 'clickState(this)')
      // storedImg.setAttribute('onmouseover', 'mouseOverState(this)') //Not working because we arent putting the state name with the new image
      storedImg.setAttribute('onmouseover', 'mouseOverStateId(this)')
      storedImg.setAttribute('id',statesEdited[b])

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

    if (stateCodes[i][0] == statesEdited[b]) {

      stateID = document.getElementById(stateCodes[i][0]);
      stateG = document.getElementById(stateCodes[i][0] + "g");
      stateClip = document.getElementById(stateCodes[i][0] + "_clip");

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
