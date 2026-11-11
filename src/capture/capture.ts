import type { Theme } from '../ui/theme';

/**
 * Full-document snapshots of the page in a given theme.
 *
 * We capture the whole document (not just the viewport) so a snapshot stays valid
 * while the user scrolls; the shader picks the visible window using the live scroll
 * offset. The theme is applied to html2canvas' *cloned* document via `onclone`, so the
 * live page never flickers during pre-capture.
 */

export interface Snapshot {
  theme: Theme;
  canvas: HTMLCanvasElement;
  /** Texture pixels per CSS pixel. */
  scale: number;
  /** Layout this snapshot is valid for; see {@link layoutKey}. */
  key: string;
  ms: number;
}

const BACKGROUND: Record<Theme, string> = {
  light: '#f2efe8',
  dark: '#090a0b',
};

const isCoarsePointer = (): boolean => window.matchMedia('(pointer: coarse)').matches;

/** Device-pixel ratio used for both the snapshots and the overlay canvas. */
export function renderScale(): number {
  const cap = isCoarsePointer() ? 1.5 : 2;
  return Math.min(window.devicePixelRatio || 1, cap);
}

export function documentSize(): { width: number; height: number } {
  const el = document.documentElement;
  return { width: el.clientWidth, height: Math.max(el.scrollHeight, el.clientHeight) };
}

/**
 * Identifies the layout a snapshot depends on. Viewport height is deliberately
 * excluded (mobile URL-bar show/hide changes it without reflowing the document).
 */
export function layoutKey(scale: number): string {
  const { width, height } = documentSize();
  return `${width}x${height}@${scale}`;
}

export async function capturePage(theme: Theme, scale: number, maxTextureSize: number): Promise<Snapshot> {
  const t0 = performance.now();
  const key = layoutKey(scale);
  const { width, height } = documentSize();

  // Never exceed what the GPU can hold; the shader handles scale != canvas DPR.
  const safeScale = Math.min(scale, maxTextureSize / width, maxTextureSize / height);

  // Lazy-loaded: html2canvas is ~200 KB and only needed after first paint.
  const { default: html2canvas } = await import('html2canvas');
  const canvas = await html2canvas(document.body, {
    scale: safeScale,
    backgroundColor: BACKGROUND[theme],
    x: 0,
    y: 0,
    width,
    height,
    scrollX: 0,
    scrollY: 0,
    // The clone iframe renders without a scrollbar, so give it the live page's
    // scrollbar-less width; otherwise centred content shifts by half a scrollbar.
    windowWidth: width,
    windowHeight: document.documentElement.clientHeight,
    logging: false,
    useCORS: true,
    onclone: (doc) => {
      doc.documentElement.dataset.theme = theme;
      // The portfolio uses color-mix() in a few decorative backgrounds. Pin those
      // backgrounds to equivalent solid theme colours in the snapshot clone so
      // html2canvas can rasterise the page consistently on mobile browsers.
      const light = theme === 'light';
      const root = doc.documentElement;
      const bg = light ? '#f2efe8' : '#090a0b';
      const paper = light ? '#20201e' : '#eeeae3';
      const gold = light ? '#79521f' : '#c9aa75';
      const red = light ? '#a9473b' : '#c45b4d';
      doc.body.style.backgroundColor = bg;
      doc.querySelectorAll<HTMLElement>('.header').forEach((el) => { el.style.backgroundColor = bg; });
      doc.querySelectorAll<HTMLElement>('.project-card,.contact-form').forEach((el) => {
        el.style.backgroundColor = light ? '#e7e3da' : '#0d0e0f';
      });
      doc.querySelectorAll<HTMLElement>('.project-visual').forEach((el) => {
        el.style.backgroundColor = light ? '#e3dfd6' : '#151515';
      });
      doc.querySelectorAll<HTMLElement>('.visual-two').forEach((el) => {
        el.style.backgroundImage = 'none';
        el.style.backgroundColor = light ? '#e7dfd0' : '#211d18';
      });
      doc.querySelectorAll<HTMLElement>('.visual-three').forEach((el) => {
        el.style.backgroundImage = 'none';
        el.style.backgroundColor = light ? '#e8ddda' : '#201a1a';
      });
      doc.querySelectorAll<HTMLElement>('.skill-card').forEach((el) => {
        el.style.backgroundImage = 'none';
        el.style.backgroundColor = light ? '#e4e0d7' : '#111213';
      });
      // Keep the live toggle above the overlay, but omit its duplicate in snapshots.
      doc.querySelectorAll<HTMLElement>('[data-ink-live]').forEach((el) => {
        el.style.visibility = 'hidden';
      });
    },
  });

  return { theme, canvas, scale: safeScale, key, ms: performance.now() - t0 };
}
