/* eslint-disable new-cap */
/* eslint-disable no-new */
import p5 from "p5";

function sketch(pi: p5) {
  const p = pi;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    p.background(220);
  };
}

function start() {
  const parent = document.querySelector<HTMLDivElement>("#app");
  if (!parent) throw new Error("No parent element found");

  new p5(sketch, parent);
}

start();
