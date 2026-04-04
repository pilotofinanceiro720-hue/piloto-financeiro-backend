import { FlatList, Image, Linking, Pressable, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface NewsItem {
  id: string;
  titulo: string;
  descricao: string;
  thumbnail: string;
  videoId: string;
}

const NEWS_DATA: NewsItem[] = [
  {
    id: "1",
    titulo: "Bem-vindo ao Rota do Lucro",
    descricao: "Conheça a plataforma que vai transformar sua gestão como motorista",
    thumbnail: "https://picsum.photos/seed/video1/400/225",
    videoId: "dQw4w9WgXcQ",
  },
  {
    id: "2",
    titulo: "Como aumentar seus ganhos em 2024",
    descricao: "Dicas práticas baseadas em dados reais de motoristas",
    thumbnail: "https://picsum.photos/seed/video2/400/225",
    videoId: "dQw4w9WgXcQ",
  },
  {
    id: "3",
    titulo: "Entenda seu dashboard",
    descricao: "Tutorial completo das funcionalidades do app",
    thumbnail: "https://picsum.photos/seed/video3/400/225",
    videoId: "dQw4w9WgXcQ",
  },
];

function NewsCard({ item }: { item: NewsItem }) {
  const colors = useColors();

  const handleWatch = () => {
    const youtubeUrl = `https://youtube.com/watch?v=${item.videoId}`;
    Linking.openURL(youtubeUrl).catch((err) => {
      console.error("Erro ao abrir YouTube:", err);
    });
  };

  return (
    <View className="mb-4 rounded-lg overflow-hidden border border-border bg-surface shadow-sm">
      {/* Thumbnail */}
      <Image
        source={{ uri: item.thumbnail }}
        className="w-full h-40"
        resizeMode="cover"
      />

      {/* Content */}
      <View className="p-4">
        {/* Título */}
        <Text className="text-lg font-semibold text-foreground mb-2" numberOfLines={2}>
          {item.titulo}
        </Text>

        {/* Descrição */}
        <Text className="text-sm text-muted mb-4" numberOfLines={2}>
          {item.descricao}
        </Text>

        {/* Botão Assistir */}
        <Pressable
          onPress={handleWatch}
          style={({ pressed }) => [
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          className="py-3 px-4 rounded-lg items-center"
        >
          <Text className="text-white font-semibold">Assistir</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function NewsScreen() {
  return (
    <ScreenContainer className="p-4">
      <View className="mb-4">
        <Text className="text-3xl font-bold text-foreground">Notícias</Text>
        <Text className="text-sm text-muted mt-1">Rota do Lucro</Text>
      </View>

      <FlatList
        data={NEWS_DATA}
        renderItem={({ item }) => <NewsCard item={item} />}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </ScreenContainer>
  );
}
