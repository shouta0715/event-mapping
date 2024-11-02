import { MoveVertexAction } from "@event-mapping/schema";
import Konva from "konva";
import { useState } from "react";
import { useWs } from "@/features/websocket/hooks";
import { useSourceId } from "@/global/store/provider";
import { round } from "@/utils";

type Point = {
  x: number;
  y: number;
  id: string;
};

const generateInitialPoints = (defaultPoints: { x: number; y: number }[]) => {
  return defaultPoints.map((position, index) => ({
    id: `point-${index}`,
    x: position.x,
    y: position.y,
  }));
};

type UsePointGroupProps = {
  defaultPoints: Omit<Point, "id">[];
  center: Point;
  id: string;
};

export const usePointGroup = ({
  defaultPoints,
  center,
  id,
}: UsePointGroupProps) => {
  const sourceId = useSourceId();

  const { sendJsonMessage } = useWs(sourceId);
  const [points, setPoints] = useState<Point[]>(() =>
    generateInitialPoints(defaultPoints)
  );
  const [framePosition, setFramePosition] = useState<Point>(center);
  const [draggable, setDraggable] = useState<boolean>(true);

  const handlePointFrameDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!draggable) return;
    const x = e.target.x();
    const y = e.target.y();

    const newPoints = points.map((point) => ({
      id: point.id,
      x: point.x + (x - center.x),
      y: point.y + (y - center.y),
    }));

    const action: MoveVertexAction = {
      action: "moveVertex",
      data: {
        id,
        positions: newPoints,
        selectedIndex: -1,
      },
    };

    sendJsonMessage(action);
    setFramePosition({ x, y, id: "center" });
  };

  const handleDragMove = (
    index: number,
    e: Konva.KonvaEventObject<DragEvent>
  ) => {
    setDraggable(false);

    const x = e.target.x();
    const y = e.target.y();

    const actionPoints: Point[] = [];

    setPoints((prev) =>
      prev.map((point, i) => {
        const frameAdjustedX = framePosition.x - center.x;
        const frameAdjustedY = framePosition.y - center.y;

        if (i === index) {
          actionPoints.push({
            id: point.id,
            x: round(x + frameAdjustedX),
            y: round(y + frameAdjustedY),
          });

          return { id: point.id, x: round(x), y: round(y) };
        }

        actionPoints.push({
          id: point.id,
          x: round(point.x + frameAdjustedX),
          y: round(point.y + frameAdjustedY),
        });

        return point;
      })
    );

    const action: MoveVertexAction = {
      action: "moveVertex",
      data: {
        id,
        positions: actionPoints,
        selectedIndex: index,
      },
    };

    sendJsonMessage(action);
  };

  return {
    points,
    framePosition,
    draggable,
    handleDragMove,
    handlePointFrameDragMove,
    setDraggable,
  };
};
