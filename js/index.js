'use strict';

// Add a click event listener ul elements to add a sound effect
document.querySelectorAll('.headLink').forEach(function (link, index) {
  link.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default anchor behavior
    var audio = document.getElementById('click-sound-' + (index + 1));
    audio.play();
    // A delay before navigating to the href
    setTimeout(function () {
      window.location.href = link.href;
    }, 600); // Adjust the delay
  });
});

// Add a hover event listener to the play a sound effect
document.querySelectorAll('.member').forEach(function (member) {
  member.addEventListener('mouseenter', function () {
    var audio = document.getElementById('hover-sound');
    audio.play();
  });
});

document.addEventListener('keydown', function (event) {
  switch (event.key) {
    case 'ArrowUp':
      document.getElementById('up').classList.add('active');
      break;
    case 'ArrowDown':
      document.getElementById('down').classList.add('active');
      break;
    case 'ArrowLeft':
      document.getElementById('left').classList.add('active');
      break;
    case 'ArrowRight':
      document.getElementById('right').classList.add('active');
      break;
  }
});

document.addEventListener('keyup', function (event) {
  switch (event.key) {
    case 'ArrowUp':
      document.getElementById('up').classList.remove('active');
      break;
    case 'ArrowDown':
      document.getElementById('down').classList.remove('active');
      break;
    case 'ArrowLeft':
      document.getElementById('left').classList.remove('active');
      break;
    case 'ArrowRight':
      document.getElementById('right').classList.remove('active');
      break;
  }
});
