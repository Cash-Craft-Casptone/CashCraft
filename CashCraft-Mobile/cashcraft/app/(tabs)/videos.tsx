import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Platform, ActivityIndicator, Linking } from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

import { useColors } from "@/hooks/useColors";
import { useSettings } from "@/contexts/SettingsContext";
import { apiGetVideos, Video } from "@/lib/api";

export default function VideosScreen() {
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

  const { data: videos = [], isLoading, error } = useQuery({
    queryKey: ["videos"],
    queryFn: apiGetVideos,
  });

  const getTitle = (v: Video) => language === "ar" ? (v.titleAr || v.titleEn) : v.titleEn
  const getDesc = (v: Video) => language === "ar" ? (v.descriptionAr || v.descriptionEn || "") : (v.descriptionEn || "")
  const formatDuration = (sec?: number) => {
    if (!sec) return ""
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`
  }

  const filteredVideos = useMemo(() => {
    return videos.filter(v => {
      const title = getTitle(v)
      const desc = getDesc(v)
      return title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
             desc?.toLowerCase().includes(searchQuery.toLowerCase())
    });
  }, [videos, searchQuery, language]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topInset, paddingBottom: bottomInset }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground, textAlign, writingDirection }]}>{t("videos.title")}</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <Feather name="search" size={20} color={colors.mutedForeground} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground, textAlign, writingDirection }]}
            placeholder={t("videos.searchPlaceholder")}
            placeholderTextColor={colors.mutedForeground}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>
      ) : error ? (
        <View style={styles.center}>
          <Feather name="wifi-off" size={40} color={colors.mutedForeground} />
          <Text style={[styles.errorText, { color: colors.mutedForeground }]}>Failed to load videos</Text>
        </View>
      ) : (
        <FlatList
          data={filteredVideos}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const title = getTitle(item)
            const desc = getDesc(item)
            const thumb = item.thumbnailUrl || item.coverUrl
            return (
              <Pressable
                style={({ pressed }) => [styles.card, { backgroundColor: colors.card, borderRadius: colors.radius }, pressed && { opacity: 0.7 }]}
                onPress={() => item.url && Linking.openURL(item.url)}
              >
                <View style={styles.imageContainer}>
                  {thumb ? (
                    <Image source={{ uri: thumb }} style={styles.cardImage} contentFit="cover" />
                  ) : (
                    <View style={[styles.cardImage, { backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center" }]}>
                      <Feather name="play-circle" size={48} color={colors.primary} />
                    </View>
                  )}
                  <View style={styles.playOverlay}>
                    <Feather name="play-circle" size={48} color="#fff" />
                  </View>
                  {item.durationSec && (
                    <View style={styles.durationBadge}>
                      <Text style={styles.durationText}>{formatDuration(item.durationSec)}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.cardBody}>
                  <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
                    <Text style={[styles.badgeText, { color: colors.primary }]}>Video</Text>
                  </View>
                  <Text style={[styles.cardTitle, { color: colors.foreground }]} numberOfLines={2}>{title}</Text>
                  {desc ? <Text style={[styles.cardExcerpt, { color: colors.mutedForeground }]} numberOfLines={2}>{desc}</Text> : null}
                </View>
              </Pressable>
            )
          }}
        />
      )}
    </View>
  );
}

export default function VideosScreen() {
  const colors = useColors();
  const { t, dir } = useSettings();
  const isRTL = dir === "rtl";
  const textAlign = isRTL ? "right" : "left";
  const writingDirection = isRTL ? "rtl" : "ltr";
  const labelFor = (cat: string) => (cat === "All" ? t("common.all") : cat);
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const topInset = isWeb ? 67 : insets.top;
  const bottomInset = isWeb ? 84 + 34 : 84 + insets.bottom;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = new Set(videos.map(v => v.category));
    return ["All", ...Array.from(cats)];
  }, []);

  const filteredVideos = useMemo(() => {
    return videos.filter(v => {
      const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            v.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || v.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topInset, paddingBottom: bottomInset }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground, textAlign, writingDirection }]}>{t("videos.title")}</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <Feather name="search" size={20} color={colors.mutedForeground} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground, textAlign, writingDirection }]}
            placeholder={t("videos.searchPlaceholder")}
            placeholderTextColor={colors.mutedForeground}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          keyExtractor={item => item}
          renderItem={({ item }) => {
            const isSelected = item === selectedCategory;
            return (
              <Pressable
                onPress={() => setSelectedCategory(item)}
                style={[styles.filterChip, { backgroundColor: isSelected ? colors.primary : colors.card, borderColor: isSelected ? colors.primary : colors.border }]}
              >
                <Text style={[styles.filterText, { color: isSelected ? colors.primaryForeground : colors.foreground }]}>
                  {labelFor(item)}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      <FlatList
        data={filteredVideos}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, { backgroundColor: colors.card, borderRadius: colors.radius }, pressed && { opacity: 0.7 }]}
            onPress={() => router.push(`/video/${item.id}`)}
          >
            <View style={styles.imageContainer}>
              <Image source={item.imageUrl} style={styles.cardImage} contentFit="cover" />
              <View style={styles.playOverlay}>
                <Feather name="play-circle" size={48} color="#fff" />
              </View>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{item.duration}</Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>{item.category}</Text>
              </View>
              <Text style={[styles.cardTitle, { color: colors.foreground }]} numberOfLines={2}>{item.title}</Text>
              <View style={styles.cardMeta}>
                <Feather name="user" size={14} color={colors.mutedForeground} />
                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{item.instructor}</Text>
              </View>
            </View>
          </Pressable>
        )}
      />
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
  filterContainer: { marginBottom: 16 },
  filterList: { paddingHorizontal: 24, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  filterText: { fontFamily: "Cairo_600SemiBold", fontSize: 14 },
  listContent: { paddingHorizontal: 24, paddingBottom: 24, gap: 16 },
  card: { overflow: "hidden" },
  imageContainer: { width: "100%", height: 200, position: "relative" },
  cardImage: { width: "100%", height: "100%" },
  playOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.2)", alignItems: "center", justifyContent: "center" },
  durationBadge: { position: "absolute", bottom: 12, right: 12, backgroundColor: "rgba(0,0,0,0.7)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  durationText: { color: "#fff", fontFamily: "Cairo_600SemiBold", fontSize: 12 },
  cardBody: { padding: 16 },
  badge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 12 },
  badgeText: { fontFamily: "Cairo_700Bold", fontSize: 10, textTransform: "uppercase" },
  cardTitle: { fontFamily: "Cairo_700Bold", fontSize: 18, lineHeight: 24, marginBottom: 8 },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontFamily: "Cairo_500Medium", fontSize: 13 },
});
