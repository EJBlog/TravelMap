var statePath;
var groupStates = [];
var overlayState;
var stateNameStored = localStorage.getItem('storedStateName');
var idNameStored = localStorage.getItem('storedIdName');
var userImage = new fabric.Image();
var imageRemoved = false;
var uploadBar = document.getElementById("uploader");
var product={};
var cart=[];


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













function addIndividualImgToCart(){
  //Possibly add checks to see if they want to add the same image twice


  // saveImageBtn();
  var CurrentUser = firebase.auth().currentUser;
  firebase.storage().ref(CurrentUser.uid + "/" + idNameStored + "/").child('cropped_state_image.png').getDownloadURL().then(function(url) {

    product.editedStateName = stateNameStored;
    product.price = .50;
    product.quantity = 1;
    product.editedImageUrl = url;
    product.subtotal = product.price * product.quantity;

    var temp = JSON.parse(localStorage.getItem('storedCart'))
    if (temp) {

      cart.push(product);
      for (var i = 0; i < temp.length; i++) {
        cart.push(temp[i]);
      }

      localStorage.setItem('storedCart', JSON.stringify(cart));
      cart.length = 0;
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


function populateCartDropdown(){

  var storedCartDisplay = JSON.parse(localStorage.getItem('storedCart'));

  document.getElementsByClassName("shopping-cart")[0].removeChild(document.getElementById("shopping-cart-items"));

  cartItems = document.createElement('Ul');
  cartItems.setAttribute("class", "shopping-cart-items");
  cartItems.setAttribute("id", "shopping-cart-items");
  document.getElementsByClassName("shopping-cart")[0].appendChild(cartItems);

  for (var i = 0; i < storedCartDisplay.length; i++) {

    newLineItem = document.createElement('li');
    newLineItem.setAttribute("class", "clearfix " + i);
    document.getElementsByClassName("shopping-cart-items")[0].appendChild(newLineItem);

    newImage = document.createElement("img");
    newImage.setAttribute("src", storedCartDisplay[i].editedImageUrl);
    newImage.setAttribute("height", 100);
    newImage.setAttribute("width", 100);
    document.getElementsByClassName("clearfix " + i)[0].appendChild(newImage);

    newSpan_name = document.createElement("span");
    newSpan_name.setAttribute("class", 'item-name');
    newSpan_name.innerHTML = "State: " + storedCartDisplay[i].editedStateName;
    document.getElementsByClassName("clearfix " + i)[0].appendChild(newSpan_name);

    newSpan_price = document.createElement("span");
    newSpan_price.setAttribute('class', 'item-price');
    newSpan_price.innerHTML = "Price: " + storedCartDisplay[i].price;
    document.getElementsByClassName("clearfix " + i)[0].appendChild(newSpan_price);

    removeItemLink = document.createElement("a");
    removeItemLink.setAttribute("id", storedCartDisplay[i].editedStateName );
    removeItemLink.innerHTML = "Remove Item";
    removeItemLink.setAttribute("href", "#");
    // removeItemLink.setAttribute("onclick", "removeItemFromCart(" + "'" + storedCartDisplay[i].editedStateName + "'" + ")" );
    removeItemLink.setAttribute("onclick", "removeItemFromCart(" + "'" + i + "'" + ")" );
    document.getElementsByClassName("clearfix " + i)[0].appendChild(removeItemLink);

  }

}

//NEED TO CHANGE THIS FROM NAME TO ARRAY INDEX NUMBER
function removeItemFromCart(indexNum){

  console.log(indexNum);

  var temp = JSON.parse(localStorage.getItem('storedCart'))
  // if (temp) {
  //
  //   for (var i = 0; i < temp.length; i++) {
  //     if(temp[i].editedStateName == itemName){
          // temp.splice(temp[i], 1);
  //     }
  //
  //   }
    // localStorage.setItem('storedCart', JSON.stringify(temp));
    // populateCartDropdown();
  // }


  temp.splice(temp[indexNum], 1);
    localStorage.setItem('storedCart', JSON.stringify(temp));
    populateCartDropdown();


}
