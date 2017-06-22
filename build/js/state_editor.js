var statePath;
var groupStates = [];
var overlayState;
var stateNameStored = localStorage.getItem('storedStateName');
var idNameStored = localStorage.getItem('storedIdName');
var userImage = new fabric.Image();
var imageRemoved = false;
// var saveImageBtn = document.getElementById("saveImage");
var uploadBar = document.getElementById("uploader");


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

    // var fimg = fabric.Image.fromURL(img.src, function(fimg) {
    // fimg.set('top',20).set('width',50).set('height',50).set('left',20);
    // myCanvas.add(fimg);
    // myCanvas.setActiveObject(fimg);
    // });


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

    // Removing the ability to add multiple images
    // if (confirm("An image has already been loaded. Did you mean to load a second image?") === true) {
    //   var reader = new FileReader();
    //   reader.onload = function(event) {
    //
    //     var imgObj = new Image();
    //     imgObj.src = event.target.result;
    //     imgObj.onload = function() {
    //
    //       userImage = new fabric.Image(imgObj);
    //       userImage.set({
    //         left: 10,
    //         top: 10,
    //         width: canvas.width - 10,
    //         height: canvas.height - 10,
    //         opacity: 1
    //       });
    //       canvas.add(userImage);
    //       userImage.globalCompositeOperation = 'source-atop';
    //       canvas.renderAll();
    //     }
    //   }
    //   reader.readAsDataURL(e.target.files[0]);
    // }
    //end of if for "confirm"

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


(function($) {
  // 	toolbar functions
  var tools = {

    //output to <img>
    print: function() {

      if (!fabric.Canvas.supports('toDataURL')) {
        alert('This browser doesn\'t provide means to serialize canvas to an image');
      } else {
        window.open(canvas.toDataURL({
          format: 'png'
        }))
      }

      var CurrentUser = firebase.auth().currentUser;
      firebase.database().ref("Users/" + CurrentUser.uid).update({

        [idNameStored]: "Y"
      });


      // Below is a way to download the image straight to the users computer without having to right click and save as
      // function downloadCanvas(link, canvasId, filename) {
      //     link.href = document.getElementById(canvasId).toDataURL();
      //     link.download = filename;
      // }
      //
      // document.getElementById('download').addEventListener('click', function() {
      //     downloadCanvas(this, 'canvas', 'test.png');
      // }, false);

    },

    // function saveImageBtn() {
    saveImageBtn: function() {

        // saveImageBtn.addEventListener('change',function(e){
        var CurrentUser = firebase.auth().currentUser;


        // Get file
        // var croppedImage = e.target.files[0];
        var canvasImg = canvas.toDataURL("image/png");
        var croppedImage = dataURItoBlob(canvasImg);
        croppedImage.name = "cropped_state_image.png"

        // Store file
        var ref = firebase.storage().ref(CurrentUser.uid + "/" + idNameStored + "/" + croppedImage.name);
        // + "cropped_state_image.png")
        var task = ref.put(croppedImage);

        // update progress bar
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
      // });
      ,
    ReCenter: function() {
      canvas.centerObject(userImage);
      canvas.renderAll();
    },

    showImage: function() {

      if (userImage.height > 0) {
        overlayState.set({
          fill: 'transparent'
        });
        userImage.globalCompositeOperation = 'destination-over';
        //userImage.globalCompositeOperation = 'lighter';
        canvas.renderAll();
      }

    },

    trim: function() {
      overlayState.set({
        fill: 'white'
      });
      userImage.globalCompositeOperation = 'source-atop';
      //userImage.globalCompositeOperation = 'lighter';
      canvas.renderAll();

    },

    reset: function() {
      canvas.clear();
      canvas.add(overlayState);
      imageRemoved = true;
      document.getElementById("UploadImage").value = "";
      canvas.renderAll();
    }

  };

  $("#toolbar").children().click(function(e) {
    e.preventDefault();
    //call the relevant function
    tools[this.id].call(this);
  });

})(jQuery);

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

function displayCroppedImage() {
  var CurrentUser = firebase.auth().currentUser;

  firebase.storage().ref(CurrentUser.uid + "/" + idNameStored + "/").child('cropped_state_image.png').getDownloadURL().then(function(url) {
    // `url` is the download URL for 'images/stars.jpg'

    //// This can be downloaded directly:
    // var xhr = new XMLHttpRequest();
    // xhr.responseType = 'blob';
    // xhr.onload = function(event) {
    //   var blob = xhr.response;
    // };
    // xhr.open('GET', url);
    // xhr.send();

    // Or inserted into an <img> element:
    var img = document.getElementById('displayImage');
    img.src = url;
  }).catch(function(error) {
    // Handle any errors
    console.log("An error happened");
    console.log(error);
  });

}
