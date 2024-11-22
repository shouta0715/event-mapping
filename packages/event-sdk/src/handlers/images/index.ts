import p5 from "p5";

export class Images {
  items: Map<string, p5.Image> = new Map();

  readonly baseImageUrl: string;

  constructor(
    private readonly p: p5,
    private readonly isAdmin: boolean,
    baseImageUrl: string
  ) {
    this.baseImageUrl = baseImageUrl;
  }

  uploaded: (data: { url: string; id: string; isAdmin: boolean }) => void =
    () => {};

  set(id: string): void {
    const image = this.p.loadImage(`${this.baseImageUrl}/${id}`);
    this.items.set(id, image);
  }

  get(id: string): p5.Image | undefined {
    return this.items.get(id);
  }

  remove(id: string): void {
    this.items.delete(id);
  }

  clear(): void {
    this.items.clear();
  }

  has(id: string): boolean {
    return this.items.has(id);
  }
}
