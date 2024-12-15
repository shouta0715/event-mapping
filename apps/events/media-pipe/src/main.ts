/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-globals */
/* eslint-disable new-cap */
/* eslint-disable no-new */

import { createEventClient } from "@event-mapping/event-sdk";
import {
  ResultsListener,
  SelfieSegmentation,
} from "@mediapipe/selfie_segmentation";
import p5 from "p5";
import { env } from "@/env.js";

let segmentMask: p5.Image | null = null;
let segmentImage: p5.Image | null = null;
let selfieImage: p5.Graphics;
let p: p5;

let width = window.innerWidth;
let height = window.innerHeight;

function onSelfieSegmentationResults(results: {
  segmentationMask: ImageBitmap;
  image: ImageBitmap;
}): ReturnType<ResultsListener> {
  const _segmentMaskBitMap = results.segmentationMask;
  const _segmentImageBitMap = results.image;

  if (_segmentImageBitMap && _segmentMaskBitMap && selfieImage) {
    const ctx = selfieImage.drawingContext as CanvasRenderingContext2D;
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(_segmentMaskBitMap, 0, 0, width, height);
    ctx.globalCompositeOperation = "source-in";
    ctx.drawImage(_segmentImageBitMap, 0, 0, width, height);
    ctx.restore();

    segmentMask = createImageFromBitmap(_segmentMaskBitMap);
    segmentImage = createImageFromBitmap(_segmentImageBitMap);
  }
}

const selfieSegmentation = new SelfieSegmentation({
  locateFile: (file: string) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${file}`;
  },
});

selfieSegmentation.setOptions({
  modelSelection: 1,
});
selfieSegmentation.onResults(onSelfieSegmentationResults as ResultsListener);

function createImageFromBitmap(bitmap: ImageBitmap): p5.Image {
  const imgG = p.createGraphics(bitmap.width, bitmap.height);
  (imgG.drawingContext as CanvasRenderingContext2D).drawImage(bitmap, 0, 0);
  const pImg = p.createImage(bitmap.width, bitmap.height);
  pImg.copy(
    imgG,
    0,
    0,
    bitmap.width,
    bitmap.height,
    0,
    0,
    bitmap.width,
    bitmap.height
  );

  return pImg;
}

let registered = false;

function sketch(pi: p5) {
  p = pi;

  const e = createEventClient(p, {
    apiUrl: env.VITE_API_URL,
    wsUrl: env.VITE_WS_URL,
    sourceId: env.VITE_SOURCE_ID,
  });

  e.setup = () => {
    p.createCanvas(width, height);
    selfieImage = p.createGraphics(width, height);

    e.createCapture("video", { flipped: true });
  };

  const registerProcess = () => {
    if (!e.capture) return;

    e.capture.elt.addEventListener("loadeddata", () => {
      if (!e.capture) return;

      const cameraElement = e.capture.elt as HTMLVideoElement;

      const processFrame = async () => {
        if (cameraElement.readyState === cameraElement.HAVE_ENOUGH_DATA) {
          await selfieSegmentation.send({ image: cameraElement });
        }
        requestAnimationFrame(processFrame);
      };
      processFrame();
    });

    registered = true;
  };

  p.draw = () => {
    if (!e.capture) return;
    p.background(255);
    width = e.global.width;
    height = e.global.height;

    if (!registered) registerProcess();

    if (segmentMask && segmentImage) {
      const seg = segmentMask;

      e.transform(() => {
        const pos = e.__is_admin__ ? -e.global.width : 0;
        if (e.__is_admin__) p.scale(-1, 1);

        p.image(seg, pos, 0, e.global.width, e.global.height);
      });
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
