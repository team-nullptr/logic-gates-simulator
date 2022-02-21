import Color from 'color';
import { ColorScheme } from '../types/ColorScheme';

export const useColor = (value: string): ColorScheme => {
  const color = Color(value);
  const desaturated = color.saturationl(88);

  const primary = color.toString();
  const primaryDark = desaturated.lightness(73).toString();
  const primaryLight = desaturated.lightness(90).toString();
  const textOnPrimary = '#fff';

  return [primary, primaryDark, primaryLight, textOnPrimary];
};
