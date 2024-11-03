/* eslint-disable no-restricted-globals */
/* eslint-disable new-cap */
/* eslint-disable no-new */

import { createEventClient, GlobalData } from "@event-mapping/event-sdk";
import p5 from "p5";
import { env } from "@/env.js";

type Meta = {
  color: p5.Color;
};

let g: GlobalData;
let angle = 0; // 初期の角度

// 羽の数
const bladeCount = 20;

let blades: {
  angle: number;
  color: p5.Color;
}[] = [];

function sketch(pi: p5) {
  const p = pi;

  const e = createEventClient<Meta>(p, {
    apiUrl: env.VITE_API_URL,
    wsUrl: env.VITE_WS_URL,
    sourceId: env.VITE_SOURCE_ID,
  });

  e.setup = (globalData) => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noFill();
    p.angleMode(p.DEGREES);
    g = globalData;

    blades = Array.from({ length: bladeCount }, (_, i) => {
      return {
        angle: (i * 360) / bladeCount,
        color: p.color(p.random(255), p.random(255), p.random(255)),
      };
    });
  };

  p.draw = () => {
    p.background(255);

    for (const blade of blades) {
      const currentG = g;
      const currentAngle = angle;

      p.push();
      e.transform(() => {
        p.translate(currentG.width / 2, currentG.height / 2);
        p.rotate(currentAngle + blade.angle);

        p.fill(blade.color);
        p.noStroke();
        p.rect(0, -10, currentG.width / 2, 60);
      });
      p.pop();
    }

    angle += 0.02; // 角度を増やして回転を表現
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
