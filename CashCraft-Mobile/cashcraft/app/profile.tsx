import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, useColorScheme, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useSettings, ThemePreference } from "@/contexts/SettingsContext";
import { Language, languageMeta } from "@/i18n/translations";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const systemScheme = useColorScheme();
  const { t, language, setLanguage, themePreference, setThemePreference, dir } = useSettings();
  const isRTL = dir === "rtl";
  const textAlign = isRTL ? "right" : "left";
  const writingDirection = isRTL ? "rtl" : "ltr";
  const rowDirection = isRTL ? "row-reverse" : "row";

  const [langModal, setLangModal] = useState(false);
  const [themeModal, setThemeModal] = useState(false);

  const isDarkActive =
    themePreference === "dark" ||
    (themePreference === "system" && systemScheme === "dark");

  const onToggleDark = (next: boolean) => {
    setThemePreference(next ? "dark" : "light");
  };

  const themeLabel = (pref: ThemePreference) => {
    if (pref === "light") return t("profile.themeLight");
    if (pref === "dark") return t("profile.themeDark");
    return t("profile.themeAuto");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
          <Text style={[styles.avatarText, { color: colors.accentForeground }]}>SJ</Text>
        </View>
        <Text style={[styles.name, { color: colors.foreground }]}>Sarah Johnson</Text>
        <Text style={[styles.email, { color: colors.mutedForeground }]}>sarah.j@example.com</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.statValue, { color: colors.foreground }]}>12</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{t("profile.dayStreak")}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.statValue, { color: colors.foreground }]}>8</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{t("profile.quizzesStat")}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.statValue, { color: colors.foreground }]}>23</Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{t("profile.articlesStat")}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign, writingDirection }]}>{t("profile.settings")}</Text>
        <View style={[styles.settingsList, { backgroundColor: colors.card, borderRadius: colors.radius }]}>

          {/* Dark Mode toggle */}
          <View style={[styles.settingRow, { flexDirection: rowDirection, borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
            <View style={[styles.settingLabelRow, { flexDirection: rowDirection }]}>
              <View style={[styles.settingIcon, { backgroundColor: colors.secondary }]}>
                <Feather name="moon" size={18} color={colors.primary} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.foreground }]}>{t("profile.darkMode")}</Text>
            </View>
            <Switch
              value={isDarkActive}
              onValueChange={onToggleDark}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Theme preference */}
          <Pressable
            onPress={() => setThemeModal(true)}
            style={[styles.settingRow, { flexDirection: rowDirection, borderBottomColor: colors.border, borderBottomWidth: 1 }]}
          >
            <View style={[styles.settingLabelRow, { flexDirection: rowDirection }]}>
              <View style={[styles.settingIcon, { backgroundColor: colors.secondary }]}>
                <Feather name="sun" size={18} color={colors.primary} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.foreground }]}>Theme</Text>
            </View>
            <View style={[styles.settingValueRow, { flexDirection: rowDirection }]}>
              <Text style={[styles.settingValue, { color: colors.mutedForeground }]}>{themeLabel(themePreference)}</Text>
              <Feather name={isRTL ? "chevron-left" : "chevron-right"} size={20} color={colors.mutedForeground} />
            </View>
          </Pressable>

          {/* Language */}
          <Pressable
            onPress={() => setLangModal(true)}
            style={[styles.settingRow, { flexDirection: rowDirection, borderBottomColor: colors.border, borderBottomWidth: 1 }]}
          >
            <View style={[styles.settingLabelRow, { flexDirection: rowDirection }]}>
              <View style={[styles.settingIcon, { backgroundColor: colors.secondary }]}>
                <Feather name="globe" size={18} color={colors.primary} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.foreground }]}>{t("profile.language")}</Text>
            </View>
            <View style={[styles.settingValueRow, { flexDirection: rowDirection }]}>
              <Text style={[styles.settingValue, { color: colors.mutedForeground }]}>{languageMeta[language].nativeLabel}</Text>
              <Feather name={isRTL ? "chevron-left" : "chevron-right"} size={20} color={colors.mutedForeground} />
            </View>
          </Pressable>

          <Pressable style={[styles.settingRow, { flexDirection: rowDirection, borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
            <View style={[styles.settingLabelRow, { flexDirection: rowDirection }]}>
              <View style={[styles.settingIcon, { backgroundColor: colors.secondary }]}>
                <Feather name="bell" size={18} color={colors.primary} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.foreground }]}>{t("profile.notifications")}</Text>
            </View>
            <Feather name={isRTL ? "chevron-left" : "chevron-right"} size={20} color={colors.mutedForeground} />
          </Pressable>

          <Pressable style={[styles.settingRow, { flexDirection: rowDirection }]}>
            <View style={[styles.settingLabelRow, { flexDirection: rowDirection }]}>
              <View style={[styles.settingIcon, { backgroundColor: colors.secondary }]}>
                <Feather name="info" size={18} color={colors.primary} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.foreground }]}>{t("profile.about")}</Text>
            </View>
            <Feather name={isRTL ? "chevron-left" : "chevron-right"} size={20} color={colors.mutedForeground} />
          </Pressable>
        </View>
      </View>

      <View style={styles.logoutContainer}>
        <Pressable style={({ pressed }) => [
          styles.logoutBtn,
          { borderColor: colors.destructive, borderRadius: colors.radius },
          pressed && { opacity: 0.7 }
        ]}>
          <Text style={[styles.logoutText, { color: colors.destructive }]}>{t("profile.signOut")}</Text>
        </Pressable>
      </View>

      {/* Language picker */}
      <Modal visible={langModal} transparent animationType="fade" onRequestClose={() => setLangModal(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setLangModal(false)}>
          <Pressable style={[styles.modalCard, { backgroundColor: colors.card, borderRadius: colors.radius }]} onPress={() => {}}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>{t("profile.language")}</Text>
            {(["en", "ar"] as Language[]).map((lng) => {
              const selected = lng === language;
              return (
                <Pressable
                  key={lng}
                  onPress={() => { setLanguage(lng); setLangModal(false); }}
                  style={[styles.modalRow, { borderColor: colors.border }]}
                >
                  <Text style={[styles.modalRowText, { color: colors.foreground }]}>{languageMeta[lng].nativeLabel}</Text>
                  {selected && <Feather name="check" size={20} color={colors.primary} />}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Theme picker */}
      <Modal visible={themeModal} transparent animationType="fade" onRequestClose={() => setThemeModal(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setThemeModal(false)}>
          <Pressable style={[styles.modalCard, { backgroundColor: colors.card, borderRadius: colors.radius }]} onPress={() => {}}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Theme</Text>
            {(["system", "light", "dark"] as ThemePreference[]).map((p) => {
              const selected = p === themePreference;
              return (
                <Pressable
                  key={p}
                  onPress={() => { setThemePreference(p); setThemeModal(false); }}
                  style={[styles.modalRow, { borderColor: colors.border }]}
                >
                  <Text style={[styles.modalRowText, { color: colors.foreground }]}>{themeLabel(p)}</Text>
                  {selected && <Feather name="check" size={20} color={colors.primary} />}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: "center", paddingVertical: 32 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  avatarText: { fontFamily: "Cairo_700Bold", fontSize: 28 },
  name: { fontFamily: "Cairo_700Bold", fontSize: 24, marginBottom: 4 },
  email: { fontFamily: "Cairo_500Medium", fontSize: 16 },
  statsContainer: { flexDirection: "row", paddingHorizontal: 24, gap: 12, marginBottom: 32 },
  statCard: { flex: 1, paddingVertical: 20, alignItems: "center", justifyContent: "center" },
  statValue: { fontFamily: "Cairo_700Bold", fontSize: 24, marginBottom: 4 },
  statLabel: { fontFamily: "Cairo_600SemiBold", fontSize: 12, textTransform: "uppercase", textAlign: "center" },
  section: { paddingHorizontal: 24, marginBottom: 32 },
  sectionTitle: { fontFamily: "Cairo_700Bold", fontSize: 18, marginBottom: 16 },
  settingsList: { overflow: "hidden" },
  settingRow: { alignItems: "center", justifyContent: "space-between", padding: 16 },
  settingLabelRow: { alignItems: "center", gap: 12 },
  settingIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  settingLabel: { fontFamily: "Cairo_600SemiBold", fontSize: 16 },
  settingValueRow: { alignItems: "center", gap: 8 },
  settingValue: { fontFamily: "Cairo_500Medium", fontSize: 14 },
  logoutContainer: { paddingHorizontal: 24 },
  logoutBtn: { height: 56, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  logoutText: { fontFamily: "Cairo_700Bold", fontSize: 18 },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 24 },
  modalCard: { width: "100%", maxWidth: 360, padding: 20 },
  modalTitle: { fontFamily: "Cairo_700Bold", fontSize: 18, marginBottom: 12 },
  modalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  modalRowText: { fontFamily: "Cairo_500Medium", fontSize: 16 },
});
