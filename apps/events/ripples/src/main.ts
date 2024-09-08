/* eslint-disable new-cap */
/* eslint-disable no-new */
import p5 from "p5";

type Ripple = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
};

const ripples: Ripple[] = [];

function sketch(pi: p5) {
  const p = pi;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noFill();
  };

  p.draw = () => {
    p.background(0);

    ripples.forEach((ripple, index) => {
      const r = ripple;
      p.stroke(77, 215, 227, r.alpha);
      p.strokeWeight(4);
      p.ellipse(r.x, r.y, r.radius * 2);

      r.radius += 5;
      r.alpha -= 2;

      if (r.alpha <= 0) {
        ripples.splice(index, 1);
      }
    });
  };

  p.mousePressed = () => {
    ripples.push({
      x: p.mouseX,
      y: p.mouseY,
      radius: 1,
      alpha: 255,
    });
  };
}

function start() {
  const parent = document.querySelector<HTMLDivElement>("#app");
  if (!parent) throw new Error("No parent element found");

  new p5(sketch, parent);
}

start();
