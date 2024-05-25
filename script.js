window.addEventListener('load', ()=>{
  // set up constants
  const _w = window.innerWidth;
  const _h = window.innerHeight;
  const _l = Math.min(_w, _h);  // side length, the smaller of window width/height

  // set up canvas
  const c = document.getElementById('canv');
  const ctx = c.getContext('2d');
  c.width = c.height = _l;


  // set up global lissa settings
  let lissaNum = 5 + (Math.round(_l / 100));   // total number of lissajous curves to show
  let sizeRatio = (lissaNum / 16); // this ratio will affect the size of the grid, animation speed, and dot size depending on screen real estate
  let fadeIntensity = 0;  // between 0 and 1, incl. Closer to 0 = more ghosting. Closer to 1 = more fading.
  let lissaDotSize = 1.25 * sizeRatio; // the size of the dot tracing each curve
  let lissaPadding = 6;   // padding between each curve

  /* these should be left alone, since their values are derived */
  let lissaSize = _l / lissaNum;
  let lissaDi = lissaSize - lissaPadding;
  let lissaRad = lissaDi / 2;
  let lissaTimer = 0;
  let lissas = [];
  let updateSpeed = (Math.PI / 200) / sizeRatio;    // the relative distance through the curve each point should advance per frame
  // updateSpeed is also adjusted in the animation loop based on the time between requestAnimationFrame calls,
  // which equalizes animation speed across multiple device frame rates

  // set up lissa prototype
  class Lissa {
    constructor(xFactor, yFactor) {
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
      this.rComp = 100 + (155 / (c.width / this.origin.x));
      this.gComp = 100 + (155 / (((c.width / this.origin.x)) / (c.height / this.origin.y)));
      this.bComp = 100 + (155 / (c.height / this.origin.y));
      this.color = 'rgb(' + this.rComp + ',' + this.gComp + ',' + this.bComp + ')';
    }
    // update the dot on each iteration
    updateDot() {
      this.dot.lastX = this.dot.x;
      this.dot.lastY = this.dot.y;
      this.dot.x = (lissaRad * Math.cos(lissaTimer * this.xFactor)) + this.origin.x;
      this.dot.y = (lissaRad * Math.sin(lissaTimer * this.yFactor)) + this.origin.y;
    }
    // draw using the dot.lastX/Y and dot.x/y props
    draw() {
      let currentLissa = this;
      ctx.lineWidth = lissaDotSize;
      ctx.strokeStyle = currentLissa.color;
      ctx.beginPath();
      ctx.moveTo(currentLissa.dot.lastX, currentLissa.dot.lastY);
      ctx.lineTo(currentLissa.dot.x, currentLissa.dot.y);
      ctx.stroke();
      ctx.closePath();
      /*
      using lineTo between the previous/current dot positions ended up being a more satisfying
      effect than using the arc() drawing method, since the line you trace ends up being continuous.
      with arc, at higher speeds, the dots begin to break apart, resulting in a more pixelated curve
      */
    }
  }

  // clears the frame to a specified level of opacity, a float between 0 and 1, inclusive
  function clearFrame(opacity) {
    if (!isNaN(opacity)) {  // checking if the opacity variable is a number; because, why not?
      ctx.fillStyle = 'rgba(0,0,0,' + opacity + ')';
    } else {
      return false;
    }
    ctx.fillRect(0, 0, _l, _l);
  };

  let ghostingFading = false;

  // these variables will adjust each curve's movement speed to match the frame rate of the device (the time between rAF calls)
  let firstFrameTime = performance.now();
  let refreshThrottle = 1;
  let tempRefreshThrottle = 0;

  function animate(callbackTime) {
    // target 30fps by dividing the time between rAF callbacks by 30 to calculate per-frame movement
    tempRefreshThrottle = callbackTime - firstFrameTime;
    firstFrameTime = callbackTime;
    refreshThrottle = tempRefreshThrottle / 30;
    
    // reset the timer to 0 once a rotation of 2pi is complete
    if (lissaTimer >= 2 * Math.PI) {
      lissaTimer = 0;
      if (!ghostingFading) {
          ghostingFading = true;
      } else {
          ghostingFading = false;
          fadeIntensity = 0;
      }
    } else {
      lissaTimer += (updateSpeed * refreshThrottle);    // apply calculated refreshThrottle to the timer
      if (ghostingFading) {
          fadeIntensity += 0.0001;
      }
    }

    clearFrame(fadeIntensity);
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
    animate(0);
  };

  // begin!
  init();
});