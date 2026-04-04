/**
 * ONBOARDING — TELA PRINCIPAL
 * Fluxo de 5 passos para novos usuários
 * TODO: Implementar persistência de dados entre passos
 * TODO: Implementar validação de CPF/email
 */

import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";

type OnboardingStep = 1 | 2 | 3 | 4 | 5;

interface OnboardingData {
  step1: { lgpdConsent: boolean };
  step2: { name: string; email: string; cpf: string };
  step3: { brand: string; model: string; year: number; fuelType: string };
  step4: { bankCode: string; accountType: string; accountNumber: string };
  step5: { confirmed: boolean };
}

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [data, setData] = useState<OnboardingData>({
    step1: { lgpdConsent: false },
    step2: { name: "", email: "", cpf: "" },
    step3: { brand: "", model: "", year: 2024, fuelType: "flex" },
    step4: { bankCode: "", accountType: "", accountNumber: "" },
    step5: { confirmed: false },
  });

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as OnboardingStep);
    } else {
      // TODO: Enviar dados para backend
      // TODO: Marcar onboarding_completed = true
      router.replace("/(tabs)");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as OnboardingStep);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-between p-6">
          {/* STEP 1: LGPD & TERMS */}
          {currentStep === 1 && (
            <View className="gap-6">
              <View>
                <Text className="text-3xl font-bold text-foreground mb-2">
                  Bem-vindo ao Piloto Financeiro
                </Text>
                <Text className="text-base text-muted">
                  Gestão inteligente que transforma sua rotina
                </Text>
              </View>

              <View className="bg-surface rounded-lg p-4 gap-4">
                <Text className="text-lg font-semibold text-foreground">
                  Termos e Privacidade
                </Text>
                <Text className="text-sm text-muted leading-relaxed">
                  Ao continuar, você concorda com nossos Termos de Serviço e
                  Política de Privacidade. Seus dados serão protegidos conforme
                  a LGPD.
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    setData({
                      ...data,
                      step1: {
                        lgpdConsent: !data.step1.lgpdConsent,
                      },
                    })
                  }
                  className="flex-row items-center gap-3"
                >
                  <View
                    className={`w-6 h-6 rounded border-2 ${
                      data.step1.lgpdConsent
                        ? "bg-primary border-primary"
                        : "border-border"
                    }`}
                  />
                  <Text className="text-sm text-foreground flex-1">
                    Concordo com os termos e política de privacidade
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 2: PERSONAL DATA */}
          {currentStep === 2 && (
            <View className="gap-6">
              <Text className="text-2xl font-bold text-foreground">
                Seus Dados Pessoais
              </Text>

              <View className="gap-4">
                {/* TODO: Implementar TextInput com validação */}
                <View className="bg-surface rounded-lg p-4">
                  <Text className="text-sm text-muted mb-2">Nome Completo</Text>
                  <Text className="text-base text-foreground">
                    {data.step2.name || "Digite seu nome"}
                  </Text>
                </View>

                <View className="bg-surface rounded-lg p-4">
                  <Text className="text-sm text-muted mb-2">Email</Text>
                  <Text className="text-base text-foreground">
                    {data.step2.email || "seu@email.com"}
                  </Text>
                </View>

                <View className="bg-surface rounded-lg p-4">
                  <Text className="text-sm text-muted mb-2">CPF</Text>
                  <Text className="text-base text-foreground">
                    {data.step2.cpf || "000.000.000-00"}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* STEP 3: VEHICLE */}
          {currentStep === 3 && (
            <View className="gap-6">
              <Text className="text-2xl font-bold text-foreground">
                Seu Veículo
              </Text>

              <View className="gap-4">
                {/* TODO: Implementar TextInput e Picker */}
                <View className="bg-surface rounded-lg p-4">
                  <Text className="text-sm text-muted mb-2">Marca</Text>
                  <Text className="text-base text-foreground">
                    {data.step3.brand || "Ex: Toyota"}
                  </Text>
                </View>

                <View className="bg-surface rounded-lg p-4">
                  <Text className="text-sm text-muted mb-2">Modelo</Text>
                  <Text className="text-base text-foreground">
                    {data.step3.model || "Ex: Corolla"}
                  </Text>
                </View>

                <View className="bg-surface rounded-lg p-4">
                  <Text className="text-sm text-muted mb-2">Ano</Text>
                  <Text className="text-base text-foreground">
                    {data.step3.year}
                  </Text>
                </View>

                <View className="bg-surface rounded-lg p-4">
                  <Text className="text-sm text-muted mb-2">Combustível</Text>
                  <Text className="text-base text-foreground">
                    {data.step3.fuelType}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* STEP 4: BANK */}
          {currentStep === 4 && (
            <View className="gap-6">
              <Text className="text-2xl font-bold text-foreground">
                Dados Bancários (PIX)
              </Text>

              <View className="gap-4">
                {/* TODO: Implementar integração com Asaas */}
                <View className="bg-surface rounded-lg p-4">
                  <Text className="text-sm text-muted mb-2">
                    Chave PIX (CPF, Email ou Telefone)
                  </Text>
                  <Text className="text-base text-foreground">
                    {data.step4.bankCode || "Digite sua chave PIX"}
                  </Text>
                </View>

                <View className="bg-warning/10 rounded-lg p-4 border border-warning">
                  <Text className="text-xs text-warning font-semibold">
                    ⚠️ SEGURANÇA
                  </Text>
                  <Text className="text-xs text-muted mt-2">
                    Seus dados bancários são criptografados e nunca são
                    compartilhados.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* STEP 5: CONFIRMATION */}
          {currentStep === 5 && (
            <View className="gap-6">
              <View className="bg-success/10 rounded-lg p-6 items-center gap-4">
                <Text className="text-4xl">✅</Text>
                <Text className="text-2xl font-bold text-foreground text-center">
                  Tudo Pronto!
                </Text>
                <Text className="text-base text-muted text-center">
                  Sua conta foi criada com sucesso. Agora você pode começar a
                  rastrear suas corridas e ganhos.
                </Text>
              </View>

              <View className="bg-surface rounded-lg p-4 gap-2">
                <Text className="text-sm font-semibold text-foreground">
                  Resumo:
                </Text>
                <Text className="text-xs text-muted">
                  • Nome: {data.step2.name}
                </Text>
                <Text className="text-xs text-muted">
                  • Veículo: {data.step3.brand} {data.step3.model}
                </Text>
                <Text className="text-xs text-muted">
                  • Plano: Gratuito (com opção de upgrade)
                </Text>
              </View>
            </View>
          )}

          {/* NAVIGATION */}
          <View className="gap-3 mt-6">
            <TouchableOpacity
              onPress={handleNext}
              disabled={
                currentStep === 1 && !data.step1.lgpdConsent
              }
              className={`py-4 rounded-lg items-center ${
                currentStep === 1 && !data.step1.lgpdConsent
                  ? "bg-muted/50"
                  : "bg-primary"
              }`}
            >
              <Text className="text-white font-semibold">
                {currentStep === 5 ? "Começar" : "Próximo"}
              </Text>
            </TouchableOpacity>

            {currentStep > 1 && (
              <TouchableOpacity
                onPress={handleBack}
                className="py-4 rounded-lg items-center border border-border"
              >
                <Text className="text-foreground font-semibold">Voltar</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* PROGRESS */}
          <View className="flex-row gap-1 mt-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <View
                key={step}
                className={`flex-1 h-1 rounded-full ${
                  step <= currentStep ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
