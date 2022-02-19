import Color from 'color';
import { ColorScheme } from '../types/ColorScheme';

export const useColor = (value: string): ColorScheme => {
  const color = Color(value);
  const desaturated = color.saturationl(64);

  const primary = color.toString();
  const primaryDark = desaturated.lightness(31).toString();
  const primaryLight = desaturated.lightness(54).toString();
  const textOnPrimary = desaturated.lightness(21).toString();

  return [primary, primaryDark, primaryLight, textOnPrimary];
};
