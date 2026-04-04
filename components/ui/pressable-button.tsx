/**
 * PressableButton - Wrapper corrigido para Pressable
 * Resolve problema de eventos não disparando em tablets
 */

import { Pressable, Text, View, type PressableProps, type ViewStyle } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

interface PressableButtonProps extends Omit<PressableProps, "style"> {
  label: string;
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onPress: () => void | Promise<void>;
}

export function PressableButton({
  label,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  className,
  onPress,
  ...props
}: PressableButtonProps) {
  const colors = useColors();

  // Memoize onPress para evitar re-renders desnecessários
  const handlePress = useCallback(async () => {
    if (disabled || loading) return;

    try {
      const result = onPress();
      if (result instanceof Promise) {
        await result;
      }
    } catch (error) {
      console.error("❌ Erro ao pressionar botão:", error);
    }
  }, [onPress, disabled, loading]);

  // Estilos base
  const baseStyle: ViewStyle = {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    opacity: disabled ? 0.5 : 1,
  };

  // Estilos por tamanho
  const sizeStyles: Record<string, ViewStyle> = {
    small: { paddingVertical: 8, paddingHorizontal: 12, minHeight: 32 },
    medium: { paddingVertical: 12, paddingHorizontal: 16, minHeight: 44 },
    large: { paddingVertical: 16, paddingHorizontal: 20, minHeight: 56 },
  };

  // Estilos por variante
  const variantStyles: Record<string, { bg: string; text: string }> = {
    primary: { bg: colors.primary, text: colors.background },
    secondary: { bg: colors.surface, text: colors.foreground },
    danger: { bg: colors.error, text: colors.background },
    success: { bg: colors.success, text: colors.background },
  };

  const { bg, text } = variantStyles[variant];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      {...props}
      style={({ pressed }) => [
        baseStyle,
        sizeStyles[size],
        {
          backgroundColor: bg,
          transform: [{ scale: pressed && !disabled ? 0.97 : 1 }],
        },
      ]}
    >
      <Text
        style={{
          color: text,
          fontWeight: "600",
          fontSize: size === "small" ? 12 : size === "large" ? 16 : 14,
        }}
      >
        {loading ? "Carregando..." : label}
      </Text>
    </Pressable>
  );
}

/**
 * IconButton - Botão com ícone
 */
interface IconButtonProps extends Omit<PressableProps, "style"> {
  icon: React.ReactNode;
  onPress: () => void | Promise<void>;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
}

export function IconButton({
  icon,
  onPress,
  disabled = false,
  size = "medium",
  ...props
}: IconButtonProps) {
  const handlePress = useCallback(async () => {
    if (disabled) return;

    try {
      const result = onPress();
      if (result instanceof Promise) {
        await result;
      }
    } catch (error) {
      console.error("❌ Erro ao pressionar ícone:", error);
    }
  }, [onPress, disabled]);

  const sizeMap = { small: 24, medium: 32, large: 40 };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      {...props}
      style={({ pressed }) => [
        {
          width: sizeMap[size],
          height: sizeMap[size],
          borderRadius: sizeMap[size] / 2,
          justifyContent: "center",
          alignItems: "center",
          opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
        },
      ]}
    >
      {icon}
    </Pressable>
  );
}
