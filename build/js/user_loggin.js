// Initialize Firebase
var config = {
  //apiKey: "AIzaSyAMN2ml4dlYJqpzlWLmCLl_-5s0U2TrsnU",//for Prod
  apiKey: "AIzaSyDe8J79UZpqZShe7JG6YrnmocRYeIT58QE", //for Dev
  // authDomain: "travel-map-9e0cf.firebaseapp.com",
  //authDomain: "www.officetoadventure.com",
  authDomain: "travel-map-dev.firebaseapp.com", // Use this for DEV
  databaseURL: "https://travel-map-dev.firebaseio.com/",
  storageBucket: "travel-map-dev.appspot.com"
  // messagingSenderId: "<SENDER_ID>",
};
firebase.initializeApp(config);

const emailTxt = document.getElementById('email');
const passwordTxt = document.getElementById('password');
const signOutBtn = document.getElementById('signOut');
const signInBtn = document.getElementById('signIn');
const CreateUserBtn = document.getElementById('newUser');
const logOutLink = document.getElementById('logOutLink');
const logInLink = document.getElementById('LogInLink');
const modalBody = document.getElementById("modalBody");
const modalFooter = document.getElementById("modalFooter");
const signInModalContent = document.getElementById("signInModalContent");
const verifyEmailModalContent = document.getElementById("verifyEmailModalContent");
var usernamePasswordCheck;
var email;
var password;
var errorCode;
var errorMessage;
var isSignedIn = false;
var temp = [];
var statesEdited = [];

function logInReload() {
  location.reload();
};

function usernamePasswordValidation() {
  if (email == "") {
    document.getElementById("errorMsg").innerHTML = "Error: Username cannot be blank!";
    emailTxt.focus();
    return false;
  }

  if (!email.includes("@") || !email.includes(".com")) {
    document.getElementById("errorMsg").innerHTML = "Error: Email must be a valid email address!";
    emailTxt.focus();
    return false;
  }

  if (password != "") {
    if (password.length < 6) {
      document.getElementById("errorMsg").innerHTML = "Error: Password must contain at least six characters!";
      passwordTxt.focus();
      return false;
    }
    if (password == email.substring(0, email.indexOf("@"))) {
      document.getElementById("errorMsg").innerHTML = "Error: Password must be different from Username!";
      passwordTxt.focus();
      return false;
    }
  }

  usernamePasswordCheck = "passed";
};

//username and password create account
function createUser() {
  email = emailTxt.value;
  password = passwordTxt.value;
  usernamePasswordValidation();

  if (usernamePasswordCheck == "passed") {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
      var CurrentUser = firebase.auth().currentUser;

      firebase.database().ref("Users/" + CurrentUser.uid).set({
        email: email,
        password: password,
        displayName: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        countyCd: "",
        stateCd: "",
        zipCd: "",
        emailVerificationSent: "N",
        AK: "N",
        HI: "N",
        AL: "N",
        AR: "N",
        AZ: "N",
        CA: "N",
        CO: "N",
        CT: "N",
        DE: "N",
        FL: "N",
        GA: "N",
        IA: "N",
        ID: "N",
        IL: "N",
        IN: "N",
        KS: "N",
        KY: "N",
        LA: "N",
        MA: "N",
        MD: "N",
        ME: "N",
        MI: "N",
        MN: "N",
        MO: "N",
        MS: "N",
        MT: "N",
        NC: "N",
        ND: "N",
        NE: "N",
        NH: "N",
        NJ: "N",
        NM: "N",
        NV: "N",
        NY: "N",
        OH: "N",
        OK: "N",
        OR: "N",
        PA: "N",
        RI: "N",
        SC: "N",
        SD: "N",
        TN: "N",
        TX: "N",
        UT: "N",
        VA: "N",
        VT: "N",
        WA: "N",
        WI: "N",
        WV: "N",
        WY: "N"

      });

      modalBody.classList.add('hide');
      modalFooter.classList.add('hide');
      signInModalContent.classList.remove('hide');
      verifyEmailModalContent.classList.remove('hide');

    }, function(error) {
      errorCode = error.code;
      errorMessage = error.message;
      document.getElementById("errorMsg").innerHTML = errorMessage;
      console.log(error);

    });

  }
}

function verifyEmail() {
  var CurrentUser = firebase.auth().currentUser;

  firebase.database().ref("Users/" + CurrentUser.uid).on("value", function(snapshot) {

    if (snapshot.val().emailVerificationSent == "N") {

      CurrentUser.sendEmailVerification().then(function() {

        firebase.database().ref("Users/" + CurrentUser.uid).update({
          emailVerificationSent: "Y"
        });
        console.log("Verification Email has been sent");

      }, function(error) {
        console.log("There was an error so the Verification Email has NOT been sent");
      });

    }
  });
  // , function(error) {
  //   console.log("Error: " + error.code);
  // });
}

function reVerifyEmail() {

  var CurrentUser = firebase.auth().currentUser;
  firebase.database().ref("Users/" + CurrentUser.uid).on("value", function(snapshot) {

    if (snapshot.val().emailVerificationSent == "Y" && CurrentUser.emailVerified == true) {
      console.log("The user has already verified their email.");
    }
    else if (snapshot.val().emailVerificationSent == "Y" && CurrentUser.emailVerified == false) {
      CurrentUser.sendEmailVerification().then(function() {
      console.log("Verification Email has been re-sent");
      });
    }

  });

}

// Username and password sign in
function signInUser() {
  email = emailTxt.value;
  password = passwordTxt.value;
  emailVerified = false;

  // Sign in a user using email and password
  firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
    modalBody.classList.add('hide');
    modalFooter.classList.add('hide');
    signInModalContent.classList.remove('hide');

  }, function(error) {
    errorCode = error.code;
    errorMessage = error.message;
    document.getElementById("errorMsg").innerHTML = errorMessage;
    console.log(error);
  });

}

//Username and password signout
function signOutUser() {

  firebase.auth().signOut().then(function() {
    console.log("User Signed Out Successfully");
  }).catch(function(error) {
    console.log("User was NOT signed out");
  });

}

function changePassword() {
  var CurrentUser = firebase.auth().currentUser;
  var emailAddress = CurrentUser.email;

  firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
    // Email sent.
  }, function(error) {
    // An error happened.
  });
  
}

function displayUserInfo() {
  var CurrentUser = firebase.auth().currentUser;

  firebase.database().ref("Users/" + CurrentUser.uid).on("value", function(snapshot) {
    if (snapshot.val().firstName != "") {
      document.getElementById("oldFName").innerHTML = snapshot.val().firstName
    } else {
      document.getElementById("oldFName").innerHTML = "Please update"
    };

    if (snapshot.val().lastName != "") {
      document.getElementById("oldLName").innerHTML = snapshot.val().lastName
    } else {
      document.getElementById("oldLName").innerHTML = "Please update"
    };

    if (snapshot.val().countyCd != "") {
      document.getElementById("oldCounty").innerHTML = snapshot.val().countyCd
    } else {
      document.getElementById("oldCounty").innerHTML = "Please update"
    };

    if (snapshot.val().stateCd != "") {
      document.getElementById("oldState").innerHTML = snapshot.val().stateCd
    } else {
      document.getElementById("oldState").innerHTML = "Please update"
    };

    if (snapshot.val().city != "") {
      document.getElementById("oldCity").innerHTML = snapshot.val().city
    } else {
      document.getElementById("oldCity").innerHTML = "Please update"
    };

    if (snapshot.val().zipCd != "") {
      document.getElementById("oldZipCd").innerHTML = snapshot.val().zipCd
    } else {
      document.getElementById("oldZipCd").innerHTML = "Please update"
    };

    if (snapshot.val().address != "") {
      document.getElementById("oldAddress").innerHTML = snapshot.val().address
    } else {
      document.getElementById("oldAddress").innerHTML = "Please update"
    };

  }, function(error) {
    console.log("Error: " + error.code);
  });
}

function updateUserInfo() {
  var CurrentUser = firebase.auth().currentUser;

  firebase.database().ref("Users/" + CurrentUser.uid).on("value", function(snapshot) {

    if (document.getElementById("newFName").value == "") {

      if (snapshot.val().firstName == undefined) {
        var newFName = "";
      } else {
        var newFName = snapshot.val().firstName;
      }

    } else {
      var newFName = document.getElementById("newFName").value
    };

    if (document.getElementById("newLName").value == "") {

      if (snapshot.val().lastName == undefined) {
        var newLName = "";
      } else {
        var newLName = snapshot.val().lastName;
      }

    } else {
      var newLName = document.getElementById("newLName").value
    };

    if (document.getElementById("newFName").value == "") {

      if (snapshot.val().firstName == undefined && snapshot.val().lastName == undefined) {
        var newDisplayName = snapshot.val().email;
      } else {
        var newDisplayName = snapshot.val().firstName + " " + snapshot.val().lastName;
      }

    } else {
      var newDisplayName = document.getElementById("newFName").value + " " + document.getElementById("newLName").value
    };

    if (document.getElementById("newCounty").value == "") {

      if (snapshot.val().countyCd == undefined) {
        var newCounty = "";
      } else {
        var newCounty = snapshot.val().countyCd;
      }

    } else {
      var newCounty = document.getElementById("newCounty").value
    };

    if (document.getElementById("newState").value == "") {

      if (snapshot.val().stateCd == undefined) {
        var newState = "";
      } else {
        var newState = snapshot.val().stateCd;
      }

    } else {
      var newState = document.getElementById("newState").value
    };

    if (document.getElementById("newCity").value == "") {

      if (snapshot.val().city == undefined) {
        var newCity = "";
      } else {
        var newCity = snapshot.val().city;
      }

    } else {
      var newCity = document.getElementById("newCity").value
    };

    if (document.getElementById("newZipCd").value == "") {

      if (snapshot.val().zipCd == undefined) {
        var newZipCd = "";
      } else {
        var newZipCd = snapshot.val().zipCd;
      }

    } else {
      var newZipCd = document.getElementById("newZipCd").value
    };

    if (document.getElementById("newAddress").value == "") {

      if (snapshot.val().address == undefined) {
        var newAddress = "";
      } else {
        var newAddress = snapshot.val().address;
      }

    } else {
      var newAddress = document.getElementById("newAddress").value
    };

    firebase.database().ref("Users/" + CurrentUser.uid).update({

      displayName: newDisplayName,
      firstName: newFName,
      lastName: newLName,
      address: newAddress,
      city: newCity,
      countyCd: newCounty,
      stateCd: newState,
      zipCd: newZipCd
    });

  }, function(error) {
    console.log("Error: " + error.code);
  });
}

function editedStates() {
  var CurrentUser = firebase.auth().currentUser;
  var queryStatesEdited = firebase.database().ref("Users/" + CurrentUser.uid).orderByKey();
  queryStatesEdited.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        temp.push(key + childData);

      });
      for (var i = 0; i < 51; i++) {
        if (temp[i].substring(3, 2) == "Y") {
          stateId = temp[i].substring(0, 2);
          statesEdited.push(stateId);
        }
      }
      showEditedStates();
    });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    //User is signed in
    var CurrentUser = firebase.auth().currentUser;
    firebase.database().ref("Users/" + CurrentUser.uid).on("value", function(snapshot) {

      if (snapshot.val().displayName != "") {
        document.getElementById("userDisplay").innerHTML = snapshot.val().displayName;
      } else {
        document.getElementById("userDisplay").innerHTML = snapshot.val().email;
      }
    }, function(error) {
      console.log("Error: " + error.code);
    });

    if (document.URL.indexOf("map.html") >= 0) {
      editedStates();
    }

    if (CurrentUser.emailVerified == false) {
      verifyEmail();
    } else {
      console.log("User has already verified their email");
    };

    if (document.URL.indexOf("profile.html") >= 0) {
      if (CurrentUser.emailVerified == false) {
        document.getElementById("resendEmailVerification").classList.remove('hide');
      }
    };

    // if (document.URL.indexOf("profile.html") == 0) {
    //   console.log(document.URL.indexOf("profile.html"));
    //   logOutLink.classList.remove('hide');
    //   document.getElementById("errorMsg").innerHTML = "";
    // };

    console.log("User is Logged In");
    isSignedIn = true;
    document.getElementById("userEmail").innerHTML = CurrentUser.email;

  } else {
    // User is not signed in
    logInLink.classList.remove('hide');
    logOutLink.classList.add('hide');
    console.log("User Not Logged In");
    document.getElementById("userDisplay").innerHTML = "";
    isSignedIn = false;
  }
});
