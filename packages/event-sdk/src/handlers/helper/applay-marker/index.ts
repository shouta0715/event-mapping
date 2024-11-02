import { EventHandler } from "@event-mapping/event-sdk/handlers/event";
import { getMarkerPosition } from "@event-mapping/event-sdk/utils/matrix";

let timeoutId: number | null = null;
const TIMEOUT_DURATION = 5000;

export function applyMatrix3dToMarker(
  this: EventHandler,
  matrix3d: number[],
  selectedIndex: number
) {
  if (!this.markerContainer || !this.marker) return;

  this.markerContainer.style.transformOrigin = "0 0";
  this.markerContainer.style.transform = `matrix3d(${matrix3d.join(",")})`;

  const position = getMarkerPosition(selectedIndex, this.markerSize);
  if (!position) return;

  const { top, left, right, bottom } = position;
  this.marker.style.display = "block";

  this.marker.style.top = "";
  this.marker.style.left = "";
  this.marker.style.right = "";
  this.marker.style.bottom = "";

  if (top !== undefined) {
    this.marker.style.top = `${top}px`;
  }
  if (left !== undefined) {
    this.marker.style.left = `${left}px`;
  }
  if (right !== undefined) {
    this.marker.style.right = `${right}px`;
  }
  if (bottom !== undefined) {
    this.marker.style.bottom = `${bottom}px`;
  }

  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    if (!this.marker) return;
    this.marker.style.display = "none";
  }, TIMEOUT_DURATION);
}
