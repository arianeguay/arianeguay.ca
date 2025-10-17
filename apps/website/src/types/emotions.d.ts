// emotion.d.ts
import '@emotion/react';
import { CustomTheme } from '../theme'; // Adjust path if needed

declare module '@emotion/react' {
  export interface Theme extends CustomTheme {}
}