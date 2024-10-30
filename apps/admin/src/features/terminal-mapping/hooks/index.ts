import { MoveVertexAction, TerminalData } from "@event-mapping/schema";
import Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { useWs } from "@/features/websocket/hooks";
import { useSourceId } from "@/global/store/provider";
import { round } from "@/utils";

type Point = {
  x: number;
  y: number;
  id: string;
};

const FRAME_MAX_HEIGHT = window.innerHeight * 0.7;

const RADIUS_SIZE = 20;
const FRAME_PADDING = 200;

const generateInitialPoints = (maxX: number, maxY: number) => {
  return [
    { id: "point-0", x: 0, y: 0 },
    { id: "point-1", x: maxX, y: 0 },
    { id: "point-2", x: maxX, y: maxY },
    { id: "point-3", x: 0, y: maxY },
  ];
};

type UseTerminalMappingProps = {
  data: TerminalData;
  id: string;
};

export function useTerminalMapping({ data, id }: UseTerminalMappingProps) {
  const { windowWidth: width, windowHeight: height } = data;
  const corners = generateInitialPoints(width, height);

  const sourceId = useSourceId();

  const stageRef = useRef<Konva.Stage>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const center = {
    x: (width + FRAME_PADDING - (width + RADIUS_SIZE * 2)) / 2,
    y: (height + FRAME_PADDING - (height + RADIUS_SIZE * 2)) / 2,
    id: "center",
  };

  const { sendJsonMessage } = useWs(sourceId);

  const [points, setPoints] = useState<Point[]>(corners);
  const [framePosition, setFramePosition] = useState<Point>(center);
  const [draggable, setDraggable] = useState<boolean>(true);
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

    const positions: { x: number; y: number }[] = points.map((point, i) => {
      if (i === index) {
        return { x: round(x), y: round(y) };
      }

      return { x: point.x, y: point.y };
    });

    const action: MoveVertexAction = {
      action: "moveVertex",
      data: {
        id,
        positions,
      },
    };

    sendJsonMessage(action);
  };

  return {
    wrapperRef,
    stageRef,
    wrapperWidth,
    framePosition,
    points,
    draggable,
    FRAME_MAX_HEIGHT,
    FRAME_PADDING,
    RADIUS_SIZE,
    center,
    width,
    height,
    corners,
    handleDragMove,
    handlePointFrameDragMove,
    handleDragEnd,
    setDraggable,
  };
}
