/* eslint-disable no-restricted-globals */
/* eslint-disable new-cap */
/* eslint-disable no-new */

import {
  createEventClient,
  GlobalData,
  ShapeProps,
} from "@event-mapping/event-sdk";
import p5 from "p5";
import { env } from "@/env.js";

const generatePositions = (g: GlobalData, p: p5) => {
  const COLOR_MAX = 255;

  return Array.from({ length: 100 }, () => ({
    x: p.random(0, g.width),
    y: p.random(0, g.height),
    size: 100,
    color: p
      .color(
        p.random(0, COLOR_MAX),
        p.random(0, COLOR_MAX),
        p.random(0, COLOR_MAX)
      )
      .toString(),
  }));
};

type Meta = {
  color: string;
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
      const shape: ShapeProps<Meta> = {
        position: p.createVector(position.x, position.y),
        velocity: p.createVector(10, 10),
        size: { w: position.size, h: position.size },
        data: { color: position.color },
      };

      e.shapes.add(shape);
    }
  };

  p.draw = () => {
    p.background(255);

    const g = e.global;

    for (const shape of e.shapes) {
      shape.tracking();
      shape.position.add(shape.velocity);

      if (
        shape.position.x < shape.size.w / 2 ||
        shape.position.x > g.width - shape.size.w / 2
      ) {
        shape.velocity.x *= -1;
      }

      if (
        shape.position.y < shape.size.h / 2 ||
        shape.position.y > g.height - shape.size.h / 2
      ) {
        shape.velocity.y *= -1;
      }

      p.fill(p.color(shape.data.color.toString()));

      e.rect(shape.position.x, shape.position.y, shape.size.w, shape.size.h);
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
