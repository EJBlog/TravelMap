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
      // email: user.email,
      // password: user.password,
      email: email,
      password: password
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

  firebase.database().ref("Users/" + CurrentUser.uid).update({

    // if (newEmail <> undefined || newEmail <> null) {
    //   email: newEmail
    // },
    email: document.getElementById("newEmail").value,
    password: document.getElementById("newPassword").value,
    displayName: document.getElementById("newFName").value + " " + document.getElementById("newLName").value,
    firstName: document.getElementById("newFName").value,
    lastName: document.getElementById("newLName").value,
    address: document.getElementById("newAddress").value,
    countyCd: document.getElementById("newCounty").value,
    stateCd: document.getElementById("newState").value,
    zipCd: document.getElementById("newZipCd").value
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
      document.getElementById("oldZipCd").innerHTML = snapshot.val().zipCd,
      document.getElementById("oldAddress").innerHTML = snapshot.val().address

  }, function(error) {
    console.log("Error: " + error.code);
  });

  // firebase.database().ref("Users/" + user.uid).update({
  //
  //   // if (newEmail <> undefined || newEmail <> null) {
  //   //   email: newEmail
  //   // },
  //   email: document.getElementById("newEmail").value,
  //   password: document.getElementById("newPassword").value,
  //   displayName: document.getElementById("newFName").value + document.getElementById("newLName").value,
  //   firstName: document.getElementById("newFName").value,
  //   LastName: ddocument.getElementById("newLName").value,
  //   // photoURL: document.getElementById("").value
  //   // emailVerified: document.getElementById("").value
  // });

}


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

    var CurrentUser = firebase.auth().currentUser;
    firebase.database().ref("Users/" + CurrentUser.uid).on("value", function(snapshot) {

        if ( snapshot.val().displayName != null ) {
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

  } else {
    // User is not signed in
    logInLink.classList.remove('hide');
    logOutLink.classList.add('hide');
    console.log("User Not Logged In");
    document.getElementById("userDisplay").innerHTML = "";
  }
});
