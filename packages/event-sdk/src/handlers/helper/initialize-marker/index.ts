import { EventHandler } from "@event-mapping/event-sdk/handlers/event";

export function initializeMarker(this: EventHandler) {
  const appElement = document.getElementById("app");
  if (!appElement) return;

  const markerContainer = document.createElement("div");
  markerContainer.id = "marker-container";
  Object.assign(markerContainer.style, {
    position: "absolute",
    inset: "0",
    pointerEvents: "none",
    zIndex: "10",
    backgroundColor: "transparent",
  });
  appElement.appendChild(markerContainer);

  const markerInner = document.createElement("div");
  markerInner.id = "marker-inner";
  Object.assign(markerInner.style, {
    width: `100%`,
    height: `100%`,
    pointerEvents: "none",
    position: "relative",
    backgroundColor: "transparent",
  });
  markerContainer.appendChild(markerInner);

  const marker = document.createElement("div");
  marker.id = "marker";
  Object.assign(marker.style, {
    width: `${this.markerSize}px`,
    height: `${this.markerSize}px`,
    pointerEvents: "none",
    position: "absolute",
    display: "none",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "8px solid #94a3b8",
    borderRadius: "50%",
  });
  markerInner.appendChild(marker);

  const markerCenter = document.createElement("div");
  markerCenter.id = "marker-center";
  Object.assign(markerCenter.style, {
    width: "10px",
    height: "10px",
    backgroundColor: "#facc15",
    borderRadius: "50%",
  });
  marker.appendChild(markerCenter);

  this.markerContainer = markerContainer;
  this.marker = marker;
}
