/* eslint-disable no-restricted-globals */
/* eslint-disable new-cap */
/* eslint-disable no-new */

import { createEventClient, GlobalData, Shape } from "@event-mapping/event-sdk";
import p5 from "p5";
import { env } from "@/env.js";

const generatePositions = (g: GlobalData, p: p5) => {
  const COLOR_MAX = 255;

  return Array.from({ length: 30 }, () => ({
    x: p.random(0, g.width),
    y: p.random(0, g.height),
    size: p.random(0, 200),
    color: p.color(
      p.random(0, COLOR_MAX),
      p.random(0, COLOR_MAX),
      p.random(0, COLOR_MAX)
    ),
  }));
};

type Meta = {
  color: p5.Color;
};

function sketch(pi: p5) {
  const p = pi;

  const e = createEventClient<Meta>(p, {
    apiUrl: env.VITE_API_URL,
    wsUrl: env.VITE_WS_URL,
    sourceId: env.VITE_SOURCE_ID,
  });

  e.setup = (g) => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noFill();

    const positions = generatePositions(g, p);

    for (const position of positions) {
      const shape: Shape<Meta> = {
        type: "rect",
        position: p.createVector(position.x, position.y),
        velocity: p.createVector(0, 0),
        h: position.size,
        w: position.size,
        color: position.color,
      };

      e.shapes.add(shape);
    }
  };

  p.draw = () => {
    p.background(255);

    for (const shape of e.shapes) {
      if (shape.type !== "rect") continue;

      p.fill(p.color(shape.color));
      e.rect(shape.position.x, shape.position.y, shape.w, shape.h);
    }
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
