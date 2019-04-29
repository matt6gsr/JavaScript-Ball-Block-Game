/////// LOAD IMAGES ////////
const BG_IMAGE = new Image();
BG_IMAGE.src = 'img/bg.jpg';

const LEVEL_IMAGE = new Image();
LEVEL_IMAGE.src = 'img/level.png';

const LIFE_IMAGE = new Image();
LIFE_IMAGE.src = 'img/life.png';

const SCORE_IMAGE = new Image();
SCORE_IMAGE.src = 'img/score.png';

/////// LOAD SOUNDS ////////
const WALL_HIT = new Audio();
WALL_HIT.src = 'sounds/wall.mp3';

const LIFE_LOST = new Audio();
LIFE_LOST.src = 'sounds/life_lost.mp3';

const PADDLE_HIT = new Audio();
PADDLE_HIT.src = 'sounds/paddle_hit.mp3';

const WIN = new Audio();
WIN.src = 'sounds/win.mp3';

const BRICK_HIT = new Audio();
BRICK_HIT.src = 'sounds/brick_hit.mp3';

const LEVEL_UP = new Audio();
LEVEL_UP.src = 'sounds/level_up.mp3';

const GAME_OVER_SOUND = new Audio();
GAME_OVER_SOUND.src = 'sounds/game_over.wav';
