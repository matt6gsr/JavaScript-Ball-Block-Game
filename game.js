//SELECT CANVAS ELEMENT
const cvs = document.getElementById('breakout');
const ctx = cvs.getContext('2d');

//ADD BORDER TO CANVAS
cvs.style.border = '1px solid #0ff';

//MAKE LINE THICK WHEN DRAWING TO CANVAS
ctx.lineWidth = 3;

//GAME VARIABLES AND CONSTANTS
const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 8;
const SCORE_UNIT = 10;
const MAX_LEVEL = 5;
let LIFE = 3;
let SCORE = 0;
let leftArrow = false;
let rightArrow = false;
let LEVEL = 1;
let GAME_OVER = false;
let bricks = [];

//CREATE THE PADDLE
const paddle = {
  x: cvs.width / 2 - PADDLE_WIDTH / 2,
  y: cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  dx: 5
};

//DRAW PADDLE
const drawPaddle = () => {
  ctx.fillStyle = '#2e3548';
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

  ctx.strokeStyle = '#ffcd05';
  ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
};

//CONTROL THE PADDLE
document.addEventListener('keydown', event => {
  if (event.keyCode === 37) leftArrow = true;
  if (event.keyCode === 39) rightArrow = true;
});

document.addEventListener('keyup', event => {
  if (event.keyCode === 37) leftArrow = false;
  if (event.keyCode === 39) rightArrow = false;
});

//MOVE PADDLE
const movePaddle = () => {
  if (rightArrow && paddle.x + paddle.width < cvs.width) paddle.x += paddle.dx;
  if (leftArrow && paddle.x > 0) paddle.x -= paddle.dx;
};

//CREATE BALL
const ball = {
  x: cvs.width / 2,
  y: paddle.y - BALL_RADIUS,
  radius: BALL_RADIUS,
  speed: 5,
  dx: 3,
  dy: -3
};

//DRAW THE BALL
const drawBall = () => {
  ctx.beginPath();

  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#ffcd05';
  ctx.fill();

  ctx.strokeStyle = '#2e3548';
  ctx.stroke();

  ctx.closePath();
};

//MOVE THE BALL
const moveBall = () => {
  ball.x += ball.dx;
  ball.y += ball.dy;
};

//CREATE BRICKS
const brick = {
  row: 1,
  column: 5,
  width: 55,
  height: 20,
  offSetLeft: 20,
  offSetTop: 20,
  marginTop: 40,
  fillColour: '#2e3548',
  strokeColour: '#FFF'
};

const createBricks = () => {
  for (let r = 0; r < brick.row; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.column; c++) {
      bricks[r][c] = {
        x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
        y:
          r * (brick.offSetTop + brick.height) +
          brick.offSetTop +
          brick.marginTop,
        status: true
      };
    }
  }
};

createBricks();

//DRAW THE BRICKS
const drawBricks = () => {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      //IF BRICK ISN'T BROKEN
      if (b.status) {
        gameOver;
        ctx.fillStyle = brick.fillColour;
        ctx.fillRect(b.x, b.y, brick.width, brick.height);
        ctx.strokeStyle = brick.strokeColour;
        ctx.strokeRect(b.x, b.y, brick.width, brick.height);
      }
    }
  }
};

//BALL BRICK COLLISION
const ballBrickCollision = () => {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      //IF BRICK ISN'T BROKEN
      if (b.status) {
        if (
          ball.x + ball.radius > b.x &&
          ball.x - ball.radius < b.x + brick.width &&
          ball.y + ball.radius > b.y &&
          ball.y - ball.radius < b.y + brick.height
        ) {
          BRICK_HIT.play();
          ball.dy = -ball.dy;
          b.status = false;
          SCORE += SCORE_UNIT;
        }
      }
    }
  }
};

//DRAW FUNCTION
const draw = () => {
  drawPaddle();

  drawBall();

  drawBricks();

  //SHOW SCORE
  showGameStats(SCORE, 35, 25, SCORE_IMAGE, 5, 5);
  //SHOW LIVES
  showGameStats(LIFE, cvs.width - 25, 25, LIFE_IMAGE, cvs.width - 55, 5);
  //SHOW LEVEL
  showGameStats(LEVEL, cvs.width / 2, 25, LEVEL_IMAGE, cvs.width / 2 - 30, 5);
};

//SHOW GAME STATS
const showGameStats = (text, textX, textY, img, imgX, imgY) => {
  //DRAW TEXT
  ctx.fillStyle = '#FFF';
  ctx.font = '25px Germania One';
  ctx.fillText(text, textX, textY);

  //DRAW IMAGE
  ctx.drawImage(img, imgX, imgY, (width = 25), (height = 25));
};

//BALL AND WALL COLLISION DETECTION
const ballWallCollision = () => {
  if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
    WALL_HIT.play();
  }

  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
    WALL_HIT.play();
  }
  if (ball.y + ball.radius > cvs.height) {
    if (LIFE > 1) {
      LIFE-- && LIFE_LOST.play() && resetBall();
    } else {
      LIFE-- && GAME_OVER_SOUND.play() && resetBall();
    }
  }
};

//RESET THE BALL
const resetBall = () => {
  ball.x = cvs.width / 2;
  ball.y = paddle.y - BALL_RADIUS;
  ball.dx = 3 * (Math.random() * 2 - 1);
  ball.dy = -3;
};

//BALL AND PADDLE COLLISION
const ballPaddleCollision = () => {
  if (
    ball.x < paddle.x + paddle.width &&
    ball.x > paddle.x &&
    paddle.y < paddle.y + paddle.height &&
    ball.y > paddle.y
  ) {
    //PLAY SOUND
    PADDLE_HIT.play();
    //CHECK WHERE THE BALL HIT THE PADDLE
    let collidePoint = ball.x - (paddle.x + paddle.width / 2);
    //NORMALISE THE VALUES
    collidePoint = collidePoint / (paddle.width / 2);
    //CALCULATE THE ANGLE
    let angle = (collidePoint * Math.PI) / 3;

    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
  }
};

//GAME OVER
const gameOver = () => {
  if (LIFE <= 0) {
    showYouLose();
    GAME_OVER = true;
  }
};

//LEVEL UP
const levelUp = () => {
  let isLevelDone = true;

  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      isLevelDone = isLevelDone && !bricks[r][c].status;
    }
  }
  if (isLevelDone) {
    if (LEVEL >= MAX_LEVEL) {
      showYouWin();
      WIN.play();
      GAME_OVER = true;
      return;
    } else {
      LEVEL_UP.play();
    }
    brick.row++;
    createBricks();
    ball.speed += 1;
    resetBall();
    LEVEL++;
  }
};

//UPDATE GAME FUNCTION
const update = () => {
  movePaddle();

  moveBall();

  ballWallCollision();

  ballPaddleCollision();

  ballBrickCollision();

  gameOver();

  levelUp();
};

//GAME LOOP
const loop = () => {
  //CLEAR THE CANVAS
  ctx.drawImage(BG_IMAGE, 0, 0);

  draw();

  update();

  if (!GAME_OVER) requestAnimationFrame(loop);
};
loop();

//SELECT SOUND ELEMENT
const soundElement = document.getElementById('sound');

const audioManager = () => {
  //CHANGE IMAGE SOUND_ON/OFF
  let imgSrc = soundElement.getAttribute('src');
  let SOUND_IMG =
    imgSrc == 'img/SOUND_ON.png' ? 'img/SOUND_OFF.png' : 'img/SOUND_ON.png';

  soundElement.setAttribute('src', SOUND_IMG);

  //MUTE/UNMUTE SOUNDS
  WALL_HIT.muted = WALL_HIT.muted ? false : true;
  PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true;
  BRICK_HIT.muted = BRICK_HIT.muted ? false : true;
  WIN.muted = WIN.muted ? false : true;
  LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
  LEVEL_UP.muted = LEVEL_UP.muted ? false : true;
  GAME_OVER_SOUND.muted = GAME_OVER_SOUND.muted ? false : true;
};

soundElement.addEventListener('click', audioManager);

//SHOW GAME OVER MESSAGE
/*SELECT ELEMENTS*/
const gameover = document.getElementById('gameover');
const youwon = document.getElementById('youwon');
const youlose = document.getElementById('youlose');
const restart = document.getElementById('restart');

//CLICK ON PLAY AGAIN BUTTON
restart.addEventListener('click', () => location.reload()); //reload the page

//SHOW YOU WIN
const showYouWin = () => {
  gameover.style.display = 'block';
  youwon.style.display = 'block';
};

//SHOW YOU LOSE
const showYouLose = () => {
  gameover.style.display = 'block';
  youlose.style.display = 'block';
};
