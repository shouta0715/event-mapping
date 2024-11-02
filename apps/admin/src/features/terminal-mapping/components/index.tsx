/* eslint-disable react/no-array-index-key */
import { TerminalData } from "@event-mapping/schema";
import { Button } from "@event-mapping/ui/components/button";
import React from "react";
import { Stage, Layer, Circle, Rect, Group } from "react-konva";
import { PointsGroup } from "@/features/terminal-mapping/components/points-group";
import { useTerminalMapping } from "@/features/terminal-mapping/hooks";

type TerminalMappingProps = {
  data: TerminalData;
  id: string;
  onClose: () => void;
};

const colors = ["#3C8AF5", "#F59E0B", "#10B981", "#EF4444", "#0F766E"];

function TerminalMapping({ data, id, onClose }: TerminalMappingProps) {
  const {
    wrapperRef,
    stageRef,
    wrapperWidth,
    FRAME_MAX_HEIGHT,
    FRAME_PADDING,
    center,
    width,
    height,
    corners,
    RADIUS_SIZE,
    handleResetPosition,
    sendJsonMessage,
  } = useTerminalMapping({ data });

  return (
    <div ref={wrapperRef} className="size-full">
      <Stage
        ref={stageRef}
        className="cursor-grab border active:cursor-grabbing"
        draggable
        height={FRAME_MAX_HEIGHT + FRAME_PADDING}
        style={{
          background: `radial-gradient(circle at center, #414141 2px, #2b2b2b 2px) 0 0 / 40px 40px`,
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
          <PointsGroup
            key={JSON.stringify(data.positions)}
            center={center}
            colors={colors}
            defaultPoints={data.positions}
            id={id}
            RADIUS_SIZE={RADIUS_SIZE}
            sendJsonMessage={sendJsonMessage}
          />
        </Layer>
      </Stage>
      <p className="flex justify-between">
        <Button className="mt-4" onClick={onClose} variant="outline">
          閉じる
        </Button>
        <Button
          className="mt-4"
          onClick={handleResetPosition}
          variant="destructive"
        >
          元の位置に戻す
        </Button>
      </p>
    </div>
  );
}

export default TerminalMapping;
