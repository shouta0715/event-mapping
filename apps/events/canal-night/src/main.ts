/* eslint-disable no-restricted-globals */
/* eslint-disable new-cap */
/* eslint-disable no-new */

import { createEventClient } from "@event-mapping/event-sdk";
import Matter from "matter-js";
import p5 from "p5";
import { env } from "@/env.js";

type Meta = {
  body: Matter.Body;
  image: p5.Image;
  velocity: p5.Vector;
};

const MAX_BALL_SIZE = 400;
const MIN_BALL_SIZE = 300;
const WALL_THICKNESS = 40;

const { Engine, Bodies, Composite } = Matter;

const matterSizeToP5Size = (bounds: Matter.Bounds) => {
  const { min, max } = bounds;

  return {
    width: max.x - min.x,
    height: max.y - min.y,
  };
};

function sketch(pi: p5) {
  const p = pi;

  let engine: Matter.Engine;
  let world: Matter.World;
  let runner: Matter.Runner;
  let walls: Matter.Body[] = [];

  const e = createEventClient<Meta>(p, {
    apiUrl: env.VITE_API_URL,
    wsUrl: env.VITE_WS_URL,
    sourceId: env.VITE_SOURCE_ID,
  });

  const renderWall = (width: number, height: number) => {
    const options = {
      isStatic: true,
      label: "wall",
    };

    const top = Bodies.rectangle(
      width / 2,
      WALL_THICKNESS / 2,
      width,
      WALL_THICKNESS,
      options
    );
    const right = Bodies.rectangle(
      width - WALL_THICKNESS / 2,
      height / 2,
      WALL_THICKNESS,
      height,
      options
    );
    const left = Bodies.rectangle(
      WALL_THICKNESS / 2,
      height / 2,
      WALL_THICKNESS,
      height,
      options
    );
    const bottom = Bodies.rectangle(
      width / 2,
      height - WALL_THICKNESS / 2,
      width,
      WALL_THICKNESS,
      options
    );

    Composite.add(world, [top, right, left, bottom]);
    walls = [top, right, left, bottom];
  };

  const createCircle = (x: number, y: number) => {
    const d = Math.random() * (MAX_BALL_SIZE - MIN_BALL_SIZE) + MIN_BALL_SIZE;

    const circle = Bodies.circle(x, y, d / 2, {
      restitution: 1.0,
      friction: 0,
      frictionAir: 0,
    });

    Composite.add(world, circle);

    return { ...circle, d };
  };

  e.setup = (g) => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noFill();

    engine = Engine.create();
    world = engine.world;

    runner = Matter.Runner.create();

    Matter.Runner.run(runner, engine);

    renderWall(g.width, g.height);

    engine.gravity.y = 0;
    p.rectMode(p.CENTER);
    p.imageMode(p.CENTER);
  };

  p.draw = () => {
    p.background(0);
    Engine.update(engine);

    for (const shape of e.shapes) {
      if (shape.type !== "circle") continue;

      e.transform(() =>
        p.image(
          shape.image,
          shape.body.position.x,
          shape.body.position.y,
          shape.d,
          shape.d
        )
      );
    }

    for (const wall of walls) {
      const { width, height } = matterSizeToP5Size(wall.bounds);

      e.rect(wall.position.x, wall.position.y, width, height);
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  e.uploadedImage = (img) => {
    const { d, ...circle } = createCircle(500, 500);

    const velocity = p.createVector(p.random(-10, 10), p.random(-10, 10));
    Matter.Body.setVelocity(circle, velocity);

    e.shapes.add({
      type: "circle",
      position: p.createVector(200, 200),
      velocity,
      d,
      image: img,
      body: circle,
    });
  };
}

function start() {
  const parent = document.querySelector<HTMLDivElement>("#app");
  if (!parent) throw new Error("No parent element found");

  new p5(sketch, parent);
}

start();
