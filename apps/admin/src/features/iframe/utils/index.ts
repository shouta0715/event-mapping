import { Node } from "@xyflow/react";
import { IFRAME_NODE_ID, IFRAME_NODE_TYPE } from "@/constant/node";
import { IframeNodeData } from "@/features/iframe/types";

type CreateIframeNodeProps = {
  url: string;
  size?: {
    width: number;
    height: number;
  };
};

const defaultSize = {
  width: 1980,
  height: 1080,
};

export const createIframeNode = ({
  url,
  size = defaultSize,
}: CreateIframeNodeProps): Node<IframeNodeData, typeof IFRAME_NODE_TYPE> => {
  return {
    id: IFRAME_NODE_ID,
    type: IFRAME_NODE_TYPE,
    position: {
      x: 0,
      y: 0,
    },
    data: {
      url,
    },
    zIndex: -10,
    width: size.width,
    height: size.height,
    dragging: false,
    draggable: false,
    connectable: false,
    deletable: false,
  };
};
