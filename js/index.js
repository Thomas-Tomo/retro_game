"use strict";

// Add a click event listener ul elements to add a sound effect
document.querySelectorAll(".headLink").forEach(function (link, index) {
  link.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default anchor behavior
    var audio = document.getElementById("click-sound-" + (index + 1));
    audio.play();
    // A delay before navigating to the href
    setTimeout(function () {
      window.location.href = link.href;
    }, 600); // Adjust the delay
  });
});

// Add a hover event listener to the play a sound effect
document.querySelectorAll(".member").forEach(function (member) {
  member.addEventListener("mouseenter", function () {
    var audio = document.getElementById("hover-sound");
    audio.play();
  });
});
// Add a click event listener to the play a sound effect on the github link
document.getElementById("github-link").addEventListener("click", function () {
  var audio = document.getElementById("click-sound-4");
  audio.play();
});
