import startGame from './game.js';

('use strict');

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

function beginGame() {
  // Select the game area elements
  const background = document.getElementById('game-area');
  const game_text = document.getElementsByClassName('game-info')[0];
  const game_area = document.getElementsByClassName('game-play')[0];
  const active_btn = document.getElementById('play-btn');
  const active_pad = document.getElementById('game-pad');

  // Ensure elements are found before applying styles
  if (game_text && game_area) {
    game_text.style.display = 'none';
    game_area.style.display = 'flex';
    background.style.backgroundColor = 'black';
    active_btn.style.display = 'none';
    active_pad.style.display = 'flex';

    window.scrollTo({
      top: active_pad,
      behavior: 'smooth',
    });

    // Trigger reflow to restart the animation
    game_area.offsetWidth; // This line forces a reflow

    // Add the pixelate animation class
    game_area.classList.add('pixelate');

  }
}
