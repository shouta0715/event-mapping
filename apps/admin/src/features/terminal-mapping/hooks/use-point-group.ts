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

  const handleDragMove = (
    index: number,
    e: Konva.KonvaEventObject<DragEvent>
  ) => {
    setDraggable(false);

    const x = e.target.x();
    const y = e.target.y();

    const newPoints = points.map((point, i) => {
      if (i === index) {
        return { id: `point-${index}`, x: round(x), y: round(y) };
      }

      return point;
    });

    setPoints(newPoints);

    const action: MoveVertexAction = {
      action: "moveVertex",
      data: {
        id,
        positions: newPoints,
        selectedIndex: index,
      },
    };

    sendJsonMessage(action);
  };

  const handlePointFrameDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!draggable) return;
    const x = e.target.x();
    const y = e.target.y();

    setFramePosition({ id: "center", x, y });
  };

  const handleDragEnd = (
    index: number,
    e: Konva.KonvaEventObject<DragEvent>
  ) => {
    const { x, y } = e.target.position();

    const newPositions: { x: number; y: number }[] = points.map((point, i) => {
      if (i === index) {
        return { x: round(x), y: round(y) };
      }

      return { x: point.x, y: point.y };
    });

    const action: MoveVertexAction = {
      action: "moveVertex",
      data: {
        id,
        positions: newPositions,
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
    handleDragEnd,
    handlePointFrameDragMove,
    setDraggable,
  };
};
