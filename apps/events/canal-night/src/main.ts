/* eslint-disable no-restricted-globals */
/* eslint-disable new-cap */
/* eslint-disable no-new */

import { createEventClient } from "@event-mapping/event-sdk";
import p5 from "p5";
import { env } from "@/env.js";

const positions = [
  { x: 100, y: 200, size: 80, color: "#FF5733" },
  { x: 500, y: 150, size: 100, color: "#33FF57" },
  { x: 900, y: 300, size: 70, color: "#3357FF" },
  { x: 1200, y: 400, size: 110, color: "#FF33A5" },
  { x: 50, y: 50, size: 90, color: "#A533FF" },
  { x: 1400, y: 600, size: 120, color: "#FFD133" },
  { x: 1600, y: 200, size: 85, color: "#33D1FF" },
  { x: 300, y: 800, size: 95, color: "#FF3380" },
  { x: 700, y: 900, size: 130, color: "#33FFDD" },
  { x: 1800, y: 300, size: 110, color: "#FF8033" },
  { x: 200, y: 600, size: 90, color: "#F1C40F" },
  { x: 500, y: 100, size: 100, color: "#3498DB" },
  { x: 1000, y: 800, size: 120, color: "#9B59B6" },
  { x: 1500, y: 400, size: 110, color: "#E74C3C" },
  { x: 50, y: 950, size: 75, color: "#1ABC9C" },
  { x: 600, y: 500, size: 65, color: "#2ECC71" },
  { x: 1600, y: 700, size: 140, color: "#E67E22" },
  { x: 300, y: 350, size: 105, color: "#2980B9" },
  { x: 1200, y: 750, size: 130, color: "#8E44AD" },
  { x: 100, y: 100, size: 70, color: "#C0392B" },
  { x: 400, y: 450, size: 110, color: "#D35400" },
  { x: 900, y: 600, size: 85, color: "#34495E" },
  { x: 1700, y: 250, size: 115, color: "#16A085" },
  { x: 200, y: 850, size: 120, color: "#27AE60" },
  { x: 1400, y: 550, size: 135, color: "#2980B9" },
  { x: 700, y: 150, size: 90, color: "#8E44AD" },
  { x: 1300, y: 300, size: 95, color: "#C0392B" },
  { x: 1700, y: 700, size: 100, color: "#2C3E50" },
  { x: 600, y: 900, size: 110, color: "#D35400" },
  { x: 50, y: 700, size: 85, color: "#16A085" },
  {
    x: window.innerWidth - 100,
    y: window.innerHeight + 100,
    size: 200,
    color: "#FF5733",
  },
  {
    x: window.innerWidth - 10,
    y: window.innerHeight - 120,
    size: 120,
    color: "#33FF57",
  },
  {
    x: window.innerWidth / 2,
    y: -100,
    size: 200,
    color: "#3357FF",
  },
  {
    x: window.innerWidth / 2,
    y: window.innerHeight - 100,
    size: 41,
    color: "#FF33A5",
  },
  {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    size: 55,
    color: "#FFD133",
  },
  {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    size: 100,
    color: "#33D1FF",
  },
  {
    x: window.innerWidth / 4,
    y: window.innerHeight - 100,
    size: 100,
    color: "#33D1FF",
  },
];

function sketch(pi: p5) {
  const p = pi;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noFill();
  };

  p.draw = () => {
    p.background(255);

    positions.forEach((position) => {
      p.fill(position.color);
      p.square(position.x, position.y, position.size);
    });
  };

  p.mousePressed = () => {};

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
}

function start() {
  const parent = document.querySelector<HTMLDivElement>("#app");
  if (!parent) throw new Error("No parent element found");

  const p = new p5(sketch, parent);

  createEventClient(p, {
    apiUrl: env.VITE_API_URL,
    wsUrl: env.VITE_WS_URL,
    sourceId: env.VITE_SOURCE_ID,
  });
}

start();
