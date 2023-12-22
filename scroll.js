document.addEventListener("DOMContentLoaded", function() {
  let mybutton = document.getElementById("myBtn");

  window.addEventListener("scroll", scrollFunction);

  function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
  }

  mybutton.addEventListener("click", function() {
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
  });
});