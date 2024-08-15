'use strict';

document.addEventListener('keydown', function (event) {
  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault();
      document.getElementById('up').classList.add('active');
      break;
    case 'ArrowDown':
      event.preventDefault();
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
      event.preventDefault();
      document.getElementById('up').classList.remove('active');
      break;
    case 'ArrowDown':
      event.preventDefault();
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
