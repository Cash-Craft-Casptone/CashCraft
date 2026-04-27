import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Platform, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

import { useColors } from "@/hooks/useColors";
import { useSettings } from "@/contexts/SettingsContext";
import { apiGetQuizzes, Quiz } from "@/lib/api";

export default function QuizzesScreen() {
  const colors = useColors();
  const { t, dir, language } = useSettings();
  const isRTL = dir === "rtl";
  const textAlign = isRTL ? "right" : "left";
  const writingDirection = isRTL ? "rtl" : "ltr";
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const topInset = isWeb ? 67 : insets.top;
  const bottomInset = isWeb ? 84 + 34 : 84 + insets.bottom;

  const { data: quizzes = [], isLoading, error } = useQuery({
    queryKey: ["quizzes"],
    queryFn: () => apiGetQuizzes(),
  });

  const getTitle = (q: Quiz) => language === "ar" ? (q.titleAr || q.titleEn) : q.titleEn

  const getDifficulty = (numQ: number) => {
    if (numQ >= 11) return "Advanced"
    if (numQ >= 6) return "Intermediate"
    return "Beginner"
  }

  const difficultyLabel = (d: string) => {
    if (d === "Beginner") return t("quizzes.beginner");
    if (d === "Intermediate") return t("quizzes.intermediate");
    if (d === "Advanced") return t("quizzes.advanced");
    return d;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "#10B981";
      case "Intermediate": return "#F59E0B";
      case "Advanced": return "#EF4444";
      default: return colors.primary;
    }
  };

  const getQuizIcon = (title: string): keyof typeof Feather.glyphMap => {
    const l = title.toLowerCase();
    if (l.includes("budget")) return "pie-chart";
    if (l.includes("sav")) return "shield";
    if (l.includes("invest")) return "trending-up";
    if (l.includes("debt")) return "credit-card";
    return "help-circle";
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topInset, paddingBottom: bottomInset }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground, textAlign, writingDirection }]}>{t("quizzes.title")}</Text>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
          <Feather name="wifi-off" size={40} color={colors.mutedForeground} />
          <Text style={{ color: colors.mutedForeground, fontFamily: "Cairo_500Medium" }}>Failed to load quizzes</Text>
        </View>
      ) : (
      <FlatList
        data={quizzes}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const numQ = item.questions?.length || 0
          const difficulty = getDifficulty(numQ)
          return (
          <Pressable
            style={({ pressed }) => [styles.card, { backgroundColor: colors.card, borderRadius: colors.radius }, pressed && { opacity: 0.7 }]}
            onPress={() => router.push(`/quiz/${item.id}`)}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: colors.secondary }]}>
                <Feather name={getQuizIcon(getTitle(item))} size={24} color={colors.primary} />
              </View>
              <View style={styles.headerText}>
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>{getTitle(item)}</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.metaItem}>
                <Feather name="list" size={14} color={colors.mutedForeground} />
                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{numQ} {t("common.questions")}</Text>
              </View>
              <View style={styles.metaItem}>
                <Feather name="clock" size={14} color={colors.mutedForeground} />
                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{Math.round(numQ * 1.5)} {t("common.min")}</Text>
              </View>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(difficulty) + "20" }]}>
                <Text style={[styles.difficultyText, { color: getDifficultyColor(difficulty) }]}>{difficultyLabel(difficulty)}</Text>
              </View>
            </View>
          </Pressable>
          )
        }}
      />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingVertical: 16 },
  title: { fontFamily: "Cairo_700Bold", fontSize: 28 },
  listContent: { paddingHorizontal: 24, paddingBottom: 24, gap: 16 },
  card: { padding: 20 },
  cardHeader: { flexDirection: "row", gap: 16, marginBottom: 20 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  headerText: { flex: 1 },
  cardTitle: { fontFamily: "Cairo_700Bold", fontSize: 18, marginBottom: 4 },
  cardDesc: { fontFamily: "Cairo_500Medium", fontSize: 14, lineHeight: 20 },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.05)" },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontFamily: "Cairo_600SemiBold", fontSize: 13 },
  difficultyBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  difficultyText: { fontFamily: "Cairo_700Bold", fontSize: 11, textTransform: "uppercase" },
});
