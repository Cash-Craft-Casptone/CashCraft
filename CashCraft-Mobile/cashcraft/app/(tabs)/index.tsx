import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useSettings } from "@/contexts/SettingsContext";
import { quotes } from "@/data/quotes";
import { articles } from "@/data/articles";
import { videos } from "@/data/videos";

const TILE_PALETTE = [
  { bg: "#0F4C5C", icon: "#FBBF24", soft: "#1B5F70" },
  { bg: "#FBBF24", icon: "#0F4C5C", soft: "#FCD34D" },
  { bg: "#8B5CF6", icon: "#FFFFFF", soft: "#A78BFA" },
  { bg: "#10B981", icon: "#FFFFFF", soft: "#34D399" },
];

export default function HomeScreen() {
  const colors = useColors();
  const { t, dir } = useSettings();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const isRTL = dir === "rtl";
  const textAlign = isRTL ? "right" : "left";
  const writingDirection = isRTL ? "rtl" : "ltr";

  const topInset = isWeb ? 67 : insets.top;
  const bottomInset = isWeb ? 84 + 34 : 84 + insets.bottom;

  const featuredArticle = articles[0];
  const featuredVideo = videos[0];

  const tiles = [
    { key: "articles", label: t("tabs.articles"), icon: "book-open" as const, route: "/(tabs)/articles" as const, palette: TILE_PALETTE[0] },
    { key: "videos", label: t("tabs.videos"), icon: "play-circle" as const, route: "/(tabs)/videos" as const, palette: TILE_PALETTE[1] },
    { key: "quizzes", label: t("tabs.quizzes"), icon: "help-circle" as const, route: "/(tabs)/quizzes" as const, palette: TILE_PALETTE[2] },
    { key: "dashboard", label: t("tabs.dashboard"), icon: "bar-chart-2" as const, route: "/(tabs)/dashboard" as const, palette: TILE_PALETTE[3] },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topInset, paddingBottom: bottomInset }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground, textAlign, writingDirection }]}>{t("home.goodMorning")}</Text>
          <Text style={[styles.name, { color: colors.foreground, textAlign, writingDirection }]}>Sarah Johnson</Text>
        </View>
        <Pressable
          onPress={() => router.push("/profile")}
          style={({ pressed }) => [styles.profileBtn, pressed && { opacity: 0.7 }]}
        >
          <View style={[styles.avatarRing, { borderColor: colors.accent }]}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>SJ</Text>
            </View>
          </View>
        </Pressable>
      </View>

      {/* Hero Card */}
      <Pressable style={({ pressed }) => [styles.heroCard, pressed && { opacity: 0.95 }]}>
        <Image source={require("@/assets/images/home-hero.png")} style={styles.heroImage} contentFit="cover" />
        <LinearGradient
          colors={["rgba(15, 76, 92, 0.45)", "rgba(15, 76, 92, 0.92)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={[styles.heroBlob, { top: -40, right: -40, backgroundColor: "rgba(251, 191, 36, 0.25)" }]} />
        <View style={[styles.heroBlobSm, { bottom: 20, right: 40, backgroundColor: "rgba(96, 153, 165, 0.4)" }]} />

        <View style={styles.heroOverlay}>
          <View style={[styles.heroBadge, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <Feather name="trending-up" size={12} color="#0F4C5C" />
            <Text style={styles.heroBadgeText}>{t("home.featured")}</Text>
          </View>
          <Text style={[styles.heroTitle, { textAlign, writingDirection }]}>{t("home.heroTitle")}</Text>
          <Text style={[styles.heroSubtitle, { textAlign, writingDirection }]}>{t("home.heroSubtitle")}</Text>
        </View>
      </Pressable>

      {/* Quick Access Grid */}
      <View style={styles.grid}>
        {tiles.map((tile) => (
          <Pressable
            key={tile.key}
            style={({ pressed }) => [styles.gridItem, pressed && { transform: [{ scale: 0.97 }] }]}
            onPress={() => router.push(tile.route as any)}
          >
            <LinearGradient
              colors={[tile.palette.bg, tile.palette.soft]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.gridItemBg, { borderRadius: 18 }]}
            >
              <View style={[styles.gridBlob, { backgroundColor: "rgba(255,255,255,0.18)" }]} />
              <View style={[styles.iconContainer, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                <Feather name={tile.icon} size={24} color={tile.palette.icon} />
              </View>
              <Text style={[styles.gridText, { color: tile.palette.icon === "#0F4C5C" ? "#0F4C5C" : "#FFFFFF" }]}>{tile.label}</Text>
            </LinearGradient>
          </Pressable>
        ))}
      </View>

      {/* Quotes Carousel */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign, writingDirection }]}>{t("home.financialWisdom")}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quotesContainer}>
          {quotes.map((quote, idx) => {
            const accentColors = ["#0F4C5C", "#8B5CF6", "#FBBF24", "#10B981"];
            const accent = accentColors[idx % accentColors.length];
            return (
              <View key={quote.id} style={[styles.quoteCard, { backgroundColor: colors.card, borderRadius: 18, borderColor: colors.border }]}>
                <View style={[styles.quoteIconWrap, { backgroundColor: accent + "20" }]}>
                  <Feather name="message-square" size={18} color={accent} />
                </View>
                <Text style={[styles.quoteText, { color: colors.foreground }]} numberOfLines={3}>"{quote.text}"</Text>
                <View style={[styles.quoteDivider, { backgroundColor: accent }]} />
                <Text style={[styles.quoteAuthor, { color: colors.mutedForeground }]}>— {quote.author}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Continue Learning */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign, writingDirection }]}>{t("home.continueLearning")}</Text>

        <Pressable
          style={({ pressed }) => [styles.learningCard, { backgroundColor: colors.card, borderRadius: 18, borderColor: colors.border }, pressed && { opacity: 0.85 }]}
          onPress={() => router.push(`/article/${featuredArticle.id}`)}
        >
          <Image source={featuredArticle.imageUrl} style={styles.learningImg} contentFit="cover" />
          <View style={styles.learningContent}>
            <View style={[styles.badge, { backgroundColor: "#FBBF2425" }]}>
              <Text style={[styles.badgeText, { color: "#A06800" }]}>{featuredArticle.category}</Text>
            </View>
            <Text style={[styles.learningTitle, { color: colors.foreground }]} numberOfLines={2}>{featuredArticle.title}</Text>
            <View style={styles.learningMetaRow}>
              <Feather name="clock" size={12} color={colors.mutedForeground} />
              <Text style={[styles.learningMeta, { color: colors.mutedForeground }]}>{featuredArticle.readTime} {t("common.minRead")}</Text>
            </View>
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.learningCard, { backgroundColor: colors.card, borderRadius: 18, borderColor: colors.border }, pressed && { opacity: 0.85 }]}
          onPress={() => router.push(`/video/${featuredVideo.id}`)}
        >
          <View style={styles.learningImgContainer}>
            <Image source={featuredVideo.imageUrl} style={styles.learningImg} contentFit="cover" />
            <LinearGradient
              colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.55)"]}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.playOverlay}>
              <View style={styles.playCircle}>
                <Feather name="play" size={18} color="#0F4C5C" style={{ marginLeft: 2 }} />
              </View>
            </View>
          </View>
          <View style={styles.learningContent}>
            <View style={[styles.badge, { backgroundColor: "#8B5CF625" }]}>
              <Text style={[styles.badgeText, { color: "#6D28D9" }]}>{featuredVideo.category}</Text>
            </View>
            <Text style={[styles.learningTitle, { color: colors.foreground }]} numberOfLines={2}>{featuredVideo.title}</Text>
            <View style={styles.learningMetaRow}>
              <Feather name="play-circle" size={12} color={colors.mutedForeground} />
              <Text style={[styles.learningMeta, { color: colors.mutedForeground }]}>{featuredVideo.duration}</Text>
            </View>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingVertical: 16 },
  greeting: { fontFamily: "Cairo_400Regular", fontSize: 16 },
  name: { fontFamily: "Cairo_700Bold", fontSize: 24, lineHeight: 30 },
  profileBtn: { padding: 4 },
  avatarRing: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: "Cairo_700Bold", fontSize: 16 },
  heroCard: { marginHorizontal: 24, height: 200, borderRadius: 22, overflow: "hidden", marginBottom: 28 },
  heroImage: { ...StyleSheet.absoluteFillObject },
  heroBlob: { position: "absolute", width: 160, height: 160, borderRadius: 80 },
  heroBlobSm: { position: "absolute", width: 80, height: 80, borderRadius: 40 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, padding: 22, justifyContent: "flex-end" },
  heroBadge: { alignSelf: "flex-start", backgroundColor: "#FBBF24", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 10 },
  heroBadgeText: { fontFamily: "Cairo_700Bold", fontSize: 11, color: "#0F4C5C", textTransform: "uppercase", letterSpacing: 0.5 },
  heroTitle: { fontFamily: "Cairo_700Bold", fontSize: 26, color: "#fff", marginBottom: 6, lineHeight: 32 },
  heroSubtitle: { fontFamily: "Cairo_500Medium", fontSize: 14, color: "rgba(255,255,255,0.92)" },
  grid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20, gap: 12, marginBottom: 32 },
  gridItem: { width: "47%", height: 120 },
  gridItemBg: { flex: 1, padding: 16, justifyContent: "space-between", overflow: "hidden" },
  gridBlob: { position: "absolute", width: 100, height: 100, borderRadius: 50, top: -30, right: -30 },
  iconContainer: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  gridText: { fontFamily: "Cairo_700Bold", fontSize: 16 },
  section: { marginBottom: 32 },
  sectionTitle: { fontFamily: "Cairo_700Bold", fontSize: 20, paddingHorizontal: 24, marginBottom: 16 },
  quotesContainer: { paddingHorizontal: 24, gap: 14 },
  quoteCard: { width: 260, padding: 18, borderWidth: 1 },
  quoteIconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", marginBottom: 14 },
  quoteText: { fontFamily: "Cairo_500Medium", fontSize: 15, lineHeight: 22, marginBottom: 14 },
  quoteDivider: { width: 28, height: 3, borderRadius: 2, marginBottom: 10 },
  quoteAuthor: { fontFamily: "Cairo_600SemiBold", fontSize: 13 },
  learningCard: { flexDirection: "row", marginHorizontal: 24, marginBottom: 14, overflow: "hidden", height: 116, borderWidth: 1 },
  learningImgContainer: { width: 116, height: 116 },
  learningImg: { width: 116, height: 116 },
  playOverlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  playCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(255,255,255,0.95)", alignItems: "center", justifyContent: "center" },
  learningContent: { flex: 1, padding: 14, justifyContent: "center" },
  badge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 8 },
  badgeText: { fontFamily: "Cairo_700Bold", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.4 },
  learningTitle: { fontFamily: "Cairo_700Bold", fontSize: 15, lineHeight: 20, marginBottom: 8 },
  learningMetaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  learningMeta: { fontFamily: "Cairo_500Medium", fontSize: 12 },
});
