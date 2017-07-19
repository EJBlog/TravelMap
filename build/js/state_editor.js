var statePath;
var groupStates = [];
var overlayState;
var stateNameStored = localStorage.getItem('storedStateName');
var idNameStored = localStorage.getItem('storedIdName');
var userImage = new fabric.Image();
var imageRemoved = false;
var uploadBar = document.getElementById("uploader");
// var product={};
// var cart=[];
// var subTotal = 0;


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
  // removeBlanks(canvas.width, canvas.height);

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


function ReCenter() {
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



function addIndividualImgToCart() {
  //Possibly add checks to see if they want to add the same image twice

  // saveImageBtn();
  var CurrentUser = firebase.auth().currentUser;
  firebase.storage().ref(CurrentUser.uid + "/" + idNameStored + "/").child('cropped_state_image.png').getDownloadURL().then(function(url) {

    product.editedStateName = stateNameStored;
    product.price = .50;
    product.quantity = 1;
    product.editedImageUrl = url;
    product.subtotal = product.price * product.quantity;

    var isAlreadyAdded = false;
    var temp = JSON.parse(localStorage.getItem('storedCart'));

    if (temp) {

      for (var i = 0; i < temp.length; i++) {
        if (temp[i].editedStateName == product.editedStateName) {
          alert("Please only add one image per state to your Cart.");
          isAlreadyAdded = true;
        }
      }

      if (isAlreadyAdded == false) {
        cart.push(product);
        for (var i = 0; i < temp.length; i++) {
          cart.push(temp[i]);
        }

        localStorage.setItem('storedCart', JSON.stringify(cart));
        cart.length = 0;
      }

    } else {
      cart.push(product);
      localStorage.setItem('storedCart', JSON.stringify(cart));
      cart.length = 0;
    }

    populateCartDropdown();


  }).catch(function(error) {
    console.log(error);

    if (error.name == "FirebaseError") {
      alert("Please save your image before adding to your cart.")
    }
  });


}






// var img = new Image()
// var $canvas = $("<canvas>"),
//   canvasWhiteSpace = $canvas[0],
//   context;
//
// // define here an image from your domain
// img.href = 'url(https://firebasestorage.googleapis.com/v0/b/travel-map-dev.appspot.com/o/aFCFWLccMqVdwYHnp0NqoF2ZU4x2%2FAK%2Fcropped_state_image.png?alt=media&token=8459f348-3624-4507-99c3-ee8db0dc90fa)';
//
//
// function removeBlanks(imgWidth, imgHeight) {
//   var imageData = context.getImageData(0, 0, imgWidth, imgHeight),
//     data = imageData.data,
//     getRBG = function(x, y) {
//       var offset = imgWidth * y + x;
//       return {
//         red: data[offset * 4],
//         green: data[offset * 4 + 1],
//         blue: data[offset * 4 + 2],
//         opacity: data[offset * 4 + 3]
//       };
//     },
//     isWhite = function(rgb) {
//       // many images contain noise, as the white is not a pure #fff white
//       return rgb.red > 200 && rgb.green > 200 && rgb.blue > 200;
//     },
//     scanY = function(fromTop) {
//       var offset = fromTop ? 1 : -1;
//
//       // loop through each row
//       for (var y = fromTop ? 0 : imgHeight - 1; fromTop ? (y < imgHeight) : (y > -1); y += offset) {
//
//         // loop through each column
//         for (var x = 0; x < imgWidth; x++) {
//           var rgb = getRBG(x, y);
//           if (!isWhite(rgb)) {
//             return y;
//           }
//         }
//       }
//       return null; // all image is white
//     },
//     scanX = function(fromLeft) {
//       var offset = fromLeft ? 1 : -1;
//
//       // loop through each column
//       for (var x = fromLeft ? 0 : imgWidth - 1; fromLeft ? (x < imgWidth) : (x > -1); x += offset) {
//
//         // loop through each row
//         for (var y = 0; y < imgHeight; y++) {
//           var rgb = getRBG(x, y);
//           if (!isWhite(rgb)) {
//             return x;
//           }
//         }
//       }
//       return null; // all image is white
//     };
//
//   var cropTop = scanY(true),
//     cropBottom = scanY(false),
//     cropLeft = scanX(true),
//     cropRight = scanX(false),
//     cropWidth = cropRight - cropLeft,
//     cropHeight = cropBottom - cropTop;
//
//   var $croppedCanvas = $("<canvas>").attr({
//     width: cropWidth,
//     height: cropHeight
//   });
//
//   // finally crop the guy
//   $croppedCanvas[0].getContext("2d").drawImage(canvas,
//     cropLeft, cropTop, cropWidth, cropHeight,
//     0, 0, cropWidth, cropHeight);
//
//   $("body").
//   append("<p>same image with white spaces cropped:</p>").
//   append($croppedCanvas);
//   console.log(cropTop, cropBottom, cropLeft, cropRight);
// };
//
// img.crossOrigin = "anonymous";
// img.onload = function() {
//   $canvas.attr({
//     width: this.width,
//     height: this.height
//   });
//   context = canvasWhiteSpace.getContext("2d");
//   if (context) {
//     context.drawImage(this, 0, 0);
//     $("body").append("<p>original image:</p>").append($canvas);
//
//     removeBlanks(this.width, this.height);
//   } else {
//     alert('Get a real browser!');
//   }
// };
