import { MAX_REM, MIN_CANVAS_REM, MIN_REM } from '@/configs/layout.config';
import type { WidthBounds } from '@/dtos/width-bounds.dto';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ChatWidthUtil {
  static clampWidth(px: number, bounds: WidthBounds): number {
    return Math.round(Math.min(Math.max(px, bounds.min), Math.max(bounds.min, bounds.max)));
  }

  static getBounds(): WidthBounds {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const min = MIN_REM * rem;
    const body = document.querySelector('.app-body');
    if (!body) return { min, max: MAX_REM * rem };
    const sidebar = document.querySelector('.sidebar');
    const sidebarWidth = sidebar ? sidebar.getBoundingClientRect().width : 0;
    const space = body.clientWidth - sidebarWidth - MIN_CANVAS_REM * rem;
    return { min, max: Math.max(min, Math.min(MAX_REM * rem, space)) };
  }
}
