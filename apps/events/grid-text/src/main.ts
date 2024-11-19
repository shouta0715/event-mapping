/* eslint-disable no-restricted-globals */
/* eslint-disable new-cap */
/* eslint-disable no-new */

import { createEventClient } from "@event-mapping/event-sdk";
import p5 from "p5";
import { env } from "@/env.js";

function sketch(pi: p5) {
  const p = pi;

  const e = createEventClient(p, {
    apiUrl: env.VITE_API_URL,
    wsUrl: env.VITE_WS_URL,
    sourceId: env.VITE_SOURCE_ID,
  });

  e.setup = (g) => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(255);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize((g.height / 100) * 3);
  };

  p.draw = () => {
    p.background(255);

    const cols = 10;
    const rows = 10;
    const cellWidth = e.global.width / cols;
    const cellHeight = e.global.height / rows;

    let num = 0;

    const rowIndices = Array.from({ length: rows }, (_, i) => i);
    const colIndices = Array.from({ length: cols }, (_, i) => i);

    for (const row of rowIndices) {
      for (const col of colIndices) {
        num += 1;

        const isEven = (row + col) % 2 === 0;
        const backgroundColor = isEven ? p.color(0) : p.color(255);
        const textColor = isEven ? p.color(255) : p.color(0);

        p.stroke(0);
        p.fill(backgroundColor);
        e.rect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);

        const text = num.toString();
        p.noStroke();
        p.fill(textColor);
        const x = col * cellWidth + cellWidth / 2;
        const y = row * cellHeight + cellHeight / 2;
        e.transform(() => p.text(text, x, y));
      }
    }
  };
}

function start() {
  const parent = document.querySelector<HTMLDivElement>("#app");
  if (!parent) throw new Error("No parent element found");

  new p5(sketch, parent);
}

start();
