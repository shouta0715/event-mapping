/* eslint-disable react/no-array-index-key */
import { TerminalData } from "@event-mapping/schema";
import Konva from "konva";
import React, { useRef, useState } from "react";
import { Stage, Layer, Line, Circle, Rect, Group } from "react-konva";

type TerminalMappingProps = {
  data: TerminalData;
  id: string;
};

type Point = {
  x: number;
  y: number;
};

const FRAME_MAX_SIZE = 600;
const RADIUS_SIZE = 20;
const FRAME_PADDING = 200;

const generateInitialPoints = (maxX: number, maxY: number) => {
  return [
    { x: 0, y: 0 },
    { x: maxX, y: 0 },
    { x: maxX, y: maxY },
    { x: 0, y: maxY },
  ];
};

const colors = ["#3C8AF5", "#F59E0B", "#10B981", "#EF4444", "#0F766E"];

function TerminalMapping({ data, id }: TerminalMappingProps) {
  const frameAspectRatio = data.windowWidth / data.windowHeight;
  const width = FRAME_MAX_SIZE;
  const height = width / frameAspectRatio;
  const corners = generateInitialPoints(width, height);
  const [points, setPoints] = useState<Point[]>(corners);

  const center = {
    x: (width + FRAME_PADDING - (width + RADIUS_SIZE * 2)) / 2,
    y: (height + FRAME_PADDING - (height + RADIUS_SIZE * 2)) / 2,
  };
  const [framePosition, setFramePosition] = useState<Point>(center);
  const [draggable, setDraggable] = useState<boolean>(true);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleDragMove = (
    index: number,
    e: Konva.KonvaEventObject<DragEvent>
  ) => {
    const newPoints = [...points];
    const x = e.target.x();
    const y = e.target.y();

    newPoints[index] = { x, y };

    setPoints(newPoints);
  };

  const handlePointFrameDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (!draggable) return;
    const x = e.target.x();
    const y = e.target.y();

    setFramePosition({ x, y });
  };

  return (
    <div ref={wrapperRef} className="size-full px-10">
      <Stage height={height + FRAME_PADDING} width={width + FRAME_PADDING}>
        <Layer id={`layer-${id}`}>
          <Group id="frame" x={center.x} y={center.y}>
            <Rect height={height} stroke="#e5e7eb" width={width} />
            {corners.map((corner, index) => {
              const { x, y } = corner;
              const color = colors[index];

              return (
                <Group key={index} id={`rect-${index}`} x={x} y={y}>
                  <Circle radius={RADIUS_SIZE} stroke={color} />
                </Group>
              );
            })}
          </Group>
          <Group
            draggable={draggable}
            id="points"
            onDragMove={handlePointFrameDragMove}
            x={framePosition.x}
            y={framePosition.y}
          >
            <Line
              closed
              points={points.flatMap((point) => [point.x, point.y])}
              stroke="black"
            />
            {points.map((point, index) => {
              const { x, y } = point;
              const color = colors[index];

              return (
                <Group
                  key={index}
                  draggable
                  id={`point-${index}`}
                  onDragEnd={() => setDraggable(true)}
                  onDragMove={(e) => handleDragMove(index, e)}
                  onDragStart={() => setDraggable(false)}
                  onMouseEnter={() => setDraggable(false)}
                  x={x}
                  y={y}
                >
                  <Circle radius={RADIUS_SIZE} stroke={color} />
                </Group>
              );
            })}
          </Group>
        </Layer>
      </Stage>
    </div>
  );
}

export default TerminalMapping;
