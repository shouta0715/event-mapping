import { TerminalData } from "@event-mapping/schema";
import Konva from "konva";
import { useEffect, useRef, useState } from "react";

const FRAME_MAX_HEIGHT = window.innerHeight * 0.7;

const RADIUS_SIZE = 20;
const FRAME_PADDING = 200;

type UseTerminalMappingProps = {
  data: TerminalData;
};

const generateCornerPoints = (width: number, height: number) => {
  return [
    { id: "corner-top-left", x: 0, y: 0 },
    { id: "corner-top-right", x: width, y: 0 },
    { id: "corner-bottom-right", x: width, y: height },
    { id: "corner-bottom-left", x: 0, y: height },
  ];
};

export function useTerminalMapping({ data }: UseTerminalMappingProps) {
  const { windowWidth: width, windowHeight: height } = data;
  const corners = generateCornerPoints(width, height);

  const stageRef = useRef<Konva.Stage>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const center = {
    x: (width + FRAME_PADDING - (width + RADIUS_SIZE * 2)) / 2,
    y: (height + FRAME_PADDING - (height + RADIUS_SIZE * 2)) / 2,
    id: "center",
  };

  const [wrapperWidth, setWrapperWidth] = useState<number>(0);

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

  useEffect(() => {
    if (!wrapperRef.current) return;

    setWrapperWidth(wrapperRef.current.clientWidth - 4);
  }, [wrapperRef]);

  return {
    wrapperRef,
    stageRef,
    wrapperWidth,
    FRAME_MAX_HEIGHT,
    FRAME_PADDING,
    RADIUS_SIZE,
    center,
    width,
    height,
    corners,
  };
}
