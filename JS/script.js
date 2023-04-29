const canvasEl = document.querySelector('canvas'),
  canvasCtx = canvasEl.getContext('2d');
gapX = 10;

const mouse = { x: 0, y: 0 };

// Objeto campo
const field = {
  w: window.innerWidth,
  h: window.innerHeight,
  draw: function () {
    canvasCtx.fillStyle = '#286047';
    canvasCtx.fillRect(0, 0, this.w, this.h);
  },
};

// Objeto linha
const line = {
  w: 15,
  h: field.h,
  draw: function () {
    canvasCtx.fillStyle = '#ffffff';
    canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h);
  },
};

// Objeto raquete esquerda
const leftPaddle = {
  x: gapX,
  y: 0,
  w: line.w,
  h: 55,
  _move: function () {
    this.y = mouse.y - this.h / 2;
  },
  draw: function () {
    canvasCtx.fillStyle = '#ffffff';
    canvasCtx.fillRect(this.x, this.y, this.w, this.h);

    this._move();
  },
};

// Objeto raquete direita
const rightPaddle = {
  x: field.w - line.w - gapX,
  y: 0,
  w: line.w,
  h: 85,
  speed: 5,
  _move: function () {
    if (this.y + this.h / 2 < ball.y + ball.r) {
      this.y += this.speed;
    } else {
      this.y -= this.speed;
    }
  },
  speedUp: function () {
    this.speed += 0.95;
  },
  draw: function () {
    canvasCtx.fillStyle = '#ffffff';
    canvasCtx.fillRect(this.x, this.y, this.w, this.h);

    this._move();
  },
};

// Objeto placar
const score = {
  human: 0,
  computer: 0,
  increaseHuman: function () {
    this.human++;
  },
  increaseComputer: function () {
    this.computer++;
  },
  draw: function () {
    canvasCtx.fillStyle = '#ffffff';
    canvasCtx.font = 'bold 72px Arial';
    canvasCtx.textAlign = 'center';
    canvasCtx.textBaseline = 'top';
    canvasCtx.fillStyle = '#01341D';
    canvasCtx.fillText(this.human, field.w / 4, 50);
    canvasCtx.fillText(this.computer, field.w / 4 + window.innerWidth / 2, 50);
  },
};

// Objeto bola
const ball = {
  x: field.w / 2,
  y: field.h / 2,
  r: 20,
  speed: 8,
  directionX: 1,
  directionY: 1,
  _calcPosition: function () {
    // Verifica se o jogador 1 fez um ponto (x > largura do campo)
    if (this.x > field.w - this.r - rightPaddle.w - gapX) {
      // Verifica se a raquete direita está na posição y da bola
      if (
        this.y + this.r > rightPaddle.y &&
        this.y - this.r < rightPaddle.y + rightPaddle.h
      ) {
        // Rebate a bola invertendo o sinal de X
        this._reverseX();
      } else {
        // Pontuar o jogador 1
        score.increaseHuman();
        this._pointUp();
      }
    }

    // Verifica se o jogador 2 fez um ponto (x < 0)
    if (this.x < this.r + leftPaddle.w + gapX) {
      // Verifica se a raquete esquerda está na posição y da bola
      if (
        this.y + this.r > leftPaddle.y &&
        this.y - this.r < leftPaddle.y + leftPaddle.h
      ) {
        // Rebate a bola invertendo o sinal de X
        this._reverseX();
      } else {
        // Pontuar o jogador 2
        score.increaseComputer();
        this._pointUp();
      }
    }

    // Verifica as laterais superior e inferior do campo
    if (
      (this.y - this.r < 0 && this.directionY < 0) ||
      (this.y > field.h - this.r && this.directionY > 0)
    ) {
      // Rebate a bola revertendo o sinal do eixo y
      this._reverseY();
    }
  },
  _reverseX: function () {
    // 1 * -1 = 1
    // -1 * -1 = 1
    this.directionX *= -1.0095;
  },
  _reverseY: function () {
    // 1 * -1 = 1
    // -1 * -1 = 1
    this.directionY *= -1.0095;
  },
  _speedUp: function () {
    this.speed += 0;
  },
  _pointUp: function () {
    this._speedUp();
    rightPaddle.speedUp();

    this.x = field.w / 2;
    this.x = field.h / 2;
  },
  _move: function () {
    this.x += this.directionX * this.speed;
    this.y += this.directionY * this.speed;
  },
  draw: function () {
    canvasCtx.fillStyle = '#ffffff';
    canvasCtx.beginPath();
    canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    canvasCtx.fill();

    this._calcPosition();
    this._move();
  },
};

function setup() {
  canvasEl.width = canvasCtx.width = field.w;
  canvasEl.height = canvasCtx.height = field.h;
}

function draw() {
  // desenha o campo
  field.draw();

  // desenha linha central
  line.draw();

  // desenha a raquete esquerda
  leftPaddle.draw();

  // desenha a raquete direita
  rightPaddle.draw();

  // desenha a bolinha
  ball.draw();

  // desenha o placar
  score.draw();
}

window.animateFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      return window.setTimeout(callback, 1000 / 60);
    }
  );
})();

function main() {
  animateFrame(main);
  draw();
}

setup();
main();

canvasEl.addEventListener('mousemove', function (e) {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
});