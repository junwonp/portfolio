import '@testing-library/jest-dom/vitest';

// jsdom does not implement the Touch constructor — provide a minimal polyfill
if (typeof Touch === 'undefined') {
  class TouchPolyfill {
    identifier: number;
    target: EventTarget;
    clientX: number;
    clientY: number;
    screenX = 0;
    screenY = 0;
    pageX = 0;
    pageY = 0;
    radiusX = 0;
    radiusY = 0;
    rotationAngle = 0;
    force = 0;

    constructor(init: {
      identifier: number;
      target: EventTarget;
      clientX?: number;
      clientY?: number;
    }) {
      this.identifier = init.identifier;
      this.target = init.target;
      this.clientX = init.clientX ?? 0;
      this.clientY = init.clientY ?? 0;
    }
  }

  globalThis.Touch = TouchPolyfill as unknown as typeof Touch;
}
