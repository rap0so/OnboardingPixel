import deepmerge from 'deepmerge';
import * as themes from './defaultThemes';

/**
 * @param  {} theme
 * @param  {} options
 */
export default function setTheme(theme, options = {}) {
  if (!theme) {
    return null;
  }

  const mode = themes[options.mode || 'default'];
  return deepmerge(mode, theme);
}
