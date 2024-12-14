/* eslint-disable no-restricted-globals */
/* eslint-disable new-cap */
/* eslint-disable no-new */

import { createEventClient } from "@event-mapping/event-sdk";
import p5 from "p5";
import { env } from "@/env.js";

let capture: p5.Element;

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

    capture = p.createCapture("video", { flipped: true } as never);

    capture.hide();
  };

  p.draw = () => {
    e.transform(() => {
      p.image(capture, 0, 0, e.global.width, e.global.height);
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
