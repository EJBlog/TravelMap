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
    modalBody.classList.add('hide');
    modalFooter.classList.add('hide');
    document.getElementById("userDisplay").innerHTML = email;
    signInModalContent.classList.remove('hide');

    var user = firebase.auth().currentUser;

    var usersData = firebase.database().ref("users/" + user.uid);

    usersData.push({
      email: user.email,
      password: user.password,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    });

  }, function(error) {
    errorCode = error.code;
    errorMessage = error.message;
    document.getElementById("errorMsg").innerHTML = errorMessage;
    console.log(error);
  });

}

// Username and password sign in
function signInUser() {
  email = emailTxt.value;
  password = passwordTxt.value;

  // Sign in a user using email and password
  firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
    modalBody.classList.add('hide');
    modalFooter.classList.add('hide');
    document.getElementById("userDisplay").innerHTML = email;
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

// Getting a users provider-specific profile information
// var user = firebase.auth().currentUser;
//
// if (user != null) {
//   user.providerData.forEach(function(profile) {
//     console.log("Sign-in provider: " + profile.providerId);
//     console.log("  Provider-specific UID: " + profile.uid);
//     console.log("  Name: " + profile.displayName);
//     console.log("  Email: " + profile.email);
//     console.log("  Photo URL: " + profile.photoURL);
//   });
// }
//
// // Updating a user's profile
// user.updateProfile({
//   displayName: "Jane Q. User",
//   photoURL: "https://example.com/jane-q-user/profile.jpg"
// }).then(function() {
//   // Update successful.
// }, function(error) {
//   // An error happened.
// });

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    console.log(user);
    console.log("User is Logged In");
    logOutLink.classList.remove('hide');
    document.getElementById("userDisplay").innerHTML = email;
    document.getElementById("errorMsg").innerHTML = "";
  } else {
    // User is not signed in
    logInLink.classList.remove('hide');
    logOutLink.classList.add('hide');
    console.log("User Not Logged In");
    document.getElementById("userDisplay").innerHTML = "";
  }
});
