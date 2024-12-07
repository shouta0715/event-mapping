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

  e.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noFill();
  };

  p.draw = () => {
    p.background(240);

    // 中心座標とスケール係数を計算
    const cx = e.global.width / 2;
    const cy = e.global.height / 2;
    const xScale = e.global.width / 400;
    const yScale = e.global.height / 400;

    const tx = (x: number) => cx + (x - 200) * xScale;
    const ty = (y: number) => cy + (y - 200) * yScale;

    const tw = (w: number) => w * xScale;
    const th = (h: number) => h * yScale;

    // 頭部（黄色い顔）
    p.fill(255, 230, 0);
    e.ellipse(cx, cy, tw(180), th(180)); // 中心は(cx, cy)

    // 左耳 (元座標: (145,90), (130,40), (160,60))
    p.fill(255, 230, 0);
    e.triangle(tx(145), ty(90), tx(130), ty(40), tx(160), ty(60));
    p.fill(0);
    e.triangle(tx(145), ty(90), tx(135), ty(60), tx(160), ty(60));

    // 右耳 (元座標: (255,90), (270,40), (240,60))
    p.fill(255, 230, 0);
    e.triangle(tx(255), ty(90), tx(270), ty(40), tx(240), ty(60));
    p.fill(0);
    e.triangle(tx(255), ty(90), tx(265), ty(60), tx(240), ty(60));

    p.fill(0);
    e.ellipse(tx(170), ty(190), tw(20), th(25));
    e.ellipse(tx(230), ty(190), tw(20), th(25));

    // 白目のハイライト (元座標: (172,187), (232,187))
    p.fill(255);
    e.ellipse(tx(172), ty(187), tw(5), th(5));
    e.ellipse(tx(232), ty(187), tw(5), th(5));

    // 鼻 (元座標: (200,210,7,7))
    p.fill(0);
    e.ellipse(tx(200), ty(210), tw(7), th(7));

    // 口 (元座標: arc(200,220,30,20))
    p.stroke(0);
    p.strokeWeight((tw(2) + th(2)) / 2); // 線の太さもスケーリング
    p.noFill();
    e.transform(() => p.arc(tx(200), ty(220), tw(30), th(20), 0, p.PI));

    p.noStroke();
    p.fill(255, 0, 0);
    e.ellipse(tx(155), ty(215), tw(25), th(25));
    e.ellipse(tx(245), ty(215), tw(25), th(25));
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
