import { Node } from "@xyflow/react";
import { IFRAME_NODE_ID, IFRAME_NODE_TYPE } from "@/constant/node";
import { IframeNodeData } from "@/features/iframe/types";

type CreateIframeNodeProps = {
  data: IframeNodeData;
};

export const createIframeNode = ({
  data,
}: CreateIframeNodeProps): Node<IframeNodeData, typeof IFRAME_NODE_TYPE> => {
  return {
    id: IFRAME_NODE_ID,
    type: IFRAME_NODE_TYPE,
    position: {
      x: 0,
      y: 0,
    },
    data,
    zIndex: -1000,
    width: data.width,
    height: data.height,
    dragging: false,
    draggable: false,
    connectable: false,
    deletable: false,
  };
};
