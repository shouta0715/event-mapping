import { NodeType, TerminalNode } from "@/global/store/types";

export const getQ = (searchParams: { name: string | undefined | string[] }) => {
  const q =
    typeof searchParams.name === "string" ? searchParams.name : undefined;

  return q;
};

export const assertTerminalNode = (node: NodeType): node is TerminalNode => {
  return node.type === "terminal";
};
