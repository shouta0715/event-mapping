/* eslint-disable react/no-array-index-key */
import {
  MoveVertexAction,
  TerminalData,
  VertexPosition,
} from "@event-mapping/schema";
import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line, Circle, Rect, Group } from "react-konva";
import { useWs } from "@/features/websocket/hooks";
import { useSourceId } from "@/global/store/provider";

type TerminalMappingProps = {
  data: TerminalData;
  id: string;
};

type Point = {
  x: number;
  y: number;
  id: string;
};

const FRAME_MAX_SIZE = 600;
const RADIUS_SIZE = 20;
const FRAME_PADDING = 200;

const VERTEX_POSITIONS: VertexPosition[] = [
  "topLeft",
  "topRight",
  "bottomLeft",
  "bottomRight",
];

const generateInitialPoints = (maxX: number, maxY: number) => {
  return [
    { id: "point-0", x: 0, y: 0 },
    { id: "point-1", x: maxX, y: 0 },
    { id: "point-2", x: maxX, y: maxY },
    { id: "point-3", x: 0, y: maxY },
  ];
};

const colors = ["#3C8AF5", "#F59E0B", "#10B981", "#EF4444", "#0F766E"];

function TerminalMapping({ data, id }: TerminalMappingProps) {
  const sourceId = useSourceId();
  const frameAspectRatio = data.windowWidth / data.windowHeight;
  const width = FRAME_MAX_SIZE;
  const height = width / frameAspectRatio;
  const corners = generateInitialPoints(width, height);
  const [points, setPoints] = useState<Point[]>(corners);
  const stageRef = useRef<Konva.Stage>(null);

  const { sendJsonMessage } = useWs(sourceId);

  const center = {
    x: (width + FRAME_PADDING - (width + RADIUS_SIZE * 2)) / 2,
    y: (height + FRAME_PADDING - (height + RADIUS_SIZE * 2)) / 2,
    id: "center",
  };
  const [framePosition, setFramePosition] = useState<Point>(center);
  const [draggable, setDraggable] = useState<boolean>(true);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return () => {};

    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
      if (!stage) return;

      e.evt.preventDefault();

      const scaleBy = 1.1;
      const oldScale = stage.scaleX();

      const pointerPosition = stage.getPointerPosition();

      if (!pointerPosition) return;

      const mousePointTo = {
        x: pointerPosition.x / oldScale - stage.x() / oldScale,
        y: pointerPosition.y / oldScale - stage.y() / oldScale,
      };

      const newScale =
        e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x: -(mousePointTo.x - pointerPosition.x / newScale) * newScale,
        y: -(mousePointTo.y - pointerPosition.y / newScale) * newScale,
      };
      stage.position(newPos);
      stage.batchDraw();
    };

    stage.on("wheel", handleWheel);

    return () => {
      stage.off("wheel", handleWheel);
    };
  }, []);

  const handleDragMove = (
    index: number,
    e: Konva.KonvaEventObject<DragEvent>
  ) => {
    setDraggable(false);
    const newPoints = [...points];
    const x = e.target.x();
    const y = e.target.y();

    newPoints[index] = { id: `point-${index}`, x, y };

    setPoints(newPoints);
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

    const currentW = FRAME_MAX_SIZE;
    const currentH = currentW / frameAspectRatio;

    const scaleX = data.windowWidth / currentW;
    const scaleY = data.windowHeight / currentH;

    const baseX = corners[index].x;
    const baseY = corners[index].y;

    let movedX;
    if (index % 2 === 1) {
      movedX = Math.round(x * scaleX);
    } else {
      movedX = Math.round(baseX - x * scaleX);
    }

    let movedY;
    if (index >= 2) {
      movedY = Math.round(y * scaleY);
    } else {
      movedY = Math.round(baseY - y * scaleY);
    }

    const action: MoveVertexAction = {
      action: "moveVertex",
      id,
      x: movedX,
      y: movedY,
      position: VERTEX_POSITIONS[index],
    };

    sendJsonMessage(action);
  };

  return (
    <div className="size-full px-10">
      <Stage
        ref={stageRef}
        className="size-full cursor-grab border active:cursor-grabbing"
        draggable
        height={height + FRAME_PADDING}
        width={width + FRAME_PADDING}
      >
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
                  key={`point-${index}`}
                  draggable
                  id={`point-${index}`}
                  onDragEnd={(e) => handleDragEnd(index, e)}
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
        </Layer>
      </Stage>
    </div>
  );
}

export default TerminalMapping;
