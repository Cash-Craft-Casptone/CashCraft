import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Platform, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

import { useColors } from "@/hooks/useColors";
import { useSettings } from "@/contexts/SettingsContext";
import { apiGetArticles, Article } from "@/lib/api";

export default function ArticlesScreen() {
  const colors = useColors();
  const { t, dir, language } = useSettings();
  const isRTL = dir === "rtl";
  const textAlign = isRTL ? "right" : "left";
  const writingDirection = isRTL ? "rtl" : "ltr";
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const topInset = isWeb ? 67 : insets.top;
  const bottomInset = isWeb ? 84 + 34 : 84 + insets.bottom;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: articles = [], isLoading, error } = useQuery({
    queryKey: ["articles"],
    queryFn: apiGetArticles,
  });

  const getTitle = (a: Article) => language === "ar" ? (a.titleAr || a.titleEn) : a.titleEn
  const getDesc = (a: Article) => language === "ar" ? (a.descriptionAr || a.descriptionEn || "") : (a.descriptionEn || "")

  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
      const title = getTitle(a)
      const desc = getDesc(a)
      const matchesSearch = title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            desc?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    });
  }, [articles, searchQuery, language]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topInset, paddingBottom: bottomInset }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground, textAlign, writingDirection }]}>{t("articles.title")}</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <Feather name="search" size={20} color={colors.mutedForeground} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground, textAlign, writingDirection }]}
            placeholder={t("articles.searchPlaceholder")}
            placeholderTextColor={colors.mutedForeground}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Feather name="wifi-off" size={40} color={colors.mutedForeground} />
          <Text style={[styles.errorText, { color: colors.mutedForeground }]}>Failed to load articles</Text>
        </View>
      ) : (
        <FlatList
          data={filteredArticles}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const title = getTitle(item)
            const desc = getDesc(item)
            return (
              <Pressable
                style={({ pressed }) => [styles.card, { backgroundColor: colors.card, borderRadius: colors.radius }, pressed && { opacity: 0.7 }]}
                onPress={() => router.push(`/article/${item.id}`)}
              >
                {item.coverUrl ? (
                  <Image source={{ uri: item.coverUrl }} style={styles.cardImage} contentFit="cover" />
                ) : (
                  <View style={[styles.cardImage, { backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center" }]}>
                    <Feather name="book-open" size={40} color={colors.primary} />
                  </View>
                )}
                <View style={styles.cardBody}>
                  <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
                    <Text style={[styles.badgeText, { color: colors.primary }]}>Article</Text>
                  </View>
                  <Text style={[styles.cardTitle, { color: colors.foreground }]} numberOfLines={2}>{title}</Text>
                  <Text style={[styles.cardExcerpt, { color: colors.mutedForeground }]} numberOfLines={2}>{desc}</Text>
                  <View style={styles.cardMeta}>
                    <Text style={[styles.metaText, { color: colors.mutedForeground }]}>5 {t("common.minRead")}</Text>
                  </View>
                </View>
              </Pressable>
            )
          }}
          ListEmptyComponent={
            <View style={styles.center}>
              <Feather name="book-open" size={40} color={colors.mutedForeground} />
              <Text style={[styles.errorText, { color: colors.mutedForeground }]}>No articles found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingVertical: 16 },
  title: { fontFamily: "Cairo_700Bold", fontSize: 28 },
  searchContainer: { paddingHorizontal: 24, marginBottom: 16 },
  searchBox: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, height: 48, borderWidth: 1 },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontFamily: "Cairo_500Medium", fontSize: 16 },
  listContent: { paddingHorizontal: 24, paddingBottom: 24, gap: 16 },
  card: { overflow: "hidden" },
  cardImage: { width: "100%", height: 160 },
  cardBody: { padding: 16 },
  badge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 12 },
  badgeText: { fontFamily: "Cairo_700Bold", fontSize: 10, textTransform: "uppercase" },
  cardTitle: { fontFamily: "Cairo_700Bold", fontSize: 18, lineHeight: 24, marginBottom: 8 },
  cardExcerpt: { fontFamily: "Cairo_400Regular", fontSize: 14, lineHeight: 20, marginBottom: 16 },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  metaText: { fontFamily: "Cairo_500Medium", fontSize: 13 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 60, gap: 12 },
  errorText: { fontFamily: "Cairo_500Medium", fontSize: 16 },
});
