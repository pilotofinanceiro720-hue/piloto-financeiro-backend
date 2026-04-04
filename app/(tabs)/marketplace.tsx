import { Text, View, TouchableOpacity, ScrollView, TextInput, Image } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

type TabType = "offers" | "wishlist";

export default function MarketplaceScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<TabType>("offers");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - ofertas
  const offers = [
    {
      id: 1,
      title: "Pneu Pirelli P7 195/55 R16",
      price: 389.90,
      originalPrice: 459.90,
      storeName: "Loja de Pneus Online",
      couponCode: "PNEU10",
      imageUrl: "https://via.placeholder.com/150",
      trustScore: 95,
    },
    {
      id: 2,
      title: "Óleo Motor Mobil Super 3000 5W-30",
      price: 45.90,
      originalPrice: 59.90,
      storeName: "AutoPeças Brasil",
      couponCode: null,
      imageUrl: "https://via.placeholder.com/150",
      trustScore: 92,
    },
    {
      id: 3,
      title: "Kit Filtros (Ar + Óleo + Combustível)",
      price: 89.90,
      originalPrice: 129.90,
      storeName: "Filtros Premium",
      couponCode: "KIT15",
      imageUrl: "https://via.placeholder.com/150",
      trustScore: 88,
    },
  ];

  const wishlistItems = [
    {
      id: 1,
      title: "Pastilha de Freio Bosch",
      price: 129.90,
      storeName: "AutoPeças Brasil",
      imageUrl: "https://via.placeholder.com/150",
      alertOnPriceDrop: true,
      alertOnCoupon: true,
    },
  ];

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="px-4 pt-4 pb-3">
          <Text className="text-2xl font-bold text-foreground">Marketplace</Text>
          <Text className="text-sm text-muted mt-1">Economize com ofertas exclusivas</Text>
        </View>

        {/* Search Bar */}
        <View className="px-4 mb-4">
          <View className="bg-surface border border-border rounded-xl px-4 py-3 flex-row items-center gap-3">
            <IconSymbol name="cart.fill" size={20} color={colors.muted} />
            <TextInput
              className="flex-1 text-foreground"
              placeholder="Buscar produtos (ex: pneu, óleo, filtro)"
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row px-4 mb-4 gap-2">
          <TouchableOpacity
            onPress={() => setActiveTab("offers")}
            className={`flex-1 py-3 rounded-full ${
              activeTab === "offers" ? "bg-primary" : "bg-surface border border-border"
            }`}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                activeTab === "offers" ? "text-white" : "text-foreground"
              }`}
            >
              Ofertas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("wishlist")}
            className={`flex-1 py-3 rounded-full ${
              activeTab === "wishlist" ? "bg-primary" : "bg-surface border border-border"
            }`}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                activeTab === "wishlist" ? "text-white" : "text-foreground"
              }`}
            >
              Lista de Desejos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo */}
        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {activeTab === "offers" ? (
            // Grid de Ofertas
            <View className="pb-6">
              {offers.map((offer) => (
                <View
                  key={offer.id}
                  className="bg-surface rounded-2xl p-4 mb-3 border border-border"
                >
                  <View className="flex-row gap-3">
                    {/* Imagem do Produto */}
                    <View className="w-24 h-24 bg-background rounded-xl border border-border items-center justify-center">
                      <IconSymbol name="cart.fill" size={32} color={colors.muted} />
                    </View>

                    {/* Informações do Produto */}
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-foreground mb-1" numberOfLines={2}>
                        {offer.title}
                      </Text>
                      <Text className="text-xs text-muted mb-2">{offer.storeName}</Text>
                      
                      <View className="flex-row items-center gap-2 mb-2">
                        <Text className="text-lg font-bold text-success">
                          R$ {offer.price.toFixed(2)}
                        </Text>
                        {offer.originalPrice && (
                          <>
                            <Text className="text-xs text-muted line-through">
                              R$ {offer.originalPrice.toFixed(2)}
                            </Text>
                            <View className="bg-success/10 px-2 py-0.5 rounded">
                              <Text className="text-xs font-bold text-success">
                                -{calculateDiscount(offer.originalPrice, offer.price)}%
                              </Text>
                            </View>
                          </>
                        )}
                      </View>

                      {offer.couponCode && (
                        <View className="bg-warning/10 px-2 py-1 rounded-lg self-start mb-2">
                          <Text className="text-xs font-bold text-warning">
                            Cupom: {offer.couponCode}
                          </Text>
                        </View>
                      )}

                      <View className="flex-row items-center gap-1">
                        <IconSymbol name="star.fill" size={12} color={colors.success} />
                        <Text className="text-xs text-muted">
                          Confiança: {offer.trustScore}%
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Botões de Ação */}
                  <View className="flex-row gap-2 mt-3">
                    <TouchableOpacity
                      className="flex-1 bg-primary rounded-full py-3 active:opacity-80"
                      onPress={() => console.log("Comprar", offer.id)}
                    >
                      <Text className="text-white text-center text-sm font-bold">Comprar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-surface border border-border rounded-full px-4 py-3 active:opacity-70"
                      onPress={() => console.log("Adicionar à lista", offer.id)}
                    >
                      <IconSymbol name="star.fill" size={18} color={colors.foreground} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              {/* Mensagem de IA */}
              <View className="bg-primary/10 rounded-2xl p-4 border border-primary/20">
                <View className="flex-row items-center gap-2 mb-2">
                  <IconSymbol name="paperplane.fill" size={18} color={colors.primary} />
                  <Text className="text-sm font-bold text-primary">Busca Inteligente</Text>
                </View>
                <Text className="text-xs text-muted">
                  Nossa IA busca as melhores ofertas e verifica a confiabilidade das lojas para você economizar com segurança.
                </Text>
              </View>
            </View>
          ) : (
            // Lista de Desejos
            <View className="pb-6">
              {wishlistItems.length > 0 ? (
                wishlistItems.map((item) => (
                  <View
                    key={item.id}
                    className="bg-surface rounded-2xl p-4 mb-3 border border-border"
                  >
                    <View className="flex-row gap-3 mb-3">
                      <View className="w-20 h-20 bg-background rounded-xl border border-border items-center justify-center">
                        <IconSymbol name="cart.fill" size={28} color={colors.muted} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-bold text-foreground mb-1" numberOfLines={2}>
                          {item.title}
                        </Text>
                        <Text className="text-xs text-muted mb-2">{item.storeName}</Text>
                        <Text className="text-base font-bold text-foreground">
                          R$ {item.price.toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    {/* Alertas */}
                    <View className="bg-background rounded-xl p-3 mb-3">
                      <Text className="text-xs font-medium text-foreground mb-2">Alertas ativos:</Text>
                      <View className="gap-1">
                        {item.alertOnPriceDrop && (
                          <View className="flex-row items-center gap-2">
                            <View className="w-1.5 h-1.5 rounded-full bg-success" />
                            <Text className="text-xs text-muted">Queda de preço</Text>
                          </View>
                        )}
                        {item.alertOnCoupon && (
                          <View className="flex-row items-center gap-2">
                            <View className="w-1.5 h-1.5 rounded-full bg-warning" />
                            <Text className="text-xs text-muted">Novo cupom disponível</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Botões */}
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        className="flex-1 bg-primary rounded-full py-3 active:opacity-80"
                        onPress={() => console.log("Ver oferta", item.id)}
                      >
                        <Text className="text-white text-center text-sm font-bold">Ver Oferta</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-error/10 border border-error/20 rounded-full px-4 py-3 active:opacity-70"
                        onPress={() => console.log("Remover", item.id)}
                      >
                        <Text className="text-error text-sm font-medium">Remover</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <View className="items-center justify-center py-12">
                  <IconSymbol name="star.fill" size={48} color={colors.muted} />
                  <Text className="text-muted text-base mt-4">Sua lista está vazia</Text>
                  <Text className="text-muted text-sm mt-1 text-center px-8">
                    Adicione produtos às suas favoritas para receber alertas
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
