import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { articles } from "@/data/articles";

export default function ArticleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const article = articles.find(a => a.id === id) || articles[0];
  const related = articles.filter(a => a.id !== article.id).slice(0, 2);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Image source={article.imageUrl} style={styles.heroImage} contentFit="cover" />

      <View style={styles.content}>
        <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.badgeText, { color: colors.primary }]}>{article.category}</Text>
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>{article.title}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Feather name="user" size={14} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{article.author}</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="clock" size={14} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{article.readTime} min read</Text>
          </View>
        </View>

        <View style={styles.bodyContainer}>
          {article.content.split('\n\n').map((paragraph, index) => (
            <Text key={index} style={[styles.paragraph, { color: colors.foreground }]}>
              {paragraph}
            </Text>
          ))}
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <Text style={[styles.relatedTitle, { color: colors.foreground }]}>Related articles</Text>
        <View style={styles.relatedContainer}>
          {related.map(item => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [styles.relatedCard, { backgroundColor: colors.card, borderRadius: colors.radius }, pressed && { opacity: 0.7 }]}
              onPress={() => router.push(`/article/${item.id}`)}
            >
              <Image source={item.imageUrl} style={styles.relatedImg} contentFit="cover" />
              <View style={styles.relatedBody}>
                <Text style={[styles.relatedItemTitle, { color: colors.foreground }]} numberOfLines={2}>{item.title}</Text>
                <Text style={[styles.relatedMeta, { color: colors.mutedForeground }]}>{item.readTime} min read</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroImage: { width: "100%", aspectRatio: 16 / 9 },
  content: { padding: 24 },
  badge: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 16 },
  badgeText: { fontFamily: "Cairo_700Bold", fontSize: 12, textTransform: "uppercase" },
  title: { fontFamily: "Cairo_700Bold", fontSize: 32, lineHeight: 40, marginBottom: 16 },
  metaRow: { flexDirection: "row", gap: 16, marginBottom: 32 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontFamily: "Cairo_600SemiBold", fontSize: 14 },
  bodyContainer: { gap: 20, marginBottom: 40 },
  paragraph: { fontFamily: "Cairo_400Regular", fontSize: 16, lineHeight: 26 },
  divider: { height: 1, width: "100%", marginBottom: 32 },
  relatedTitle: { fontFamily: "Cairo_700Bold", fontSize: 22, marginBottom: 16 },
  relatedContainer: { gap: 16 },
  relatedCard: { flexDirection: "row", height: 100, overflow: "hidden" },
  relatedImg: { width: 100, height: 100 },
  relatedBody: { flex: 1, padding: 16, justifyContent: "center" },
  relatedItemTitle: { fontFamily: "Cairo_600SemiBold", fontSize: 16, lineHeight: 22, marginBottom: 8 },
  relatedMeta: { fontFamily: "Cairo_500Medium", fontSize: 13 },
});
