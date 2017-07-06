var statePath;
var groupStates = [];
var overlayState;
var stateNameStored = localStorage.getItem('storedStateName');
var idNameStored = localStorage.getItem('storedIdName');
var editedImageURL;
var userImage = new fabric.Image();
var imageRemoved = false;
var uploadBar = document.getElementById("uploader");
var cart={};

// Did not Initialize Firebase because we also reference the user loggin js file which has the initialization

//Changing the control colors from light blue to black
fabric.Object.prototype.set({
  transparentCorners: true,
  borderColor: '#111111',
  cornerColor: '#111111'
});

// changing the editor background color
var canvas = new fabric.Canvas('editor', {
  width: $("#editor").width(),
  height: $("#editor").height()
});

// loading the background/overlay image from SVG of the state that was cicked
fabric.loadSVGFromURL("svg/usa_map.svg", function(objects) {
    var stateObjects = new fabric.Group(groupStates);

    stateObjects.set({
      left: 10,
      top: 10,
      width: canvas.width - 10,
      height: canvas.height - 10
    });

    for (var i = 0; i < objects.length; i++) {
      if (stateObjects._objects[i].id == idNameStored) {
        overlayState = stateObjects._objects[i];

        overlayState.set({
          left: 0,
          top: 0,
          stroke: 'black',
          fill: 'white',
          height: 250,
          width: 300, // Changed the size of the state so that it fits better in the canvas. This ties with the scaling X and Y
          selectable: false,
          scaleX: 2,
          scaleY: 2 // Increasing the size of the state image so it is easier for the user to fit their image into the shape of the state.
        })

        canvas.add(overlayState);
        canvas.renderAll();

      }
    }
  },
  function(item, object) {
    object.set('id', item.getAttribute('id'));
    groupStates.push(object);
  });



// uploading user image
document.getElementById('UploadImage').onchange = function handleImage(e) {

  if (userImage.height > 0 && imageRemoved == false) {

    alert("An image has already been loaded. Please reset the editor before loading another image.")

  } else {
    var reader = new FileReader();
    reader.onload = function(event) {

      var imgObj = new Image();
      imgObj.src = event.target.result;
      imgObj.onload = function() {

        userImage = new fabric.Image(imgObj);
        userImage.set({
          left: 10,
          top: 10,
          width: canvas.width - 10,
          height: canvas.height - 10,
          opacity: 1,
        });
        canvas.add(userImage);
        userImage.globalCompositeOperation = 'source-atop';
        canvas.renderAll();
      }
    }
    reader.readAsDataURL(e.target.files[0]);
    imageRemoved = false;
  }
};

function preview() {

  trim();
  if (!fabric.Canvas.supports('toDataURL')) {
    alert('This browser doesn\'t provide means to serialize canvas to an image');
  } else {
    var ota_logo = document.getElementById("watermark");
    var watermark = new fabric.Image(ota_logo);
    watermark.set({
      opacity: .7,
      top: 130,
      left: 180,
      height: 250,
      width: 250
    });
    canvas.add(watermark);
    window.open(canvas.toDataURL({
      format: 'png'
    }))
    canvas.remove(watermark);
  }

}

function saveImageBtn() {

    var CurrentUser = firebase.auth().currentUser;

    firebase.database().ref("Users/" + CurrentUser.uid).update({
      [idNameStored]: "Y"
    });

    document.getElementById("loaderProgress").classList.remove('hide');

    trim();
    var canvasImg = canvas.toDataURL("image/png");
    var croppedImage = dataURItoBlob(canvasImg);
    croppedImage.name = "cropped_state_image.png"

    var ref = firebase.storage().ref(CurrentUser.uid + "/" + idNameStored + "/" + croppedImage.name);
    var task = ref.put(croppedImage);

    task.on('state_changed',

      function progress(snapshot) {
        var percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        uploadBar.value;
        uploadBar.value = percent;
      },

      function error(error) {
        console.log(error);
      },

      function complete() {
        console.log("The image has been loaded to the firebase storage!");
      }

    );
  }


function ReCenter(){
  canvas.centerObject(userImage);
  canvas.renderAll();
}

function showImage() {

  if (userImage.height > 0) {
    overlayState.set({
      fill: 'transparent'
    });
    userImage.globalCompositeOperation = 'destination-over';
    //userImage.globalCompositeOperation = 'lighter';
    canvas.renderAll();
  }

}

function trim() {
  overlayState.set({
    fill: 'white'
  });
  userImage.globalCompositeOperation = 'source-atop';
  //userImage.globalCompositeOperation = 'lighter';
  canvas.renderAll();

}

function reset() {
  canvas.clear();
  canvas.add(overlayState);
  imageRemoved = true;
  document.getElementById("UploadImage").value = "";
  canvas.renderAll();
}


function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(dataURI.split(',')[1]);
  else
    byteString = unescape(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {
    type: mimeString
  });
}

// function displayCroppedImage() {
//   var CurrentUser = firebase.auth().currentUser;
//
//   firebase.storage().ref(CurrentUser.uid + "/" + idNameStored + "/").child('cropped_state_image.png').getDownloadURL().then(function(url) {
//     // `url` is the download URL for 'images/stars.jpg'
//
//     //// This can be downloaded directly:
//     // var xhr = new XMLHttpRequest();
//     // xhr.responseType = 'blob';
//     // xhr.onload = function(event) {
//     //   var blob = xhr.response;
//     // };
//     // xhr.open('GET', url);
//     // xhr.send();
//
//     // Or inserted into an <img> element:
//     var img = document.getElementById('displayImage');
//     img.src = url;
//   }).catch(function(error) {
//     // Handle any errors
//     console.log("An error happened");
//     console.log(error);
//   });
//
// }

function addIndividualImgToCart(){
  //find what image they stored
  saveImageBtn();
  var CurrentUser = firebase.auth().currentUser;
  firebase.storage().ref(CurrentUser.uid + "/" + idNameStored + "/").child('cropped_state_image.png').getDownloadURL().then(function(url) {

    // editedImageURL = url;
    cart.editedImageUrl = url;
    localStorage.setItem('storedCart', JSON.stringify(cart));

  }).catch(function(error) {
    console.log(error);
  });

  //add it to a local storage array named "cart" along with the quanity and price of the image.
  cart.editedStateName = stateNameStored;
  cart.editedStateId = idNameStored;

  localStorage.setItem('storedCart', JSON.stringify(cart));
  var storedCart = localStorage.getItem('storedCart');

  console.log(storedCart);
  console.log(cart);
  console.log(JSON.parse(localStorage.getItem('storedCart')));

  //display this information on the checkout page

}
