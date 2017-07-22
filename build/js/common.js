function openNav() {
  document.getElementById("menu_trigger").classList.add('hide');
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("menu_trigger").classList.remove('hide');
}

(function() {

  $("#cart").on("click", function() {
    $(".shopping-cart").fadeToggle("fast");
    populateCartDropdown();
  });

})();


  var modal = document.getElementById("loginModal");
  var span = document.getElementsByClassName("close")[0];

  var logginModal = function() {
    modal.style.display = "block"
  };

  span.onclick = function() {
    modal.style.display = "none";
    logInReload();
  }

  window.onclick = function() {
    if (event.target == modal) {
      modal.style.display = "none";
      logInReload();
    }
  }





var product={};
var cart=[];
var subTotal = 0;
var tax = 0;
var total = 0;

function populateCartDropdown(){

  var storedCartDisplay = JSON.parse(localStorage.getItem('storedCart'));

  document.getElementsByClassName("shopping-cart")[0].removeChild(document.getElementById("shopping-cart-items"));
  subTotal = 0;
  var checkoutBtn = document.getElementsByClassName("button");

  cartItems = document.createElement('Ul');
  cartItems.setAttribute("class", "shopping-cart-items");
  cartItems.setAttribute("id", "shopping-cart-items");
  document.getElementsByClassName("shopping-cart")[0].insertBefore(cartItems, checkoutBtn[0]);

  for (var i = 0; i < storedCartDisplay.length; i++) {

    newLineItem = document.createElement('li');
    newLineItem.setAttribute("class", "clearfix " + i);
    newLineItem.setAttribute("style", "font-size:14px;");
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
    removeItemLink.innerHTML = "Remove Item";
    removeItemLink.setAttribute("href", "#");
    removeItemLink.setAttribute("style", "font-size:14px;");
    // removeItemLink.setAttribute("onclick", "removeItemFromCart(" + "'" + storedCartDisplay[i].editedStateName + "'" + ")" );
    removeItemLink.setAttribute("onclick", "removeItemFromCart(" + "'" + i + "'" + ")" );
    document.getElementsByClassName("clearfix " + i)[0].appendChild(removeItemLink);

    subTotal = subTotal + storedCartDisplay[i].subtotal;

  }

    document.getElementById("subtotalDollars").innerHTML = subTotal;
    document.getElementById("badge").innerHTML = storedCartDisplay.length;

}

function removeItemFromCart(indexNum){

  console.log(indexNum);

  var temp = JSON.parse(localStorage.getItem('storedCart'))

  temp.splice(indexNum, 1);
    localStorage.setItem('storedCart', JSON.stringify(temp));
    populateCartDropdown();

}

function displayCheckoutCart(){


    var storedCartDisplay = JSON.parse(localStorage.getItem('storedCart'));

    document.getElementsByClassName("checkoutCart")[0].removeChild(document.getElementById("checkout-cart-items"));
    subTotal = 0;

    cartItems = document.createElement('Ul');
    cartItems.setAttribute("class", "checkout-cart-items");
    cartItems.setAttribute("id", "checkout-cart-items");
    // document.getElementsByClassName("checkout-cart")[0].insertBefore(cartItems, checkoutBtn[0]);

    for (var i = 0; i < storedCartDisplay.length; i++) {

      newLineItem = document.createElement('li');
      newLineItem.setAttribute("class", "checkoutItem " + i);
      newLineItem.setAttribute("style", "font-size:14px;");
      document.getElementsByClassName("checkout-cart-items")[0].appendChild(newLineItem);

      newImage = document.createElement("img");
      newImage.setAttribute("src", storedCartDisplay[i].editedImageUrl);
      newImage.setAttribute("height", 100);
      newImage.setAttribute("width", 100);
      document.getElementsByClassName("checkoutItem " + i)[0].appendChild(newImage);

      newSpan_name = document.createElement("span");
      newSpan_name.setAttribute("class", 'item-name');
      newSpan_name.innerHTML = "State: " + storedCartDisplay[i].editedStateName;
      document.getElementsByClassName("checkoutItem " + i)[0].appendChild(newSpan_name);

      newSpan_price = document.createElement("span");
      newSpan_price.setAttribute('class', 'item-price');
      newSpan_price.innerHTML = "Price: " + storedCartDisplay[i].price;
      document.getElementsByClassName("checkoutItem " + i)[0].appendChild(newSpan_price);

      removeItemLink = document.createElement("a");
      removeItemLink.innerHTML = "Remove Item";
      removeItemLink.setAttribute("href", "#");
      removeItemLink.setAttribute("style", "font-size:14px;");
      removeItemLink.setAttribute("onclick", "removeItemFromCart(" + "'" + i + "'" + ")" );
      document.getElementsByClassName("checkoutItem " + i)[0].appendChild(removeItemLink);

      subTotal = subTotal + storedCartDisplay[i].subtotal;

    }

      document.getElementById("subtotalDollars").innerHTML = subTotal;
      document.getElementById("badge").innerHTML = storedCartDisplay.length;

}

function calculateTotal(){

  tax = subTotal * .06;
  total = subTotal + tax;

  document.getElementById("taxAmt").innerHTML = tax;
  document.getElementById("totalAmt").innerHTML = total;

}
