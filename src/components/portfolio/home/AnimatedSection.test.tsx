import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import AnimatedSection from './AnimatedSection';
import * as styles from './AnimatedSection.css';

describe('AnimatedSection', () => {
  it('renders a labelled section with the enter animation and the stagger delay variable', () => {
    const html = renderToStaticMarkup(
      <AnimatedSection id="section-work" delay={180} aria-labelledby="section-work-heading">
        <h2 id="section-work-heading">Work Experience</h2>
      </AnimatedSection>,
    );

    expect(html).toContain('id="section-work"');
    expect(html).toContain('aria-labelledby="section-work-heading"');
    expect(html).toContain(`class="${styles.fadeSlideEnter}"`);
    expect(html).toMatch(/--enter-delay:\s*180ms/);
    expect(html).toContain('Work Experience');
  });

  it('renders a zero delay and omits an absent aria-labelledby attribute', () => {
    const html = renderToStaticMarkup(
      <AnimatedSection id="section-intro" delay={0}>
        <p>Intro</p>
      </AnimatedSection>,
    );

    expect(html).toMatch(/--enter-delay:\s*0ms/);
    expect(html).not.toContain('aria-labelledby');
    expect(html).toContain('Intro');
  });

  it('appends the caller class after the animation class', () => {
    const html = renderToStaticMarkup(
      <AnimatedSection id="section-skills" delay={270} className="customSection">
        <p>Skills</p>
      </AnimatedSection>,
    );

    expect(html).toContain(`class="${styles.fadeSlideEnter} customSection"`);
  });
});
