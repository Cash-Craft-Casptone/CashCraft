import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { videos } from "@/data/videos";

export default function VideoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const video = videos.find(v => v.id === id) || videos[0];
  const related = videos.filter(v => v.id !== video.id).slice(0, 2);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.videoPlayerArea}>
        <Image source={video.imageUrl} style={styles.videoThumb} contentFit="cover" />
        <View style={styles.playOverlay}>
          <View style={styles.playButtonBg}>
            <Feather name="play" size={32} color="#1A2A2D" style={{ marginLeft: 4 }} />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.foreground }]}>{video.title}</Text>

        <View style={styles.metaRow}>
          <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>{video.category}</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="clock" size={14} color={colors.mutedForeground} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{video.duration}</Text>
          </View>
        </View>

        <View style={[styles.instructorCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.instructorAvatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.instructorInitials, { color: colors.primaryForeground }]}>
              {video.instructor.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View style={styles.instructorInfo}>
            <Text style={[styles.instructorName, { color: colors.foreground }]}>{video.instructor}</Text>
            <Text style={[styles.instructorRole, { color: colors.mutedForeground }]}>Financial Expert</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>About this video</Text>
        <Text style={[styles.description, { color: colors.foreground }]}>{video.description}</Text>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Up next</Text>
        <View style={styles.relatedContainer}>
          {related.map(item => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [styles.relatedCard, { backgroundColor: colors.card, borderRadius: colors.radius }, pressed && { opacity: 0.7 }]}
              onPress={() => router.push(`/video/${item.id}`)}
            >
              <View style={styles.relatedImgContainer}>
                <Image source={item.imageUrl} style={styles.relatedImg} contentFit="cover" />
                <View style={styles.smallPlayOverlay}>
                  <Feather name="play-circle" size={24} color="#fff" />
                </View>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{item.duration}</Text>
                </View>
              </View>
              <View style={styles.relatedBody}>
                <Text style={[styles.relatedItemTitle, { color: colors.foreground }]} numberOfLines={2}>{item.title}</Text>
                <Text style={[styles.relatedMeta, { color: colors.mutedForeground }]}>{item.instructor}</Text>
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
  videoPlayerArea: { width: "100%", aspectRatio: 16 / 9, position: "relative", backgroundColor: "#000" },
  videoThumb: { width: "100%", height: "100%", opacity: 0.7 },
  playOverlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  playButtonBg: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  content: { padding: 24 },
  title: { fontFamily: "Cairo_700Bold", fontSize: 26, lineHeight: 34, marginBottom: 12 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 24 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontFamily: "Cairo_700Bold", fontSize: 10, textTransform: "uppercase" },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontFamily: "Cairo_600SemiBold", fontSize: 14 },
  instructorCard: { flexDirection: "row", alignItems: "center", padding: 16, borderWidth: 1, borderRadius: 16, marginBottom: 32 },
  instructorAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", marginRight: 16 },
  instructorInitials: { fontFamily: "Cairo_700Bold", fontSize: 18 },
  instructorInfo: { flex: 1 },
  instructorName: { fontFamily: "Cairo_700Bold", fontSize: 16 },
  instructorRole: { fontFamily: "Cairo_500Medium", fontSize: 14 },
  sectionTitle: { fontFamily: "Cairo_700Bold", fontSize: 20, marginBottom: 12 },
  description: { fontFamily: "Cairo_400Regular", fontSize: 15, lineHeight: 24, marginBottom: 32 },
  divider: { height: 1, width: "100%", marginBottom: 32 },
  relatedContainer: { gap: 16 },
  relatedCard: { flexDirection: "row", height: 100, overflow: "hidden" },
  relatedImgContainer: { width: 140, height: 100, position: "relative" },
  relatedImg: { width: "100%", height: "100%" },
  smallPlayOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.3)", alignItems: "center", justifyContent: "center" },
  durationBadge: { position: "absolute", bottom: 8, right: 8, backgroundColor: "rgba(0,0,0,0.7)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  durationText: { color: "#fff", fontFamily: "Cairo_600SemiBold", fontSize: 10 },
  relatedBody: { flex: 1, padding: 12, justifyContent: "center" },
  relatedItemTitle: { fontFamily: "Cairo_600SemiBold", fontSize: 14, lineHeight: 20, marginBottom: 6 },
  relatedMeta: { fontFamily: "Cairo_500Medium", fontSize: 13 },
});
