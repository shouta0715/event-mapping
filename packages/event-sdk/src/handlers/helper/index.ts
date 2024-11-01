import { EventMoveVertex } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";
import {
  constructMatrix,
  homographyToMatrix3d,
  solveHomography,
} from "@event-mapping/event-sdk/utils/matrix";

export function transform(this: EventHandler, cb: () => void) {
  if (!this.terminal) return;
  const { startX, startY, width, height, windowHeight, windowWidth } =
    this.terminal;

  const scaleX = windowWidth / width;
  const scaleY = windowHeight / height;

  const x = -startX * scaleX;
  const y = -startY * scaleY;

  this.p.push();
  this.p.translate(x, y);
  this.p.scale(scaleX, scaleY);
  cb();
  this.p.pop();
}

export function applyMatrix3d(
  this: EventHandler,
  positions: EventMoveVertex["data"]["positions"]
) {
  if (!this.terminal) return;
  if (!this.canvas) return;

  const { windowWidth, windowHeight } = this.terminal;

  const defaultPoints = [
    { x: 0, y: 0 },
    { x: windowWidth, y: 0 },
    { x: windowWidth, y: windowHeight },
    { x: 0, y: windowHeight },
  ];

  const dstPoints = positions.map(({ x, y }) => ({ x, y }));

  const { A, b } = constructMatrix(defaultPoints, dstPoints);
  const H = solveHomography(A, b);
  const matrix3d = homographyToMatrix3d(H);
  if (!matrix3d) return;

  this.canvas.style.transformOrigin = "0 0";
  this.canvas.style.transform = `matrix3d(${matrix3d.join(",")})`;
}
