# Lissajous Patterns

In this demo, an animated grid of [lissajous curves](https://en.wikipedia.org/wiki/Lissajous_curve) are drawn to an HTML canvas using vanilla JavaScript.

Each curve has a point (a "dot") associated with it that draws a piece of its curve on every window animation frame (via `window.requestAnimationFrame`). The farther right or farther down each grid square is, the faster its dot's X or Y coordinate (respectively) moves. Setting the HTML `<canvas>` element's `fadeIntensity` value to 0 initially allows the user to see the geometry of the curves as they relate to one another, and neatly visualizes how changing the X or Y oscillation speed changes the resulting graph.

## Latest Updates

A slower update speed is now used for the `lissaTimer` variable that controls the speed of each dot's position (specifically, `lissaTimer += (Math.PI / 360)` was updated to `lissaTimer += (Math.PI / 720)` per animation frame). 

A new `ghostingFading` boolean variable and associated logic were implemented. The `ghostingFading` variable is initially set to `false`, allowing for "full ghosting" of each dot; that is, the canvas is not blanked out at the end of each frame, allowing the drawn pattern to persist on the canvas. After `lissaTimer` hits its maximum value (`>= Math.PI * 2`), the `ghostingFading` variable is set to true, causing the `fadeIntensity` value to begin climbing, and causing the `clearFrame` method to fill in an increasingly opaque black background until the curve patterns fade out. The `ghostingFading` variable is set back to false once `lissaTimer` maxes out again, `fadeIntensity` is set to 0 to allow the curves to persist frame by frame, and the cycle continues.

The pattern prototype color properties were originally set to random values between 155 and 255. They are now coordinated to their given position in the window, allowing for a smooth color gradient from one pattern to the next:

```javascript
  // color variables
  this.rComp = 100 + (155 / (c.width / this.origin.x));
  this.gComp = 100 + (155 / (((c.width / this.origin.x)) / (c.height / this.origin.y)));
  this.bComp = 100 + (155 / (c.height / this.origin.y));
  this.color = 'rgb(' + this.rComp + ',' + this.gComp + ',' + this.bComp + ')';
```