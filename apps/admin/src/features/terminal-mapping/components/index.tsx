/* eslint-disable react/no-array-index-key */
import { TerminalData } from "@event-mapping/schema";
import React from "react";
import { Stage, Layer, Line, Circle, Rect, Group } from "react-konva";
import { useTerminalMapping } from "@/features/terminal-mapping/hooks";

type TerminalMappingProps = {
  data: TerminalData;
  id: string;
};

const colors = ["#3C8AF5", "#F59E0B", "#10B981", "#EF4444", "#0F766E"];

function TerminalMapping({ data, id }: TerminalMappingProps) {
  const {
    wrapperRef,
    stageRef,
    wrapperWidth,
    framePosition,
    points,
    draggable,
    FRAME_MAX_HEIGHT,
    FRAME_PADDING,
    center,
    width,
    height,
    corners,
    RADIUS_SIZE,
    handleDragMove,
    handlePointFrameDragMove,
    handleDragEnd,
    setDraggable,
  } = useTerminalMapping({ data, id });

  return (
    <div ref={wrapperRef} className="size-full">
      <Stage
        ref={stageRef}
        className="cursor-grab border active:cursor-grabbing"
        draggable
        height={FRAME_MAX_HEIGHT + FRAME_PADDING}
        style={{
          background: `radial-gradient(circle at center, #ddd 2px, #fff 2px) 0 0 / 40px 40px`,
        }}
        width={wrapperWidth}
      >
        <Layer id={`layer-${id}`}>
          <Group id="frame" x={center.x} y={center.y}>
            <Rect fill="white" height={height} stroke="#e5e7eb" width={width} />
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
