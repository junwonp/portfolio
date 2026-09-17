import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import ProgressBar from './ProgressBar';

afterEach(cleanup);

const measureTrackAndFill = () => {
  const track = document.querySelector<HTMLElement>('[role="progressbar"]');
  const fill = document.querySelector<HTMLElement>('[role="progressbar"] > div');

  return {
    fillWidth: fill?.getBoundingClientRect().width ?? 0,
    trackWidth: track?.getBoundingClientRect().width ?? 0,
  };
};

// jsdom reports every getBoundingClientRect() width as 0, so a non-zero track
// width proves a real layout engine rendered this component.
describe('ProgressBar layout in a real browser', () => {
  it('clamps an over-range value and fills the whole track', () => {
    render(<ProgressBar value={150} label="Delivery progress" />);

    const { fillWidth, trackWidth } = measureTrackAndFill();

    expect(trackWidth).toBeGreaterThan(0);
    expect(fillWidth).toBeCloseTo(trackWidth, 1);
  });

  it('fills exactly half the track at 50', () => {
    render(<ProgressBar value={50} label="Delivery progress" />);

    const { fillWidth, trackWidth } = measureTrackAndFill();

    expect(trackWidth).toBeGreaterThan(0);
    expect(fillWidth).toBeCloseTo(trackWidth / 2, 0);
  });
});
