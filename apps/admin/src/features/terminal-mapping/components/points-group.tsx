/* eslint-disable react/no-array-index-key */

import { MoveVertexAction } from "@event-mapping/schema";
import React from "react";
import { Circle, Group, Line, Transformer } from "react-konva";
import { usePointGroup } from "@/features/terminal-mapping/hooks/use-point-group";

type Point = {
  x: number;
  y: number;
  id: string;
};

type PointsProps = {
  RADIUS_SIZE: number;
  colors: string[];
  center: Point;
  id: string;
  defaultPoints: Omit<Point, "id">[];
  sendJsonMessage: (action: MoveVertexAction) => void;
};

export const PointsGroup = ({
  colors,
  center,
  id,
  RADIUS_SIZE,
  defaultPoints,
  sendJsonMessage,
}: PointsProps) => {
  const {
    points,
    draggable,
    transformerRef,
    groupRef,
    handlePointFrameDragMove,
    setDraggable,
    handleDragMove,
    handleTransform,
  } = usePointGroup({ defaultPoints, center, id, sendJsonMessage });

  return (
    <>
      <Transformer ref={transformerRef} x={center.x} y={center.y} />
      <Group
        ref={groupRef}
        draggable={draggable}
        id="points"
        onDragMove={handlePointFrameDragMove}
        onTransform={handleTransform}
        x={center.x}
        y={center.y}
      >
        <Line
          closed
          points={points.flatMap((point) => [point.x, point.y])}
          stroke="#3B82F6"
          strokeWidth={8}
        />

        {points.map((point, index) => {
          const { x, y } = point;
          const color = colors[index];

          return (
            <Group
              key={`point-${index}`}
              draggable
              id={`point-${index}`}
              onDragMove={(e) => handleDragMove(index, e)}
              onDragStart={() => setDraggable(false)}
              onMouseEnter={() => setDraggable(false)}
              onMouseLeave={() => setDraggable(true)}
              x={x}
              y={y}
            >
              <Circle radius={RADIUS_SIZE} stroke={color} strokeWidth={4} />
            </Group>
          );
        })}
      </Group>
    </>
  );
};
