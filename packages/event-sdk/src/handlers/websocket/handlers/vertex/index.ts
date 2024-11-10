import { EventMoveVertex } from "@event-mapping/schema";
import { EventHandler } from "@event-mapping/event-sdk/handlers/event";
import { applyMatrix3dToMarker } from "@event-mapping/event-sdk/handlers/helper/applay-marker";
import { applyMatrix3d } from "@event-mapping/event-sdk/handlers/helper/apply-matrix";

export function handleMoveVertexAction(
  this: EventHandler,
  data: EventMoveVertex["data"]
) {
  if (!this.canvas) return;

  const matrix3d = applyMatrix3d.call(this, data.positions);

  if (!matrix3d || !this.marker) return;

  applyMatrix3dToMarker.call(this, matrix3d, data.selectedIndex);
}
