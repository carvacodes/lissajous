// set up constants
const _w = window.innerWidth;
const _h = window.innerHeight;
const _l = Math.min(_w, _h);  // side length, the smaller of window width/height
const c = document.getElementById('canv');
const ctx = c.getContext('2d');

// set up canvas
c.width = c.height = _l;
let ghostingIntensity = 0.033;  // between 0 and 1, incl. Closer to 0 = more ghosting

// set up global lissa settings
/**************************************************************/
/* if you want to play around with stuff, try altering these: */
/**************************************************************/
let lissaNum = 15;   // total number of lissajous curves to show; gets pretty crowded over 15
let lissaPadding = 6;   // padding between each curve
let lissaDotSize = 2; // the size of the dot tracing each curve

/* these should be left alone, since their values are important (and also derived) */
let lissaSize = _l / lissaNum;
let lissaDi = lissaSize - lissaPadding;
let lissaRad = lissaDi / 2;
let lissaTimer = 0;
let lissas = [];

// set up lissa prototype
function Lissa(xFactor, yFactor) {
  this.xFactor = xFactor;
  this.yFactor = yFactor;
  // the center of each lissa
  this.origin = {
    x: ((xFactor) * lissaSize) + lissaRad,
    y: ((yFactor) * lissaSize) + lissaRad 
  };
  // the dot that will track the current position in the pattern
  this.dot = {
    x: this.origin.x + lissaRad,
    y: this.origin.y,
    lastX: this.origin.x + lissaRad,
    lastY: this.origin.y
  };
  // color variables
  this.rComp = Math.round(Math.random() * 155) + 100;
  this.gComp = Math.round(Math.random() * 155) + 100;
  this.bComp = Math.round(Math.random() * 155) + 100;
  this.color = 'rgb(' + this.rComp + ',' + this.gComp + ',' + this.bComp + ')';
}

// update the dot on each iteration
Lissa.prototype.updateDot = function(){
  this.dot.lastX = this.dot.x;
  this.dot.lastY = this.dot.y;
  this.dot.x = (lissaRad * Math.cos(lissaTimer * this.xFactor)) + this.origin.x;
  this.dot.y = (lissaRad * Math.sin(lissaTimer * this.yFactor)) + this.origin.y;
};

// draw using the dot.lastX/Y and dot.x/y props
Lissa.prototype.draw = function(){
  let currentLissa = this;
  ctx.lineWidth = lissaDotSize;
  ctx.strokeStyle = currentLissa.color;
  ctx.beginPath();
  ctx.moveTo(currentLissa.dot.lastX, currentLissa.dot.lastY);
  ctx.lineTo(currentLissa.dot.x, currentLissa.dot.y);
  ctx.stroke();
  ctx.closePath();
  /*
  using lineTo between the previous/current dot positions ended up being a more satisfying effect than using the arc() drawing method, since the line you trace ends up being continuous. at higher speeds, the dots begin to break apart, resulting in a [more] pixelated lissajous
  */
};

// clears the frame to a specified level of opacity, a float between 0 and 1, inclusive
function clearFrame(opacity) {
  if (!isNaN(opacity)) {  // checking if the opacity variable is a number; because, why not?
    ctx.fillStyle = 'rgba(12,4,20,' + opacity + ')';
  } else {
    return false;
  }
  ctx.fillRect(0, 0, _l, _l);
};

// animation function
function animate() {
  lissaTimer = lissaTimer >= 2 * Math.PI ? 0 : lissaTimer + (Math.PI / 360); // resets the timer to 0 once a rotation of 2pi is complete
  clearFrame(ghostingIntensity);
  lissas.forEach(function(lissa){
    lissa.updateDot();
    lissa.draw();
  })
  window.requestAnimationFrame(animate);
};

// initialization function
function init() {
  // populate the lissas array with lissas
  for (let lissaX = 0; lissaX < lissaNum; lissaX++) {
    for (let lissaY = 0; lissaY < lissaNum; lissaY++) {
      let l = new Lissa(lissaX, lissaY);
      lissas.push(l);
    }
  }
  animate();
};

// begin!
init();