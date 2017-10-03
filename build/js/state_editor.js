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

// var footer = document.getElementsByClassName("editor-footer")[0]
// footer.innerHTML = '</canvas><img id="previewOutputImg" height="600" width="600"></img>'

// store orig editor dimensions so we can reset it after capture
var origW = $("#editor").width()
var origH = $("#editor").height()


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
      // height: canvas.height,
      // width: canvas.width,
      // x: 0,
      // y: 0
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

  ctx = canvas.getContext('2d');

  trim();

  cropImageFromCanvas(ctx, canvas);

  // overlayState.strokeWidth = 50;
  // overlayState.stroke = "red";
  // overlayState.fill = "blue";

  var canvasEditor = document.getElementById("editor")
  // var canvasImg = canvas.toDataURL("image/png");
  var canvasImg = canvasEditor.toDataURL("image/png");
  var croppedImage = dataURItoBlob(canvasImg);
  croppedImage.name = "cropped_state_image.png"

  var ref = firebase.storage().ref(CurrentUser.uid + "/" + idNameStored + "/" + croppedImage.name);
  var task = ref.put(croppedImage);
  // addIndividualImgToCart();

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

        addIndividualImgToCart();
      setTimeout(function(){ window.location.replace("map.html"); }, 1500);
      // window.location.replace("map.html");

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
    canvas.renderAll();
  }

}

function trim() {
  overlayState.set({
    fill: 'white'
    // strokeWidth: 15,
    // stroke:'white'
  });
  userImage.globalCompositeOperation = 'source-atop';
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


function cropImageFromCanvas(ctx, canvas) {
  canvas.deactivateAll().renderAll();

  var origW = canvas.width;
  var origH = canvas.heigh;

  var w = 700
  var h = 700

  var pix = {
    x: [],
    y: []
  }


  // var imageData = ctx.getImageData(-10, -10, w, h)
  var imageData = ctx.getImageData(0, 0, w, h)
  var x;
  var y;
  var index;

  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      index = (y * w + x) * 4;
      if (imageData.data[index + 3] > 0) {

        pix.x.push(x);
        pix.y.push(y);
        // imageData.data[index] = 255
        // imageData.data[index + 1] = 0
        // imageData.data[index + 2] = 255

      }
    }
  }
  // ctx.putImageData(imageData, 0, 0);

  pix.x.sort(function(a, b) {
    return a - b
  });
  pix.y.sort(function(a, b) {
    return a - b
  });
  var n = pix.x.length - 1;

  w = pix.x[n] - pix.x[0];
  h = pix.y[n] - pix.y[0];
  var cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

  if (idNameStored == 'AL') {
    canvas.width = w - 30;
    canvas.height = h - 50;
  } else if (idNameStored == 'AK') {
    canvas.width = w - 106;
    canvas.height = h - 78;
  } else if (idNameStored == 'AZ') {
    canvas.width = w - 60;
    canvas.height = h - 72;
  } else if (idNameStored == 'AR') {
    canvas.width = w - 43;
    canvas.height = h - 39;
  } else if (idNameStored == 'CA') {
    canvas.width = w - 70;
    canvas.height = h - 120;
  } else if (idNameStored == 'CO') {
    canvas.width = w - 63;
    canvas.height = h - 50;
  } else if (idNameStored == 'CT') {
    canvas.width = w - 12;
    canvas.height = h - 11;
  } else if (idNameStored == 'DE') {
    canvas.width = w - 9;
    canvas.height = h - 13;
  } else if (idNameStored == 'FL') {
    canvas.width = w - 79;
    canvas.height = h - 64;
  } else if (idNameStored == 'GA') {
    canvas.width = w - 46;
    canvas.height = h - 49;
  } else if (idNameStored == 'HI') {
    canvas.width = w - 11;
    canvas.height = h - 25;
  } else if (idNameStored == 'ID') {
    canvas.width = w - 53;
    canvas.height = h - 85;
  } else if (idNameStored == 'IL') {
    canvas.width = w - 37;
    canvas.height = h - 60;
  } else if (idNameStored == 'IN') {
    canvas.width = w - 25;
    canvas.height = h - 45;
  } else if (idNameStored == 'IA') {
    canvas.width = w - 52;
    canvas.height = h - 35;
  } else if (idNameStored == 'KS') {
    canvas.width = w - 65;
    canvas.height = h - 35;
  } else if (idNameStored == 'KY') {
    canvas.width = w - 63;
    canvas.height = h - 33;
  } else if (idNameStored == 'LA') {
    canvas.width = w - 47;
    canvas.height = h - 43;
  } else if (idNameStored == 'ME') {
    canvas.width = w - 32;
    canvas.height = h - 50;
  } else if (idNameStored == 'MD') {
    canvas.width = w - 38;
    canvas.height = h - 20;
  } else if (idNameStored == 'MA') {
    canvas.width = w - 30;
    canvas.height = h - 15;
  } else if (idNameStored == 'MI') {
    canvas.width = w - 66;
    canvas.height = h - 69;
  } else if (idNameStored == 'MN') {
    canvas.width = w - 58;
    canvas.height = h - 65;
  } else if (idNameStored == 'MS') {
    canvas.width = w - 30;
    canvas.height = h - 50;
  } else if (idNameStored == 'MO') {
    canvas.width = w - 58;
    canvas.height = h - 50;
  } else if (idNameStored == 'MT') {
    canvas.width = w - 89;
    canvas.height = h - 56;
  } else if (idNameStored == 'NE') {
    canvas.width = w - 72;
    canvas.height = h - 36;
  } else if (idNameStored == 'NV') {
    canvas.width = w - 54;
    canvas.height = h - 86;
  } else if (idNameStored == 'NH') {
    canvas.width = w - 13;
    canvas.height = h - 29;
  } else if (idNameStored == 'NJ') {
    canvas.width = w - 12;
    canvas.height = h - 27;
  } else if (idNameStored == 'NM') {
    canvas.width = w - 61;
    canvas.height = h - 62;
  } else if (idNameStored == 'NY') {
    canvas.width = w - 65;
    canvas.height = h - 45;
  } else if (idNameStored == 'NC') {
    canvas.width = w - 75;
    canvas.height = h - 32;
  } else if (idNameStored == 'ND') {
    canvas.width = w - 57;
    canvas.height = h - 35;
  } else if (idNameStored == 'OH') {
    canvas.width = w - 36;
    canvas.height = h - 40;
  } else if (idNameStored == 'OK') {
    canvas.width = w - 75;
    canvas.height = h - 40;
  } else if (idNameStored == 'OR') {
    canvas.width = w - 70;
    canvas.height = h - 59;
  } else if (idNameStored == 'PA') {
    canvas.width = w - 48;
    canvas.height = h - 30;
  } else if (idNameStored == 'RI') {
    canvas.width = w - 5;
    canvas.height = h - 10;
  } else if (idNameStored == 'SC') {
    canvas.width = w - 44;
    canvas.height = h - 33;
  } else if (idNameStored == 'SD') {
    canvas.width = w - 61;
    canvas.height = h - 47;
  } else if (idNameStored == 'TN') {
    canvas.width = w - 71;
    canvas.height = h - 25;
  } else if (idNameStored == 'TX') {
    canvas.width = w - 122;
    canvas.height = h - 120;
  } else if (idNameStored == 'UT') {
    canvas.width = w - 47;
    canvas.height = h - 61;
  } else if (idNameStored == 'VT') {
    canvas.width = w - 11;
    canvas.height = h - 25;
  } else if (idNameStored == 'VA') {
    canvas.width = w - 67;
    canvas.height = h - 37;
  } else if (idNameStored == 'WA') {
    canvas.width = w - 57;
    canvas.height = h - 42;
  } else if (idNameStored == 'WV') {
    canvas.width = w - 38;
    canvas.height = h - 37;
  } else if (idNameStored == 'WI') {
    canvas.width = w - 45;
    canvas.height = h - 47;
  } else if (idNameStored == 'WY') {
    canvas.width = w - 60;
    canvas.height = h - 50;
  } else {
    canvas.width = w;
    canvas.height = h;
  }

  var img = canvas.toDataURL("image/png");
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.putImageData(cut, 0, 0);
}
