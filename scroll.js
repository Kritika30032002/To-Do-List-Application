/*
// Get the button:
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 20 ||
    document.documentElement.scrollTop > 20
  ) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document smoothly
function topFunction() {
  // For Safari
  document.body.scrollTop = 0;
  // For Chrome, Firefox, IE and Opera
  document.documentElement.scrollTop = 0;

  // Check for browser support
  if ("scrollBehavior" in document.documentElement.style) {
    // Smooth scroll to the top
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  } else {
    // Fallback for browsers that do not support smooth scrolling
    window.scrollTo(0, 0);
  }
}
*/
// Get the button:
//final

let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 20 ||
    document.documentElement.scrollTop > 20
  ) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document smoothly
function topFunction() {
  // For Safari
  document.body.scrollTop = 0;
  // For Chrome, Firefox, IE, and Opera
  document.documentElement.scrollTop = 0;

  // Check for browser support
  if ("scrollBehavior" in document.documentElement.style) {
    // Smooth scroll to the top
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  } else {
    // Fallback for browsers that do not support smooth scrolling
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
}

/*
const topButton = document.getElementById("myBtn");
const contentWrapper = document.querySelector(".contentWrapper");

function scrollUp() {
  if (contentWrapper.scrollTop > 100) {
    topButton.style.display = "block";
  } else {
    topButton.style.display = "none";
  }
}

function getTop() {
  contentWrapper.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

contentWrapper.addEventListener("scroll", scrollUp);
topButton.addEventListener("click", getTop);
  */