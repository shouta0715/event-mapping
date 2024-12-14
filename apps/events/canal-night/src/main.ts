/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
/* eslint-disable new-cap */
/* eslint-disable no-new */

import {
  createEventClient,
  ShapeMeta,
  TTrackingData,
} from "@event-mapping/event-sdk";
import Matter from "matter-js";
import p5 from "p5";
import { env } from "@/env.js";

interface Meta extends ShapeMeta {
  body: Matter.Body;
  image: string;
}

interface TrackingMeta extends TTrackingData {
  image: string;
}

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

  const e = createEventClient<Meta, TrackingMeta>(p, {
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

  const createCircle = (
    id: string,
    x: number,
    y: number,
    velocity: p5.Vector,
    size?: number
  ) => {
    const d =
      size ?? p.random() * (MAX_BALL_SIZE - MIN_BALL_SIZE) + MIN_BALL_SIZE;

    const circle = Bodies.circle(x, y, d / 2, {
      restitution: 1.0,
      friction: 0,
      frictionAir: 0,
      label: id,
    });

    Composite.add(world, circle);
    Matter.Body.setVelocity(circle, velocity);

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
    if (!world) return;
    p.background(0);
    Engine.update(engine);

    for (const shape of e.shapes) {
      shape.tracking();

      shape.move(shape.meta.body.position.x, shape.meta.body.position.y, {
        operation: "set",
      });

      const img = e.images.get(shape.meta.image);

      if (!img) return;

      e.transform(() =>
        p.image(
          img,
          shape.position.x,
          shape.position.y,
          shape.size.w,
          shape.size.h
        )
      );
    }

    for (const wall of walls) {
      const { width, height } = matterSizeToP5Size(wall.bounds);

      p.fill("#fff");
      e.transform(() =>
        p.rect(wall.position.x, wall.position.y, width, height)
      );
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  e.images.uploaded = (data) => {
    if (!data.isAdmin) return;
    const initialPosition = {
      x: 500,
      y: e.global.height - 300,
    };

    const velocity = p.createVector(p.random(0.01, 1), p.random(0.01, 1));

    const { d, ...circle } = createCircle(
      data.id,
      initialPosition.x,
      initialPosition.y,
      velocity
    );

    e.shapes.tracking(
      {
        position: p.createVector(circle.position.x, circle.position.y),
        velocity,
        size: { w: d, h: d },
        meta: { image: data.id, body: circle },
        shareData: { image: data.id },
      },
      { isCircle: true, isCenter: true }
    );
  };

  e.updatedGlobal = (global) => {
    renderWall(global.width, global.height);
  };

  e.shapes.enter = (id, { meta, position, velocity, size }) => {
    const { ...circle } = createCircle(
      id,
      position.x,
      position.y,
      velocity,
      size.w
    );

    e.shapes.add({
      id,
      position,
      velocity,
      size,
      meta: {
        body: circle,
        image: meta.image,
      },
    });
  };

  e.shapes.exit = (id) => {
    const target = e.shapes.get(id);

    if (!target) return;

    const removeTarget = Matter.Composite.get(
      world,
      target.meta.body.id,
      "body"
    );

    Matter.Composite.remove(world, removeTarget, true);

    e.shapes.remove(id);
    e.images.remove(id);
  };

  e.prompt = () => {
    for (const body of Matter.Composite.allBodies(world)) {
      const windForce = p.createVector(
        p.random(-0.5, 0.5),
        p.random(-0.5, 0.5)
      );
      Matter.Body.applyForce(body, body.position, windForce);
    }
  };
}

function start() {
  const parent = document.querySelector<HTMLDivElement>("#app");
  if (!parent) throw new Error("No parent element found");

  new p5(sketch, parent);
}

start();
