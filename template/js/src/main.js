import { createEventClient } from "@event-mapping/event-sdk";
import p5 from "p5";
import { env } from "./env.js";

function sketch(pi) {
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

  p.draw = () => {};

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
}

function start() {
  const parent = document.querySelector("#app");
  if (!parent) throw new Error("No parent element found");

  new p5(sketch, parent);
}

start();
