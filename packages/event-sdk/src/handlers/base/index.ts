import { TerminalData } from "@event-mapping/schema";
import p5 from "p5";

import {
  EventClient,
  EventClientOptions,
} from "@event-mapping/event-sdk/types";
import { GlobalData } from "@event-mapping/event-sdk/types/global";

export abstract class BaseHandler implements EventClient {
  protected readonly isInIframe = window.self !== window.top;

  protected readonly p: p5;

  protected terminals: TerminalData[] = [];

  global: GlobalData;

  private readonly seed: number;

  protected readonly baseImageUrl: string;

  initialized = false;

  setup: (
    global: GlobalData,
    terminals: TerminalData[],
    terminal?: TerminalData
  ) => void = () => {};

  constructor(
    p: p5,
    protected readonly options: EventClientOptions
  ) {
    const { apiUrl, sourceId } = options;
    this.p = p;
    this.seed = 100;
    this.global = { width: 0, height: 0 };
    this.p.randomSeed(this.seed);
    this.p.frameRate(30);
    this.baseImageUrl = `${apiUrl}/sources/${sourceId}/images`;
  }

  join(terminal: TerminalData): void {
    if (this.terminals.find((t) => t.id === terminal.id)) return;
    this.terminals.push(terminal);
  }

  leave(id: string): void {
    this.terminals = this.terminals.filter((t) => t.id !== id);
  }

  updatedGlobal: (global: GlobalData) => void = () => {};

  prompt: () => void = () => {};

  /**
   * マウス関連のイベント
   */
  mouseIsPressed: boolean = false;

  mouseX: number = 0;

  mouseY: number = 0;

  mousePressed: (props: { x: number; y: number }) => void = () => {};

  mouseReleased: (props: { x: number; y: number }) => void = () => {};

  mouseClicked: (props: { x: number; y: number }) => void = () => {};

  mouseDoubleClicked: (props: { x: number; y: number }) => void = () => {};

  mouseMoved: (props: { x: number; y: number }) => void = () => {};

  mouseDragged: (props: { x: number; y: number }) => void = () => {};

  /**
   * 描画関連のメソッド
   */

  abstract transform: (fn: () => void) => void;

  abstract circle: (x: number, y: number, d: number) => void;

  abstract ellipse: (x: number, y: number, w: number, h?: number) => void;

  abstract line: (x1: number, y1: number, x2: number, y2: number) => void;

  abstract point: (x: number, y: number, z?: number) => void;

  abstract quad: (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number,
    detailX?: number,
    detailY?: number
  ) => void;

  abstract rect: (
    x: number,
    y: number,
    w: number,
    h?: number,
    tl?: number,
    tr?: number,
    br?: number,
    bl?: number
  ) => void;

  abstract square: (
    x: number,
    y: number,
    s: number,
    tl?: number,
    tr?: number,
    br?: number,
    bl?: number
  ) => void;

  abstract triangle: (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ) => void;
}
