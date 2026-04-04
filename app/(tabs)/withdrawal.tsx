import { Text, View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function WithdrawalScreen() {
  const colors = useColors();
  const [step, setStep] = useState<"amount" | "bank" | "review" | "success">("amount");
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountType, setAccountType] = useState<"checking" | "savings">("checking");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  const availableBalance = 450.0;
  const minimumAmount = 50.0;
  const maximumAmount = 10000.0;
  const fee = 0.0;

  const handleContinue = () => {
    if (step === "amount") {
      const numAmount = parseFloat(amount);
      if (!numAmount || numAmount < minimumAmount || numAmount > maximumAmount) {
        alert(`Valor deve estar entre R$ ${minimumAmount} e R$ ${maximumAmount}`);
        return;
      }
      if (numAmount > availableBalance) {
        alert("Saldo insuficiente");
        return;
      }
      setStep("bank");
    } else if (step === "bank") {
      if (!bankCode || !accountNumber || !accountHolder) {
        alert("Preencha todos os dados bancários");
        return;
      }
      setStep("review");
    } else if (step === "review") {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep("success");
      }, 2000);
    }
  };

  const netAmount = parseFloat(amount || "0") - fee;

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-4">
          <Text className="text-2xl font-bold text-foreground">Sacar Comissões</Text>
          <Text className="text-sm text-muted mt-1">
            Saldo disponível: R$ {availableBalance.toFixed(2)}
          </Text>
        </View>

        {/* Progress Indicator */}
        <View className="px-4 mb-6">
          <View className="flex-row items-center gap-2">
            {["amount", "bank", "review", "success"].map((s, idx) => (
              <View key={s} className="flex-row items-center flex-1">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    ["amount", "bank", "review", "success"].indexOf(step) >= idx
                      ? "bg-primary"
                      : "bg-border"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      ["amount", "bank", "review", "success"].indexOf(step) >= idx
                        ? "text-white"
                        : "text-muted"
                    }`}
                  >
                    {idx + 1}
                  </Text>
                </View>
                {idx < 3 && (
                  <View
                    className={`flex-1 h-1 mx-1 ${
                      ["amount", "bank", "review", "success"].indexOf(step) > idx
                        ? "bg-primary"
                        : "bg-border"
                    }`}
                  />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Step 1: Amount */}
        {step === "amount" && (
          <View className="px-4 mb-6">
            <Text className="text-base font-bold text-foreground mb-4">Quanto deseja sacar?</Text>

            <View className="bg-surface rounded-2xl p-6 border border-border mb-6">
              <Text className="text-sm text-muted mb-2">Valor do saque</Text>
              <View className="flex-row items-baseline gap-2">
                <Text className="text-3xl font-bold text-primary">R$</Text>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  className="flex-1 text-3xl font-bold text-foreground"
                />
              </View>

              <View className="border-t border-border mt-6 pt-4 gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Taxa de processamento</Text>
                  <Text className="text-sm font-semibold text-foreground">R$ {fee.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm font-bold text-foreground">Você receberá</Text>
                  <Text className="text-sm font-bold text-success">R$ {netAmount.toFixed(2)}</Text>
                </View>
              </View>
            </View>

            <View className="bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-6">
              <View className="flex-row items-start gap-3">
                <IconSymbol name="paperplane.fill" size={20} color={colors.primary} />
                <View className="flex-1">
                  <Text className="text-sm font-bold text-primary">Limites</Text>
                  <Text className="text-xs text-muted mt-1">
                    Mínimo: R$ {minimumAmount.toFixed(2)} | Máximo: R$ {maximumAmount.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Step 2: Bank Account */}
        {step === "bank" && (
          <View className="px-4 mb-6">
            <Text className="text-base font-bold text-foreground mb-4">Dados Bancários</Text>

            <View className="gap-4">
              {/* Bank Code */}
              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">Código do Banco</Text>
                <TextInput
                  value={bankCode}
                  onChangeText={setBankCode}
                  placeholder="Ex: 001 (Banco do Brasil)"
                  keyboardType="numeric"
                  maxLength={3}
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                />
              </View>

              {/* Account Type */}
              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">Tipo de Conta</Text>
                <View className="flex-row gap-3">
                  {(["checking", "savings"] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setAccountType(type)}
                      className={`flex-1 py-3 px-4 rounded-lg border ${
                        accountType === type
                          ? "bg-primary border-primary"
                          : "bg-surface border-border"
                      }`}
                    >
                      <Text
                        className={`text-center font-semibold ${
                          accountType === type ? "text-white" : "text-foreground"
                        }`}
                      >
                        {type === "checking" ? "Corrente" : "Poupança"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Account Number */}
              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">Número da Conta</Text>
                <TextInput
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  placeholder="Ex: 123456-7"
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                />
              </View>

              {/* Account Holder */}
              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">Titular da Conta</Text>
                <TextInput
                  value={accountHolder}
                  onChangeText={setAccountHolder}
                  placeholder="Seu nome completo"
                  className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
                />
              </View>
            </View>

            <View className="bg-warning/10 border border-warning/20 rounded-2xl p-4 mt-6">
              <View className="flex-row items-start gap-3">
                <IconSymbol name="paperplane.fill" size={20} color={colors.warning} />
                <View className="flex-1">
                  <Text className="text-sm font-bold text-warning">Verificação de Dados</Text>
                  <Text className="text-xs text-muted mt-1">
                    Certifique-se que os dados bancários estão corretos. Não podemos reverter transferências.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Step 3: Review */}
        {step === "review" && (
          <View className="px-4 mb-6">
            <Text className="text-base font-bold text-foreground mb-4">Confirme os Dados</Text>

            <View className="bg-surface rounded-2xl p-4 border border-border gap-4 mb-6">
              <View className="border-b border-border pb-4">
                <Text className="text-sm text-muted mb-1">Valor do Saque</Text>
                <Text className="text-2xl font-bold text-foreground">R$ {amount}</Text>
              </View>

              <View className="border-b border-border pb-4">
                <Text className="text-sm text-muted mb-1">Banco</Text>
                <Text className="text-base font-semibold text-foreground">{bankCode}</Text>
              </View>

              <View className="border-b border-border pb-4">
                <Text className="text-sm text-muted mb-1">Tipo de Conta</Text>
                <Text className="text-base font-semibold text-foreground">
                  {accountType === "checking" ? "Conta Corrente" : "Conta Poupança"}
                </Text>
              </View>

              <View className="border-b border-border pb-4">
                <Text className="text-sm text-muted mb-1">Número da Conta</Text>
                <Text className="text-base font-semibold text-foreground">{accountNumber}</Text>
              </View>

              <View>
                <Text className="text-sm text-muted mb-1">Titular</Text>
                <Text className="text-base font-semibold text-foreground">{accountHolder}</Text>
              </View>
            </View>

            <View className="bg-success/10 border border-success/20 rounded-2xl p-4">
              <View className="flex-row items-start gap-3">
                <IconSymbol name="star.fill" size={20} color={colors.success} />
                <View className="flex-1">
                  <Text className="text-sm font-bold text-success">Pronto para sacar</Text>
                  <Text className="text-xs text-muted mt-1">
                    O saque será processado em até 24 horas
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Step 4: Success */}
        {step === "success" && (
          <View className="px-4 mb-6 items-center">
            <View className="w-20 h-20 rounded-full bg-success/10 items-center justify-center mb-4">
              <IconSymbol name="star.fill" size={40} color={colors.success} />
            </View>

            <Text className="text-2xl font-bold text-foreground mb-2">Saque Solicitado!</Text>
            <Text className="text-sm text-muted text-center mb-6">
              Seu saque de R$ {amount} foi solicitado com sucesso. Você receberá em até 24 horas.
            </Text>

            <View className="bg-surface rounded-2xl p-4 border border-border w-full mb-6">
              <View className="flex-row justify-between mb-3">
                <Text className="text-sm text-muted">ID da Solicitação</Text>
                <Text className="text-sm font-semibold text-foreground">WD-{Date.now()}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Status</Text>
                <View className="bg-warning/10 px-3 py-1 rounded-full">
                  <Text className="text-xs font-bold text-warning">Processando</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Buttons */}
        <View className="px-4 pb-8 gap-3">
          {step !== "success" && (
            <>
              {step !== "amount" && (
                <TouchableOpacity
                  onPress={() => {
                    if (step === "bank") setStep("amount");
                    else if (step === "review") setStep("bank");
                  }}
                  className="bg-surface border border-border rounded-full py-4 active:opacity-80"
                >
                  <Text className="text-center text-base font-bold text-foreground">Voltar</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={handleContinue}
                disabled={isLoading}
                className="bg-primary rounded-full py-4 active:opacity-80"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-center text-base font-bold text-white">
                    {step === "review" ? "Confirmar Saque" : "Continuar"}
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {step === "success" && (
            <TouchableOpacity
              onPress={() => {
                setStep("amount");
                setAmount("");
              }}
              className="bg-primary rounded-full py-4 active:opacity-80"
            >
              <Text className="text-center text-base font-bold text-white">Voltar ao Início</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
