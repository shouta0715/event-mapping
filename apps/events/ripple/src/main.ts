/* eslint-disable no-restricted-globals */
/* eslint-disable new-cap */
/* eslint-disable no-new */

import { createEventClient } from "@event-mapping/event-sdk";
import p5 from "p5";
import { env } from "@/env.js";

type Ripple = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
};

const clickedRipples: Ripple[] = [];

const doubleClickedRipples: Ripple[] = [];

function sketch(pi: p5) {
  const p = pi;

  const e = createEventClient(p, {
    apiUrl: env.VITE_API_URL,
    wsUrl: env.VITE_WS_URL,
    sourceId: env.VITE_SOURCE_ID,
  });

  e.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noFill();
  };

  p.draw = () => {
    p.background(0);

    clickedRipples.forEach((ripple, i) => {
      const ri = clickedRipples[i];
      if (!ri) return;

      p.stroke(77, 215, 227, ri.alpha);
      p.strokeWeight(4);
      p.fill(0);
      e.ellipse(ri.x, ri.y, ri.radius * 10, ri.radius * 10);

      ri.radius += 1;
      ri.alpha -= 1;

      if (ri.alpha <= 0) {
        clickedRipples.splice(i, 1);
      }
    });

    doubleClickedRipples.forEach((ripple, i) => {
      const ri = doubleClickedRipples[i];
      if (!ri) return;

      p.stroke(255, 255, 0, ri.alpha);
      p.strokeWeight(4);

      e.quad(
        ri.x,
        ri.y,
        ri.x + 100,
        ri.y,
        ri.x + 100,
        ri.y + 100,
        ri.x,
        ri.y + 100
      );

      ri.alpha -= 5;

      if (ri.alpha <= 0) {
        doubleClickedRipples.splice(i, 1);
      }
    });

    e.getMouses().forEach((mouse) => {
      p.stroke(255, 0, 0);
      p.fill(0, 0, 0);
      e.ellipse(mouse.x, mouse.y, 100, 100);
    });

    p.textSize(32);
    p.fill(255);
    e.transform(() => p.text(`${e.mouseX}, ${e.mouseY}`, e.mouseX, e.mouseY));
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  e.mousePressed = ({ x, y }) => {
    clickedRipples.push({
      x,
      y,
      radius: 0,
      alpha: 255,
    });
  };

  e.mouseDoubleClicked = ({ x, y }) => {
    doubleClickedRipples.push({
      x,
      y,
      radius: 0,
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
