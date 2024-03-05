// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
let btn = document.getElementById("myBtn");
let btn1 = document.getElementById("myBtn1");
let btn2 = document.getElementById("myBtn2");
let btn3 = document.getElementById("myBtn3");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}
btn1.onclick = function() {
  modal.style.display = "block";
}
btn2.onclick = function() {
  modal.style.display = "block";
}
btn3.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

  // Get the button and popup elements
  const button = document.getElementById('openPopup');
  const popup = document.getElementById('popupForm');

  // Add a click event listener to the button to show the popup
  button.addEventListener('click', function() {
    popup.style.display = 'block';
  });

  // Add form submission handler if needed
  const form = document.getElementById('ageDobForm');
  form.addEventListener('submit', function(event) {
    // You can add validation or other logic here before submission
console.log('Form submitted');
  });

  