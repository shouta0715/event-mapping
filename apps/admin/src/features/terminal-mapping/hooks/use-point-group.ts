import { MoveVertexAction } from "@event-mapping/schema";
import Konva from "konva";
import { Vector2d } from "konva/lib/types";
import { useEffect, useRef, useState } from "react";
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
  sendJsonMessage: (action: MoveVertexAction) => void;
};

export const usePointGroup = ({
  defaultPoints,
  center,
  id,
  sendJsonMessage,
}: UsePointGroupProps) => {
  const [points, setPoints] = useState<Point[]>(() =>
    generateInitialPoints(defaultPoints)
  );
  const [framePosition, setFramePosition] = useState<Point>(center);
  const [draggable, setDraggable] = useState<boolean>(true);

  const groupRef = useRef<Konva.Group>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const handleScaleHandle = (scale: Vector2d) => {
    const group = groupRef.current;
    if (!group) return;

    const parent = group.getParent();
    if (!parent) return;

    const groupBox = group.getClientRect({ relativeTo: parent });
    const groupWidth = groupBox.width;
    const groupHeight = groupBox.height;

    const centerX = groupWidth / 2;
    const centerY = groupHeight / 2;

    group.offsetX(centerX);
    group.offsetY(centerY);

    const newPoints = points.map((point) => {
      const relativeX = point.x - centerX;
      const relativeY = point.y - centerY;

      const scaledX = relativeX * scale.x;
      const scaledY = relativeY * scale.y;

      const x = scaledX + centerX;
      const y = scaledY + centerY;

      return {
        id: point.id,
        x,
        y,
      };
    });

    setPoints(newPoints);

    const groupPosition = group.position();
    setFramePosition({
      x: groupPosition.x,
      y: groupPosition.y,
      id: "center",
    });

    const actionPoints = newPoints.map((point) => ({
      id: point.id,
      x: round(point.x + groupPosition.x - center.x),
      y: round(point.y + groupPosition.y - center.y),
    }));

    const action: MoveVertexAction = {
      action: "moveVertex",
      data: {
        id,
        positions: actionPoints,
        selectedIndex: -1,
      },
    };

    sendJsonMessage(action);

    group.scale({ x: 1, y: 1 });

    group.offsetX(0);
    group.offsetY(0);
  };

  const handleTransform = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.currentTarget;

    const scale = node.scale();

    if (scale) {
      handleScaleHandle(scale);

      node.scale({ x: 1, y: 1 });
    }
  };

  useEffect(() => {
    const group = groupRef.current;
    const transformer = transformerRef.current;

    if (!group || !transformer) return;

    transformer.nodes([group]);

    transformer.padding(20);
    transformer.rotateEnabled(false);
    transformer.borderDash([10, 10]);
    transformer.borderStrokeWidth(4);
    transformer.borderStroke("#94a3b7");
    transformer.enabledAnchors([
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
    ]);

    transformer.anchorStroke("#3B82F6");
    transformer.anchorStrokeWidth(2);
    transformer.anchorCornerRadius(4);
    transformer.anchorSize(20);

    transformer.getLayer()?.batchDraw();
  }, []);

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
    if (groupRef.current && transformerRef.current) {
      transformerRef.current.nodes([groupRef.current]);
    }
  };

  return {
    points,
    framePosition,
    draggable,
    groupRef,
    transformerRef,
    handleDragMove,
    handlePointFrameDragMove,
    handleTransform,
    setDraggable,
  };
};
