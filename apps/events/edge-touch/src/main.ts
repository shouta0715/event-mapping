/* eslint-disable no-restricted-globals */
/* eslint-disable new-cap */
/* eslint-disable no-new */

import { createEventClient } from "@event-mapping/event-sdk";
import p5 from "p5";
import { env } from "@/env.js";

type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: p5.Color;
  speed: number;
};

const rectangles: Rectangle[] = [];

function sketch(pi: p5) {
  const p = pi;

  const e = createEventClient(p, {
    apiUrl: env.VITE_API_URL,
    wsUrl: env.VITE_WS_URL,
    sourceId: env.VITE_SOURCE_ID,
  });

  e.setup = (g) => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noFill();

    const maxHeight = g.height;

    const count = Math.floor(maxHeight / 200);

    Array.from({ length: count }).forEach((_, i) => {
      rectangles.push({
        x: 0,
        y: i * 200,
        width: 100,
        height: 100,
        color: p.color(p.random(255), p.random(255), p.random(255)),
        speed: p.random(1, 10),
      });
    });
  };

  p.draw = () => {
    p.background(255);

    rectangles.forEach((_, i) => {
      const target = rectangles[i + 1];

      if (!target) return;

      p.fill(target.color);

      e.rect(target.x, target.y, target.width, target.height);

      target.x += target.speed;

      if (target.x > e.global.width - target.width || target.x <= 0) {
        target.speed *= -1;
      }
    });
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
}

function start() {
  const parent = document.querySelector<HTMLDivElement>("#app");
  if (!parent) throw new Error("No parent element found");

  new p5(sketch, parent);
}

start();
