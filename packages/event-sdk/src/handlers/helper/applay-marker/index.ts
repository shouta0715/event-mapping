import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

let timeoutId: number | null = null;
const TIMEOUT_DURATION = 5000;

const SELECTED_INDEX_ROLE = {
  FRAME: -1,
  LEFT_TOP: 0,
  RIGHT_TOP: 1,
  RIGHT_BOTTOM: 2,
  LEFT_BOTTOM: 3,
};

export function getMarkerPosition(index: number, markerSize: number) {
  const halfMarkerSize = markerSize / 2;

  switch (index) {
    case SELECTED_INDEX_ROLE.LEFT_TOP:
      return { top: -halfMarkerSize, left: -halfMarkerSize };
    case SELECTED_INDEX_ROLE.RIGHT_TOP:
      return { right: -halfMarkerSize, top: -halfMarkerSize };
    case SELECTED_INDEX_ROLE.RIGHT_BOTTOM:
      return { right: -halfMarkerSize, bottom: -halfMarkerSize };
    case SELECTED_INDEX_ROLE.LEFT_BOTTOM:
      return { left: -halfMarkerSize, bottom: -halfMarkerSize };
    default:
      return null;
  }
}

export function applyMatrix3dToMarker(
  this: EventHandler,
  matrix3d: number[],
  selectedIndex: number
) {
  if (!this.markerContainer || !this.marker) return;

  this.markerContainer.style.transformOrigin = "0 0";
  this.markerContainer.style.transform = `matrix3d(${matrix3d.join(",")})`;

  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    if (!this.marker || !this.markerContainer) return;
    this.marker.style.display = "none";
    this.markerContainer.style.outline = "none";
  }, TIMEOUT_DURATION);

  if (selectedIndex === SELECTED_INDEX_ROLE.FRAME) {
    if (!this.markerContainer) return;
    this.markerContainer.style.outline = "20px solid #94a3b8";

    return;
  }

  const position = getMarkerPosition(selectedIndex, this.markerSize);
  if (!position) return;
  const { top, left, right, bottom } = position;
  this.marker.style.display = "flex";

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
}
