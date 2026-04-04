/**
 * Tela de Feedback do Usuário
 * Coleta feedback, classificação e sugestões
 */

import { ScrollView, Text, View, Pressable, TextInput, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";

export default function FeedbackScreen() {
  const colors = useColors();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Avaliação Necessária", "Por favor, selecione uma classificação");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Enviar feedback para backend
      console.log("📤 Enviando feedback...", {
        rating,
        feedback,
        suggestions,
        timestamp: new Date().toISOString(),
      });

      // Simular envio
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert("Sucesso!", "Obrigado pelo seu feedback! 🙏", [
        {
          text: "OK",
          onPress: () => {
            setRating(0);
            setFeedback("");
            setSuggestions("");
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Falha ao enviar feedback. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <View className="flex-row justify-center gap-4 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable
            key={star}
            onPress={() => setRating(star)}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          >
            <Text className="text-5xl">
              {star <= rating ? "⭐" : "☆"}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  };

  const getRatingText = () => {
    switch (rating) {
      case 1:
        return "Muito Ruim 😞";
      case 2:
        return "Ruim 😕";
      case 3:
        return "Neutro 😐";
      case 4:
        return "Bom 😊";
      case 5:
        return "Excelente 😍";
      default:
        return "Selecione uma classificação";
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6 p-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              Seu Feedback
            </Text>
            <Text className="text-base text-muted">
              Ajude-nos a melhorar o Rota do Lucro
            </Text>
          </View>

          {/* Rating Section */}
          <View
            className="rounded-lg border border-border bg-surface p-6"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <Text className="text-center text-lg font-semibold text-foreground mb-4">
              Como você avalia o app?
            </Text>

            {renderStars()}

            <Text className="text-center text-base font-semibold text-primary">
              {getRatingText()}
            </Text>
          </View>

          {/* Feedback Text */}
          <View className="gap-2">
            <Text className="text-base font-semibold text-foreground">
              O que funcionou bem?
            </Text>
            <TextInput
              placeholder="Compartilhe o que você gostou..."
              placeholderTextColor={colors.muted}
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={4}
              className="rounded-lg border border-border bg-background p-4 text-foreground"
              style={{
                borderColor: colors.border,
                color: colors.foreground,
              }}
            />
          </View>

          {/* Suggestions */}
          <View className="gap-2">
            <Text className="text-base font-semibold text-foreground">
              Sugestões de Melhoria
            </Text>
            <TextInput
              placeholder="Como podemos melhorar?"
              placeholderTextColor={colors.muted}
              value={suggestions}
              onChangeText={setSuggestions}
              multiline
              numberOfLines={4}
              className="rounded-lg border border-border bg-background p-4 text-foreground"
              style={{
                borderColor: colors.border,
                color: colors.foreground,
              }}
            />
          </View>

          {/* Info Box */}
          <View
            className="rounded-lg border border-border bg-surface p-4"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <Text className="text-sm font-semibold text-foreground mb-2">
              💡 Dica
            </Text>
            <Text className="text-sm text-muted">
              Seu feedback é anônimo e nos ajuda a criar um app melhor para todos os motoristas.
            </Text>
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={isSubmitting}
            className="rounded-lg bg-primary py-3 px-4"
            style={({ pressed }) => [
              { opacity: pressed || isSubmitting ? 0.7 : 1 },
            ]}
          >
            <Text className="text-center font-bold text-background">
              {isSubmitting ? "Enviando..." : "Enviar Feedback"}
            </Text>
          </Pressable>

          {/* Additional Info */}
          <View className="gap-3">
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">
                📞 Outras Formas de Contato
              </Text>
              <Text className="text-sm text-muted">
                Email: suporte@rotadolucro.com
              </Text>
              <Text className="text-sm text-muted">
                WhatsApp: +55 (11) 98765-4321
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
