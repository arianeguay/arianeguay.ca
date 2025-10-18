import 'styled-components';
import { CustomTheme } from '../theme'; // Adjust path if needed

declare module 'styled-components' {
  export interface DefaultTheme extends CustomTheme {}
}