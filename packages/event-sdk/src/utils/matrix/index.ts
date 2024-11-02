import * as math from "mathjs";

type Point = { x: number; y: number };

export function constructMatrix(srcPoints: Point[], dstPoints: Point[]) {
  const A: number[][] = [];
  const b: number[] = [];

  srcPoints.forEach(({ x, y }, i) => {
    const target = dstPoints[i];
    if (!target) return;

    const { x: xPrime, y: yPrime } = target;

    A.push([x, y, 1, 0, 0, 0, -x * xPrime, -y * xPrime]);
    b.push(xPrime);

    A.push([0, 0, 0, x, y, 1, -x * yPrime, -y * yPrime]);
    b.push(yPrime);
  });

  return { A, b };
}

export function solveHomography(A: number[][], b: number[]) {
  const mathA = math.matrix(A);
  const mathb = math.matrix(b);

  const h = math.lusolve(mathA, mathb);

  const hArray = h.valueOf().flat();

  const H = [
    [hArray[0], hArray[1], hArray[2]],
    [hArray[3], hArray[4], hArray[5]],
    [hArray[6], hArray[7], 1],
  ];

  return H;
}

export function homographyToMatrix3d(
  H: (math.MathNumericType | undefined)[][]
): number[] | null {
  if (!H || !H[0] || !H[1] || !H[2]) return null;

  const h00 = H[0][0];
  const h10 = H[1][0];
  const h20 = H[2][0];
  const h01 = H[0][1];
  const h11 = H[1][1];
  const h21 = H[2][1];
  const h02 = H[0][2];
  const h12 = H[1][2];
  const h22 = H[2][2];

  if (
    typeof h00 !== "number" ||
    typeof h10 !== "number" ||
    typeof h20 !== "number" ||
    typeof h01 !== "number" ||
    typeof h11 !== "number" ||
    typeof h21 !== "number" ||
    typeof h02 !== "number" ||
    typeof h12 !== "number" ||
    typeof h22 !== "number"
  )
    return null;

  return [h00, h10, 0, h20, h01, h11, 0, h21, 0, 0, 1, 0, h02, h12, 0, h22];
}

export function getMarkerPosition(index: number, markerSize: number) {
  const halfMarkerSize = markerSize / 2;

  switch (index) {
    case 0:
      return { top: -halfMarkerSize, left: -halfMarkerSize };
    case 1:
      return { right: -halfMarkerSize, top: -halfMarkerSize };
    case 2:
      return { right: -halfMarkerSize, bottom: -halfMarkerSize };
    case 3:
      return { left: -halfMarkerSize, bottom: -halfMarkerSize };
    default:
      return null;
  }
}
