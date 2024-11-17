import { TerminalData } from "@event-mapping/schema";
import { Quadtree, Rectangle } from "@timohausmann/quadtree-ts";
import { AdminHandler } from "@event-mapping/event-sdk/handlers/admin";
import { QuadtreeShape } from "@event-mapping/event-sdk/types";

export function insertTerminal(this: AdminHandler, terminals: TerminalData) {
  if (!this.quadtree) return;
  const rect = new Rectangle<TerminalData>({
    x: terminals.startX,
    y: terminals.startY,
    width: terminals.width,
    height: terminals.height,
    data: terminals,
  });

  this.terminalRects.set(terminals.id, rect);

  this.quadtree?.insert(rect);

  this.shapes._updateQuadtree(this.quadtree);
}

export function removeTerminal(this: AdminHandler, id: string) {
  if (!this.quadtree) return;

  const target = this.terminalRects.get(id);

  if (!target) return;

  this.quadtree?.remove(target);

  this.terminalRects.delete(id);

  this.shapes._updateQuadtree(this.quadtree);
}

export function initializeQuadtree(this: AdminHandler) {
  if (this.global.width === 0 || this.global.height === 0) return;

  this.quadtree = new Quadtree<QuadtreeShape>({
    maxObjects: 4,
    maxLevels: 5,
    x: 0,
    y: 0,
    width: this.global.width,
    height: this.global.height,
  });

  if (this.terminals.length === 0) return;

  const rectangles = this.terminals.map((terminal) => {
    const rect = new Rectangle({
      x: terminal.startX,
      y: terminal.startY,
      width: terminal.width,
      height: terminal.height,
      data: terminal,
    });

    this.terminalRects.set(terminal.id, rect);

    return rect;
  });

  rectangles.forEach((rect) => {
    this.quadtree?.insert(rect);
  });

  this.shapes._updateQuadtree(this.quadtree);
}
