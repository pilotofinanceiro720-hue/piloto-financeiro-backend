/**
 * useResponsive - Hook para layout responsivo em tablets
 * Detecta tamanho da tela e fornece breakpoints
 */

import { useWindowDimensions } from "react-native";
import { useMemo } from "react";

export interface ResponsiveBreakpoints {
  isPhone: boolean;
  isTablet: boolean;
  isLandscape: boolean;
  width: number;
  height: number;
  breakpoint: "xs" | "sm" | "md" | "lg" | "xl";
  columns: number;
  padding: number;
  gap: number;
}

/**
 * Determina breakpoint baseado na largura
 */
function getBreakpoint(width: number): "xs" | "sm" | "md" | "lg" | "xl" {
  if (width < 480) return "xs"; // Telefone pequeno
  if (width < 768) return "sm"; // Telefone grande
  if (width < 1024) return "md"; // Tablet pequeno
  if (width < 1280) return "lg"; // Tablet grande
  return "xl"; // Desktop
}

/**
 * Calcula número de colunas para grid
 */
function getColumns(width: number): number {
  if (width < 480) return 1; // Telefone: 1 coluna
  if (width < 768) return 2; // Telefone grande: 2 colunas
  if (width < 1024) return 2; // Tablet pequeno: 2 colunas
  if (width < 1280) return 3; // Tablet grande: 3 colunas
  return 4; // Desktop: 4 colunas
}

/**
 * Calcula padding baseado na largura
 */
function getPadding(width: number): number {
  if (width < 480) return 12; // Telefone: 12px
  if (width < 768) return 16; // Telefone grande: 16px
  if (width < 1024) return 20; // Tablet pequeno: 20px
  if (width < 1280) return 24; // Tablet grande: 24px
  return 32; // Desktop: 32px
}

/**
 * Calcula gap entre elementos
 */
function getGap(width: number): number {
  if (width < 480) return 8; // Telefone: 8px
  if (width < 768) return 12; // Telefone grande: 12px
  if (width < 1024) return 16; // Tablet pequeno: 16px
  if (width < 1280) return 20; // Tablet grande: 20px
  return 24; // Desktop: 24px
}

export function useResponsive(): ResponsiveBreakpoints {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const isLandscape = width > height;
    const isTablet = width >= 768;
    const isPhone = !isTablet;
    const breakpoint = getBreakpoint(width);
    const columns = getColumns(width);
    const padding = getPadding(width);
    const gap = getGap(width);

    console.log("📱 Responsivo:", {
      width,
      height,
      isLandscape,
      isTablet,
      breakpoint,
      columns,
      padding,
      gap,
    });

    return {
      isPhone,
      isTablet,
      isLandscape,
      width,
      height,
      breakpoint,
      columns,
      padding,
      gap,
    };
  }, [width, height]);
}

/**
 * Utilitários para estilos responsivos
 */
export const responsiveStyles = {
  /**
   * Padding responsivo
   */
  padding: (responsive: ResponsiveBreakpoints) => ({
    paddingHorizontal: responsive.padding,
    paddingVertical: responsive.padding / 2,
  }),

  /**
   * Gap responsivo
   */
  gap: (responsive: ResponsiveBreakpoints) => ({
    gap: responsive.gap,
  }),

  /**
   * Largura de coluna para grid
   */
  columnWidth: (responsive: ResponsiveBreakpoints) => {
    const availableWidth = responsive.width - responsive.padding * 2 - responsive.gap * (responsive.columns - 1);
    return availableWidth / responsive.columns;
  },

  /**
   * Tamanho de fonte responsivo
   */
  fontSize: (responsive: ResponsiveBreakpoints, baseSize: number) => {
    if (responsive.isPhone) return baseSize;
    if (responsive.breakpoint === "md") return baseSize * 1.1;
    if (responsive.breakpoint === "lg") return baseSize * 1.2;
    return baseSize * 1.3;
  },

  /**
   * Altura de botão responsiva
   */
  buttonHeight: (responsive: ResponsiveBreakpoints) => {
    if (responsive.isPhone) return 44;
    if (responsive.breakpoint === "md") return 48;
    return 52;
  },

  /**
   * Espaçamento responsivo
   */
  spacing: (responsive: ResponsiveBreakpoints, multiplier: number = 1) => ({
    margin: responsive.gap * multiplier,
    padding: responsive.padding * multiplier,
  }),
};

// Exemplo de uso:
// import { useResponsive, responsiveStyles } from '@/lib/hooks/use-responsive';
//
// export function MyComponent() {
//   const responsive = useResponsive();
//
//   return (
//     <View style={[
//       responsiveStyles.padding(responsive),
//       { flex: 1 }
//     ]}>
//       {responsive.isTablet && (
//         <View style={{ flexDirection: 'row', ...responsiveStyles.gap(responsive) }}>
//           {/* Layout de 2-3 colunas em tablet */}
//         </View>
//       )}
//
//       {responsive.isPhone && (
//         <View style={{ ...responsiveStyles.gap(responsive) }}>
//           {/* Layout de 1 coluna em telefone */}
//         </View>
//       )}
//     </View>
//   );
// }
