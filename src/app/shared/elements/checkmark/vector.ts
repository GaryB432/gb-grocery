export class Vector {
  public constructor(public x: number, public y: number) {}
  public add(other: Vector): this {
    this.x += other.x;
    this.y += other.y;
    return this;
  }
  public clone(): Vector {
    return new Vector(this.x, this.y);
  }
  public copy(other: Vector): this {
    this.x = other.x;
    this.y = other.y;
    return this;
  }
  public divide(other: Vector): this {
    this.x /= other.x;
    this.y /= other.y;
    return this;
  }
  public equals(other: Vector): boolean {
    return this.x === other.x && this.y === other.y;
  }
  public length(): number {
    return Math.sqrt(this.lengthSquared());
  }
  public lengthSquared(): number {
    return this.x * this.x + this.y * this.y;
  }
  public mix(other: Vector, amount = 0.5): this {
    const interp = (start: number, end: number): number => {
      const tot = end - start;
      const dx = tot * amount;
      return start + dx;
    };
    this.x = interp(this.x, other.x);
    this.y = interp(this.y, other.y);
    return this;
  }
  public norm(): this {
    const length = this.length();
    this.divide(new Vector(length, length));
    return this;
  }
  public sub(other: Vector): this {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }
  public toString(): string {
    return `(${this.x},${this.y})`;
  }
}
