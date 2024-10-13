import { TerminalData } from "@event-mapping/schema";
import p5 from "p5";

import { Shapes } from "@event-mapping/event-sdk/handlers/shapes";
import {
  EventClient,
  EventClientOptions,
} from "@event-mapping/event-sdk/types";
import { GlobalData } from "@event-mapping/event-sdk/types/global";

export abstract class BaseHandler<TMeta extends Record<string, unknown>>
  implements EventClient<TMeta>
{
  protected readonly isInIframe = window.self !== window.top;

  protected readonly p: p5;

  shapes: Shapes<TMeta>;

  protected terminals: TerminalData[] = [];

  global: GlobalData;

  private readonly seed: number;

  initialized = false;

  constructor(
    p: p5,
    protected readonly options: EventClientOptions
  ) {
    this.p = p;
    this.seed = Math.random();
    this.shapes = new Shapes<TMeta>();
    this.global = { width: 0, height: 0 };
    this.p.randomSeed(this.seed);
  }

  join(terminal: TerminalData): void {
    if (this.terminals.find((t) => t.id === terminal.id)) return;
    this.terminals.push(terminal);
  }

  leave(id: string): void {
    this.terminals = this.terminals.filter((t) => t.id !== id);
  }

  initialize(terminals: TerminalData[], global: GlobalData): void {
    this.terminals = terminals;
    this.global = global;
    if (this.isInIframe) this.initialized = true;
  }

  abstract draw(): void;

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
