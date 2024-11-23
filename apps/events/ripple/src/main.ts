/* eslint-disable no-restricted-globals */
/* eslint-disable new-cap */
/* eslint-disable no-new */

import { createEventClient } from "@event-mapping/event-sdk";
import p5 from "p5";
import { env } from "@/env.js";

const ripples: {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}[] = [];

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

    ripples.forEach((ripple, i) => {
      const ri = ripples[i];
      if (!ri) return;

      p.stroke(77, 215, 227, ri.alpha);
      p.strokeWeight(4);
      e.ellipse(ri.x, ri.y, ri.radius * 10, ri.radius * 10);

      ri.radius += 1;
      ri.alpha -= 1;

      if (ri.alpha <= 0) {
        ripples.splice(i, 1);
      }
    });
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  e.mousePressed = ({ x, y }) => {
    ripples.push({
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
