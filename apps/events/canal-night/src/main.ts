/* eslint-disable no-restricted-globals */
/* eslint-disable new-cap */
/* eslint-disable no-new */

import { createEventClient, Shape } from "@event-mapping/event-sdk";
import p5 from "p5";
import { env } from "@/env.js";

type Meta = {
  color: p5.Color;
};

function sketch(pi: p5) {
  const p = pi;

  const rectSize = 100;

  const e = createEventClient<Meta>(p, {
    apiUrl: env.VITE_API_URL,
    wsUrl: env.VITE_WS_URL,
    sourceId: env.VITE_SOURCE_ID,
  });

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noFill();

    Array.from({ length: 30 }).forEach(() => {
      const ball: Shape<Meta> = {
        type: "circle",
        position: p.createVector(200 + rectSize, 200 + rectSize),
        velocity: p.createVector(p.random(-10, 10), p.random(-10, 10)),
        d: p.random(70, 150),
        color: p.color(p.random(255), p.random(255), p.random(255)),
      };

      e.shapes.add(ball);
    });
  };

  p.draw = () => {
    if (!e.initialized) return;
    e.draw();

    p.background(255);

    for (const shape of e.shapes) {
      if (shape.type !== "circle") continue;

      shape.position.add(shape.velocity);

      if (
        shape.position.x < shape.d / 2 + rectSize ||
        shape.position.x > e.global.width - rectSize - shape.d / 2
      ) {
        shape.velocity.x *= -1;
      }
      if (
        shape.position.y < shape.d / 2 + rectSize ||
        shape.position.y > e.global.height - rectSize - shape.d / 2
      ) {
        shape.velocity.y *= -1;
      }

      p.fill(shape.color);
      p.ellipse(shape.position.x, shape.position.y, shape.d, shape.d);
    }

    p.fill(255, 87, 51);
    p.rect(0, 0, rectSize, e.global.height);

    p.fill(51, 255, 87);
    p.rect(0, 0, e.global.width, rectSize);

    p.fill(51, 87, 255);
    p.rect(e.global.width - rectSize, 0, rectSize, e.global.height);

    p.fill(255, 51, 166);
    p.rect(0, e.global.height - rectSize, e.global.width, rectSize);
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
