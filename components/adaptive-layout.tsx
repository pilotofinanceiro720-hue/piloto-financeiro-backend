/**
 * AdaptiveLayout - Componente de layout que se adapta a smartphone/tablet
 * Ajusta automaticamente espaçamento, grid e tipografia
 */

import { View, ScrollView, useWindowDimensions, type ViewProps } from "react-native";
import { ReactNode, useMemo } from "react";

interface AdaptiveLayoutProps extends ViewProps {
  children: ReactNode;
  variant?: "phone" | "tablet" | "auto";
  columns?: number;
  gap?: number;
  padding?: number;
}

/**
 * Determina se é tablet baseado na largura
 */
function isTablet(width: number): boolean {
  return width >= 768;
}

/**
 * Calcula número de colunas
 */
function getColumns(width: number, requestedColumns?: number): number {
  if (requestedColumns) return requestedColumns;
  if (width < 480) return 1; // Telefone pequeno
  if (width < 768) return 2; // Telefone grande
  if (width < 1024) return 2; // Tablet pequeno
  return 3; // Tablet grande
}

/**
 * Calcula padding responsivo
 */
function getPadding(width: number, requestedPadding?: number): number {
  if (requestedPadding) return requestedPadding;
  if (width < 480) return 12;
  if (width < 768) return 16;
  if (width < 1024) return 20;
  return 24;
}

/**
 * Calcula gap responsivo
 */
function getGap(width: number, requestedGap?: number): number {
  if (requestedGap) return requestedGap;
  if (width < 480) return 8;
  if (width < 768) return 12;
  if (width < 1024) return 16;
  return 20;
}

/**
 * Layout adaptativo principal
 */
export function AdaptiveLayout({
  children,
  variant = "auto",
  columns: requestedColumns,
  gap: requestedGap,
  padding: requestedPadding,
  style,
  ...props
}: AdaptiveLayoutProps) {
  const { width } = useWindowDimensions();

  const layout = useMemo(() => {
    const isTabletMode = variant === "tablet" || (variant === "auto" && isTablet(width));
    const cols = getColumns(width, requestedColumns);
    const pad = getPadding(width, requestedPadding);
    const g = getGap(width, requestedGap);

    return { isTabletMode, cols, pad, g };
  }, [width, variant, requestedColumns, requestedPadding, requestedGap]);

  return (
    <View
      style={[
        {
          flex: 1,
          paddingHorizontal: layout.pad,
          paddingVertical: layout.pad / 2,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

/**
 * Grid adaptativo
 */
interface AdaptiveGridProps extends ViewProps {
  children: ReactNode;
  columns?: number;
  gap?: number;
}

export function AdaptiveGrid({
  children,
  columns: requestedColumns,
  gap: requestedGap,
  style,
  ...props
}: AdaptiveGridProps) {
  const { width } = useWindowDimensions();

  const layout = useMemo(() => {
    const cols = getColumns(width, requestedColumns);
    const g = getGap(width, requestedGap);
    return { cols, g };
  }, [width, requestedColumns, requestedGap]);

  return (
    <View
      style={[
        {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: layout.g,
          marginHorizontal: -layout.g / 2,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

/**
 * Item de grid adaptativo
 */
interface AdaptiveGridItemProps extends ViewProps {
  children: ReactNode;
  columns?: number;
  gap?: number;
}

export function AdaptiveGridItem({
  children,
  columns: requestedColumns,
  gap: requestedGap,
  style,
  ...props
}: AdaptiveGridItemProps) {
  const { width } = useWindowDimensions();

  const layout = useMemo(() => {
    const cols = getColumns(width, requestedColumns);
    const g = getGap(width, requestedGap);
    const availableWidth = width - g * 2;
    const itemWidth = availableWidth / cols - g;

    return { itemWidth, g };
  }, [width, requestedColumns, requestedGap]);

  return (
    <View
      style={[
        {
          width: layout.itemWidth,
          marginHorizontal: layout.g / 2,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

/**
 * Espaçador responsivo
 */
interface ResponsiveSpacerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  vertical?: boolean;
}

export function ResponsiveSpacer({ size = "md", vertical = true }: ResponsiveSpacerProps) {
  const { width } = useWindowDimensions();

  const sizeMap = {
    xs: { phone: 4, tablet: 6 },
    sm: { phone: 8, tablet: 12 },
    md: { phone: 16, tablet: 20 },
    lg: { phone: 24, tablet: 32 },
    xl: { phone: 32, tablet: 48 },
  };

  const spacing = isTablet(width) ? sizeMap[size].tablet : sizeMap[size].phone;

  return (
    <View
      style={{
        [vertical ? "height" : "width"]: spacing,
      }}
    />
  );
}

/**
 * Exemplo de uso:
 *
 * import { AdaptiveLayout, AdaptiveGrid, AdaptiveGridItem, ResponsiveSpacer } from '@/components/adaptive-layout';
 *
 * export function MyScreen() {
 *   return (
 *     <AdaptiveLayout padding={16}>
 *       <Text>Título</Text>
 *
 *       <ResponsiveSpacer size="md" />
 *
 *       <AdaptiveGrid columns={2} gap={12}>
 *         <AdaptiveGridItem>
 *           <Card>Item 1</Card>
 *         </AdaptiveGridItem>
 *         <AdaptiveGridItem>
 *           <Card>Item 2</Card>
 *         </AdaptiveGridItem>
 *       </AdaptiveGrid>
 *     </AdaptiveLayout>
 *   );
 * }
 */
