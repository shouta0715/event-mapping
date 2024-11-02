import { EventMoveVertex } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";
import {
  constructMatrix,
  homographyToMatrix3d,
  solveHomography,
} from "@event-mapping/event-sdk/utils/matrix";

export function applyMatrix3d(
  this: EventHandler,
  positions: EventMoveVertex["data"]["positions"]
): number[] | null {
  if (!this.terminal) return null;
  if (!this.canvas) return null;

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
  if (!matrix3d) return null;

  this.canvas.style.transformOrigin = "0 0";
  this.canvas.style.transform = `matrix3d(${matrix3d.join(",")})`;

  return matrix3d;
}
