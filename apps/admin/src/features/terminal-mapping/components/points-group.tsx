/* eslint-disable react/no-array-index-key */

import React from "react";
import { Circle, Group, Line } from "react-konva";
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
};

export const PointsGroup = ({
  colors,
  center,
  id,
  RADIUS_SIZE,
  defaultPoints,
}: PointsProps) => {
  const {
    points,
    handlePointFrameDragMove,
    draggable,
    setDraggable,
    handleDragMove,
  } = usePointGroup({ defaultPoints, center, id });

  return (
    <Group
      draggable={draggable}
      id="points"
      onDragMove={handlePointFrameDragMove}
      x={center.x}
      y={center.y}
    >
      <Line
        closed
        points={points.flatMap((point) => [point.x, point.y])}
        stroke="#3B82F6"
        strokeWidth={4}
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
            <Circle radius={RADIUS_SIZE} stroke={color} />
          </Group>
        );
      })}
    </Group>
  );
};
