CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
};
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const PI = Math.PI;
const twoPI = Math.PI * 2;

function int(txtnum) {
  return parseInt(txtnum);
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function randomArray(array) {
  return array[Math.round(random(0, array.length - 1))];
}

function degAngleRange(degrees) {
  return (degrees + 360) % 360;
}

function rads2degs(radians) {
  let oldrange = radians * (180 / PI);
  return (oldrange + 360) % 360;
}

function degs2rads(degrees) {
  return degrees * (PI / 180);
}

function invertAngle(degAngle) {
  return (degAngle + 180) % 360;
}

function angleFromPoints(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}

function distanceB2Points(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

let isdragging = false;
let dragModifier = 1;

let raf;
const defupdatefps = 30;
let updatefps = defupdatefps;
let updatetimer;

let pause = false;

let currLevel = 1;
let lives = 3;

let segmentValue = 5;
let numMaxSegments = 100 / segmentValue;

let shaketimer;

let keymap = {
  left: ["ArrowLeft", "KeyA", "Numpad4"],
  right: ["ArrowRight", "KeyD", "Numpad6"],
  up: ["ArrowUp", "KeyW", "Numpad8"],
  down: ["ArrowDown", "KeyS", "Numpad2"],
  pause: ["Escape", "Pause"],
  mute: ["KeyM"],
  theme: ["KeyT"],
  lang: ["KeyL"],
};

let keyspressed = {
  l: false,
  r: false,
  u: false,
  d: false,
};

  mousedown(e.changedTouches[0]);
};
canvas.ontouchmove = function (e) {
  e.preventDefault();
  mousemove(e.changedTouches[0]);
};
canvas.ontouchend = function (e) {
  e.preventDefault();
  mouseup(e.changedTouches[0]);
};

let tnum = 0;
let lnum = 1;

function keydown(e) {
  if (!pause) {
    if (keymap.left.includes(e.code)) {
      keyspressed.l = true;
    }
    if (keymap.right.includes(e.code)) {
      keyspressed.r = true;
    }
    if (keymap.up.includes(e.code)) {
      keyspressed.u = true;
    }
    if (keymap.down.includes(e.code)) {
      keyspressed.d = true;
    }
  }

  if (keymap.mute.includes(e.code)) {
    if (soundMute) {
      soundMute = false;
    } else {
      soundMute = true;
    }
    floatingTexts.push(new FloatingText(soundMute ? "Mute" : "UnMute", myloading.x, myloading.y));
  }

  if (keymap.theme.includes(e.code)) {
    theme = themes[tnum];
    if (e.shiftKey) {
      tnum -= 1;
      if (tnum < 0) {
        tnum = themes.length - 1;
      }
    } else {
      tnum = (tnum + 1) % themes.length;
    }
    floatingTexts.push(new FloatingText(theme.themename, myloading.x, myloading.y));
  }

  if (keymap.lang.includes(e.code)) {
    lang = langs[lnum];
    if (e.shiftKey) {
      lnum -= 1;
      if (lnum < 0) {
        lnum = langs.length - 1;
      }
    } else {
      lnum = (lnum + 1) % langs.length;
    }
    document.dir = lang.dir;
    canvas.dir = lang.dir;
    document.title = lang.loading;
    if (pause) {
      document.title = txt("loading") + " (" + txt("paused") + ")";
    }
    floatingTexts.push(new FloatingText(lang.langname, myloading.x, myloading.y));
  }

  if (keymap.pause.includes(e.code)) {
    togglePause();
  }
}

function keyup(e) {
  if (keymap.left.includes(e.code)) {
    keyspressed.l = false;
  }
  if (keymap.right.includes(e.code)) {
    keyspressed.r = false;
  }
  if (keymap.up.includes(e.code)) {
    keyspressed.u = false;
  }
  if (keymap.down.includes(e.code)) {
    keyspressed.d = false;
  }
}

document.onkeydown = keydown;

document.onkeyup = keyup;

//-----------------------------------------

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initialize() {
  resize();
  reset();
  window.clearInterval(updatetimer);
  updatetimer = window.setInterval(updateFrame, 1000 / updatefps);
  raf = window.requestAnimationFrame(drawFrame);
  document.dir = lang.dir;
  canvas.dir = lang.dir;
  document.title = lang.loading;
}

window.onload = initialize;
window.onresize = resize;
