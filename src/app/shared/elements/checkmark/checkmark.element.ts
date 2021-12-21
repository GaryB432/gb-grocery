import { Vector } from './vector';
const template = document.createElement('template');
template.innerHTML = `<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="currentColor"
  viewBox="0 0 24 24"
>
<rect transform="translate(3.713 8.558) rotate(45)" />
<rect transform="translate(5.14 17.45) rotate(-45)" />
</svg>`;

interface Points {
  a: Vector;
  b: Vector;
  c: Vector;
  d: Vector;
  e: Vector;
  f: Vector;
  g: Vector;
  i: Vector;
}
/*

N O T   T O   S C A L E !

                  /\ d
                 /  \
      /\ f      /    \
     /  \      /      \
    /    \    /        \
   /      \  /          \
   \ a     \/ e         / c
    \      /\          /
     \    /  \        /
      \  /    \      /
       \/      \    /
        \ g     \  /
         \       \/ i
          \      /
           \    /
            \  /
             \/ b (h)

*/

const ps: Points = {
  a: new Vector(0, 12.272),
  b: new Vector(9, 21),
  c: new Vector(24, 5.715),
  d: new Vector(20.285, 2),
  e: new Vector(9, 13.567),
  f: new Vector(3.714, 8.556),
  g: new Vector(5.22, 17.334), // guesswork
  i: new Vector(13, 17.197), // guesswork
};

const l1 = ps.a.clone().sub(ps.b).length();
const l2 = ps.b.clone().sub(ps.c).length();
const h = ps.c.clone().sub(ps.d).length();

export class CheckmarkElement extends HTMLElement {
  private r1: SVGRectElement | null = null;
  private r2: SVGRectElement | null = null;
  public constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    if (this.shadowRoot) {
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      const rs = this.shadowRoot.querySelectorAll('rect');
      this.r1 = rs.item(0);
      this.r2 = rs.item(1);
    }
  }

  public static get observedAttributes(): string[] {
    return ['checked'];
  }

  public get checked(): boolean {
    const value = this.getAttribute('checked');
    return value !== null && value.toLowerCase() === 'true';
  }

  public set checked(value: boolean) {
    this.setAttribute('checked', value ? 'true' : 'false');
  }

  public get duration(): number {
    const value = this.getAttribute('duration');
    return value === null ? 100 : Number(value);
  }

  public set duration(value: number) {
    this.setAttribute('duration', value.toString());
  }

  public attributeChangedCallback(name: string, oldVal: string): void {
    this.update(oldVal && name === 'checked' ? this.duration : 0);
  }

  public connectedCallback(): void {
    if (this.r1 && this.r2) {
      this.r1.setAttribute('height', h.toString());
      this.r2.setAttribute('height', h.toString());
      this.r1.setAttribute(
        'transform',
        `translate(${ps.f.x} ${ps.f.y}) rotate(45)`
      );
      this.r2.setAttribute(
        'transform',
        `translate(${ps.g.x} ${ps.g.y}) rotate(-45)`
      );
    }
  }

  private update(duration: number): void {
    const px = (n = 0) => `${n}px`;
    Promise.resolve().then(
      () => {
        if (this.r1 && this.r2) {
          if (this.checked) {
            const wpxs = [l1, l2].map(px);
            const ws = wpxs.map((width) => ({ width }));
            const a1 = this.r1.animate([{ width: 0 }, ws[0]], {
              delay: 0,
              duration,
            });
            const a2 = this.r2.animate([{ width: 0 }, ws[1]], {
              delay: duration,
              duration: duration * 2,
            });
            a1.onfinish = () => {
              if (this.r1) {
                this.r1.style.width = wpxs[0];
              }
            };
            a2.onfinish = () => {
              if (this.r2) {
                this.r2.style.width = wpxs[1];
              }
            };
            a1.play();
            a2.play();
          } else {
            this.r1.style.width = this.r2.style.width = '0';
          }
        }
      },
      () => {
        console.error('error in update');
      }
    );
  }
}
