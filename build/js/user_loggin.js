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
var email;
var password;
var errorCode;
var errorMessage;
var isSignedIn = false;

function logInReload() {
  location.reload();
};

//username and password create account
function createUser() {
  email = emailTxt.value;
  password = passwordTxt.value;

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
      // photoURL: document.getElementById("").value
      // emailVerified: document.getElementById("").value

    });

  }, function(error) {
    errorCode = error.code;
    errorMessage = error.message;
    document.getElementById("errorMsg").innerHTML = errorMessage;
    console.log(error);
  });

  modalBody.classList.add('hide');
  modalFooter.classList.add('hide');
  signInModalContent.classList.remove('hide');

}

// Username and password sign in
function signInUser() {
  email = emailTxt.value;
  password = passwordTxt.value;

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

function updateUserInfo() {
  var CurrentUser = firebase.auth().currentUser;

  // if (document.getElementById("newEmail").value == "") {
  //   var newEmail = CurrentUser.email;
  // } else {
  //   var newEmail = document.getElementById("newEmail").value
  // };
  //
  // if (document.getElementById("newEmail").value == "") {
  //   var newPassword = CurrentUser.email;
  // } else {
  //   var newPassword = document.getElementById("newEmail").value
  // };

  if (document.getElementById("newFName").value == "") {
    var newFName = CurrentUser.firstName;
  } else {
    var newFName = document.getElementById("newFName").value
  };

  if (document.getElementById("newLName").value == "") {
    var newLName = CurrentUser.lastName;
  } else {
    var newLName = document.getElementById("newLName").value
  };

  if (document.getElementById("newFName").value == "") {
    var newDisplayName = CurrentUser.firstName + CurrentUser.lastName;
  } else {
    var newDisplayName = document.getElementById("newFName").value + " " + document.getElementById("newLName").value
  };

  if (document.getElementById("newCounty").value == "") {
    var newCounty = CurrentUser.countyCd;
  } else {
    var newCounty = document.getElementById("newCounty").value
  };

  if (document.getElementById("newState").value == "") {
    var newState = CurrentUser.stateCd;
  } else {
    var newState = document.getElementById("newState").value
  };

  if (document.getElementById("newCity").value == "") {
    var newCity = CurrentUser.city;
  } else {
    var newCity = document.getElementById("newCity").value
  };

  if (document.getElementById("newZipCd").value == "") {
    var newZipCd = CurrentUser.zipCd;
  } else {
    var newZipCd = document.getElementById("newZipCd").value
  };

  if (document.getElementById("newAddress").value == "") {
    var newAddress = CurrentUser.address;
  } else {
    var newAddress = document.getElementById("newAddress").value
  };

  firebase.database().ref("Users/" + CurrentUser.uid).update({

    // email: newEmail,
    // password: newPassword,
    displayName: document.getElementById("newFName").value + " " + document.getElementById("newLName").value,
    firstName: newFName,
    lastName: newLName,
    address: newAddress,
    city: newCity,
    countyCd: newCounty,
    stateCd: newState,
    zipCd: newZipCd
    // photoURL: document.getElementById("").value
    // emailVerified: document.getElementById("").value
  });

}

function displayUserInfo() {
  var CurrentUser = firebase.auth().currentUser;

  firebase.database().ref("Users/" + CurrentUser.uid).on("value", function(snapshot) {
    document.getElementById("oldEmail").innerHTML = snapshot.val().email,
      document.getElementById("oldPassword").innerHTML = snapshot.val().password,
      document.getElementById("oldDisplayName").innerHTML = snapshot.val().firstName + " " + snapshot.val().lastName,
      document.getElementById("oldFName").innerHTML = snapshot.val().firstName,
      document.getElementById("oldLName").innerHTML = snapshot.val().lastName,
      document.getElementById("oldCounty").innerHTML = snapshot.val().countyCd,
      document.getElementById("oldState").innerHTML = snapshot.val().stateCd,
      document.getElementById("oldCity").innerHTML = snapshot.val().city,
      document.getElementById("oldZipCd").innerHTML = snapshot.val().zipCd,
      document.getElementById("oldAddress").innerHTML = snapshot.val().address

  }, function(error) {
    console.log("Error: " + error.code);
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

    logOutLink.classList.remove('hide');
    document.getElementById("errorMsg").innerHTML = "";
    console.log(user);
    console.log("User is Logged In");
    isSignedIn = true;

  } else {
    // User is not signed in
    logInLink.classList.remove('hide');
    logOutLink.classList.add('hide');
    console.log("User Not Logged In");
    document.getElementById("userDisplay").innerHTML = "";
    isSignedIn = false;
  }
});

// // Need to create a list of state abbreviations that have value of "Y" in the database for the current user.
// // Then use that list to change the color of those states in the "States" Array
// function editedStates() {
//   var CurrentUser = firebase.auth().currentUser;
//   var queryStatesEdited = firebase.database().ref("Users/" + CurrentUser.uid).orderByKey();
//   queryStatesEdited.once("value")
//     .then(function(snapshot) {
//         snapshot.forEach(function(childSnapshot) {
//           var key = childSnapshot.key;
//           console.log("Key: " + key);
//           var childData = childSnapshot.val();
//           console.log("Child Data: " + childData)
//         });
//       }
//     });
