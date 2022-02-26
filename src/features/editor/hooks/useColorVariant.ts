import { ColorScheme } from '../types/ColorScheme';
import { ColorVariant } from '../types/ColorVariant';

export const useColorVariant = (scheme: ColorScheme, active: boolean): ColorVariant => {
  const [primary, dark, light, text] = scheme;

  if (active) return [primary, dark, text];
  return [text, light, primary];
};
