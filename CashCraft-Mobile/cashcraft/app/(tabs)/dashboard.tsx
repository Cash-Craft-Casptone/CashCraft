import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, G } from "react-native-svg";

import { useColors } from "@/hooks/useColors";
import { useSettings } from "@/contexts/SettingsContext";
import { dashboardData } from "@/data/dashboard";

function DonutChart({ data, total, centerColor, foreground, mutedForeground, currency }: {
  data: { id: string; amount: number; color: string }[];
  total: number;
  centerColor: string;
  foreground: string;
  mutedForeground: string;
  currency: string;
}) {
  const size = 180;
  const stroke = 22;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle cx={size / 2} cy={size / 2} r={radius} stroke={centerColor} strokeWidth={stroke} fill="none" opacity={0.25} />
          {data.map((seg) => {
            const length = (seg.amount / total) * circumference;
            const dasharray = `${length} ${circumference - length}`;
            const dashoffset = -offset;
            offset += length;
            return (
              <Circle key={seg.id} cx={size / 2} cy={size / 2} r={radius} stroke={seg.color} strokeWidth={stroke} fill="none" strokeDasharray={dasharray} strokeDashoffset={dashoffset} strokeLinecap="butt" />
            );
          })}
        </G>
      </Svg>
      <View style={{ position: "absolute", alignItems: "center", justifyContent: "center", top: 0, left: 0, right: 0, bottom: 0 }}>
        <Text style={{ fontFamily: "Cairo_500Medium", fontSize: 12, color: mutedForeground, textTransform: "uppercase", letterSpacing: 0.5 }}>Total</Text>
        <Text style={{ fontFamily: "Cairo_700Bold", fontSize: 22, color: foreground, marginTop: 4 }}>{currency}</Text>
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const colors = useColors();
  const { t, dir, language } = useSettings();
  const isRTL = dir === "rtl";
  const textAlign = isRTL ? "right" : "left";
  const writingDirection = isRTL ? "rtl" : "ltr";
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  const topInset = isWeb ? 67 : insets.top;
  const bottomInset = isWeb ? 84 + 34 : 84 + insets.bottom;

  const formatCurrency = (val: number) => {
    const locale = language === "ar" ? "ar-EG" : "en-US";
    return new Intl.NumberFormat(locale, { style: "currency", currency: "USD" }).format(val);
  };

  const formatCurrencyCompact = (val: number) => {
    const locale = language === "ar" ? "ar-EG" : "en-US";
    return new Intl.NumberFormat(locale, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
  };

  const totalSpending = dashboardData.spendingCategories.reduce((sum, item) => sum + item.amount, 0);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingTop: topInset, paddingBottom: bottomInset }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground, textAlign, writingDirection }]}>{t("dashboard.title")}</Text>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCardWrap}>
        <LinearGradient colors={["#0F4C5C", "#1B6F84", "#2A8DA5"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.balanceCard, { borderRadius: 22 }]}>
          <View style={[styles.balanceBlob, { top: -50, right: -30, backgroundColor: "rgba(251, 191, 36, 0.18)" }]} />
          <View style={[styles.balanceBlobSm, { bottom: -20, right: 80, backgroundColor: "rgba(255, 255, 255, 0.08)" }]} />
          <View style={[styles.balanceTopRow, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <View>
              <Text style={[styles.balanceLabel, { color: "rgba(255,255,255,0.85)", textAlign, writingDirection }]}>{t("dashboard.totalBalance")}</Text>
              <Text style={[styles.balanceAmount, { color: "#FFFFFF" }]}>{formatCurrency(dashboardData.balance.total)}</Text>
            </View>
            <View style={styles.cardChip}>
              <Feather name="credit-card" size={20} color="#FBBF24" />
            </View>
          </View>
          <View style={[styles.changePillContainer, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
            <View style={[styles.changePill, { backgroundColor: dashboardData.balance.monthlyChange >= 0 ? "rgba(16, 185, 129, 0.95)" : "rgba(239, 68, 68, 0.95)" }]}>
              <Feather name={dashboardData.balance.monthlyChange >= 0 ? "trending-up" : "trending-down"} size={14} color="#fff" />
              <Text style={styles.changePillText}>{dashboardData.balance.monthlyChange >= 0 ? "+" : ""}{formatCurrency(dashboardData.balance.monthlyChange)} ({dashboardData.balance.monthlyChangePercent}%)</Text>
            </View>
            <Text style={[styles.changeLabel, { color: "rgba(255,255,255,0.85)" }]}>{t("common.thisMonth")}</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Income / Expenses */}
      <View style={styles.row}>
        <View style={[styles.halfCard, { backgroundColor: colors.card, borderRadius: 18, borderColor: colors.border }]}>
          <View style={[styles.iconCircleSm, { backgroundColor: "#10B98120" }]}>
            <Feather name="arrow-down-left" size={20} color="#10B981" />
          </View>
          <Text style={[styles.halfCardLabel, { color: colors.mutedForeground }]}>{t("dashboard.income")}</Text>
          <Text style={[styles.halfCardAmount, { color: "#10B981" }]}>{formatCurrency(dashboardData.income)}</Text>
        </View>
        <View style={[styles.halfCard, { backgroundColor: colors.card, borderRadius: 18, borderColor: colors.border }]}>
          <View style={[styles.iconCircleSm, { backgroundColor: "#EF444420" }]}>
            <Feather name="arrow-up-right" size={20} color="#EF4444" />
          </View>
          <Text style={[styles.halfCardLabel, { color: colors.mutedForeground }]}>{t("dashboard.expenses")}</Text>
          <Text style={[styles.halfCardAmount, { color: "#EF4444" }]}>{formatCurrency(dashboardData.expenses)}</Text>
        </View>
      </View>

      {/* Savings Goals */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign, writingDirection }]}>{t("dashboard.savingsGoals")}</Text>
        <View style={[styles.goalsContainer, { backgroundColor: colors.card, borderRadius: 18, borderColor: colors.border }]}>
          {dashboardData.savingsGoals.map((goal, i) => {
            const progress = Math.min(100, Math.max(0, (goal.current / goal.target) * 100));
            const goalColors = ["#0F4C5C", "#FBBF24", "#8B5CF6"];
            const goalColor = goalColors[i % goalColors.length];
            return (
              <View key={goal.id} style={[styles.goalItem, i < dashboardData.savingsGoals.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalTitleRow}>
                    <View style={[styles.goalIconWrap, { backgroundColor: goalColor + "20" }]}>
                      <Feather name={goal.icon as keyof typeof Feather.glyphMap} size={16} color={goalColor} />
                    </View>
                    <Text style={[styles.goalName, { color: colors.foreground }]}>{goal.name}</Text>
                  </View>
                  <Text style={[styles.goalPct, { color: goalColor }]}>{Math.round(progress)}%</Text>
                </View>
                <View style={[styles.progressBarBg, { backgroundColor: colors.muted }]}>
                  <View style={[styles.progressBarFill, { backgroundColor: goalColor, width: `${progress}%` }]} />
                </View>
                <Text style={[styles.goalAmounts, { color: colors.mutedForeground }]}>
                  <Text style={{ color: colors.foreground, fontFamily: "Cairo_700Bold" }}>{formatCurrency(goal.current)}</Text> / {formatCurrency(goal.target)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Spending by Category */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground, textAlign, writingDirection }]}>{t("dashboard.spendingByCategory")}</Text>
        <View style={[styles.spendingContainer, { backgroundColor: colors.card, borderRadius: 18, borderColor: colors.border }]}>
          <View style={styles.donutWrap}>
            <DonutChart data={dashboardData.spendingCategories} total={totalSpending} centerColor={colors.muted} foreground={colors.foreground} mutedForeground={colors.mutedForeground} currency={formatCurrencyCompact(totalSpending)} />
          </View>
          <View style={styles.legendList}>
            {dashboardData.spendingCategories.map((cat) => {
              const pct = Math.round((cat.amount / totalSpending) * 100);
              return (
                <View key={cat.id} style={styles.legendRow}>
                  <View style={[styles.colorDot, { backgroundColor: cat.color }]} />
                  <Text style={[styles.legendName, { color: colors.foreground }]}>{cat.name}</Text>
                  <Text style={[styles.legendPct, { color: colors.mutedForeground }]}>{pct}%</Text>
                  <Text style={[styles.legendAmount, { color: colors.foreground }]}>{formatCurrency(cat.amount)}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: 0, paddingHorizontal: 0 }]}>{t("dashboard.recentTransactions")}</Text>
          <Pressable><Text style={[styles.seeAll, { color: colors.accent }]}>{t("common.seeAll")}</Text></Pressable>
        </View>
        <View style={[styles.txContainer, { backgroundColor: colors.card, borderRadius: 18, borderColor: colors.border }]}>
          {dashboardData.transactions.slice(0, 6).map((tx, i) => {
            const isIncome = tx.amount >= 0;
            return (
              <View key={tx.id} style={[styles.txItem, i < 5 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <View style={[styles.txIcon, { backgroundColor: isIncome ? "#10B98120" : colors.secondary }]}>
                  <Feather name={tx.icon as keyof typeof Feather.glyphMap} size={18} color={isIncome ? "#10B981" : colors.primary} />
                </View>
                <View style={styles.txBody}>
                  <Text style={[styles.txMerchant, { color: colors.foreground }]} numberOfLines={1}>{tx.merchant}</Text>
                  <Text style={[styles.txCategory, { color: colors.mutedForeground }]}>{tx.category} • {tx.date}</Text>
                </View>
                <Text style={[styles.txAmount, { color: isIncome ? "#10B981" : colors.foreground }]}>
                  {isIncome ? "+" : ""}{formatCurrency(tx.amount)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingVertical: 16 },
  title: { fontFamily: "Cairo_700Bold", fontSize: 28 },
  balanceCardWrap: { marginHorizontal: 24, marginBottom: 20 },
  balanceCard: { padding: 24, overflow: "hidden", minHeight: 180 },
  balanceBlob: { position: "absolute", width: 180, height: 180, borderRadius: 90 },
  balanceBlobSm: { position: "absolute", width: 120, height: 120, borderRadius: 60 },
  balanceTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 },
  balanceLabel: { fontFamily: "Cairo_500Medium", fontSize: 14, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  balanceAmount: { fontFamily: "Cairo_700Bold", fontSize: 34 },
  cardChip: { width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  changePillContainer: { flexDirection: "row", alignItems: "center", gap: 12 },
  changePill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  changePillText: { color: "#fff", fontFamily: "Cairo_700Bold", fontSize: 13 },
  changeLabel: { fontFamily: "Cairo_500Medium", fontSize: 13 },
  row: { flexDirection: "row", gap: 14, paddingHorizontal: 24, marginBottom: 32 },
  halfCard: { flex: 1, padding: 16, borderWidth: 1 },
  iconCircleSm: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  halfCardLabel: { fontFamily: "Cairo_500Medium", fontSize: 13, marginBottom: 4 },
  halfCardAmount: { fontFamily: "Cairo_700Bold", fontSize: 20 },
  section: { marginBottom: 32 },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, marginBottom: 16 },
  sectionTitle: { fontFamily: "Cairo_700Bold", fontSize: 20, paddingHorizontal: 24, marginBottom: 16 },
  seeAll: { fontFamily: "Cairo_600SemiBold", fontSize: 14 },
  goalsContainer: { marginHorizontal: 24, padding: 18, borderWidth: 1 },
  goalItem: { paddingVertical: 14 },
  goalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  goalTitleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  goalIconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  goalName: { fontFamily: "Cairo_700Bold", fontSize: 15 },
  goalPct: { fontFamily: "Cairo_700Bold", fontSize: 15 },
  goalAmounts: { fontFamily: "Cairo_500Medium", fontSize: 13, marginTop: 8 },
  progressBarBg: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressBarFill: { height: "100%", borderRadius: 4 },
  spendingContainer: { marginHorizontal: 24, padding: 20, borderWidth: 1 },
  donutWrap: { alignItems: "center", marginBottom: 20 },
  legendList: { gap: 12 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  colorDot: { width: 10, height: 10, borderRadius: 5 },
  legendName: { flex: 1, fontFamily: "Cairo_600SemiBold", fontSize: 14 },
  legendPct: { fontFamily: "Cairo_500Medium", fontSize: 12, width: 36, textAlign: "right" },
  legendAmount: { fontFamily: "Cairo_700Bold", fontSize: 14, minWidth: 70, textAlign: "right" },
  txContainer: { marginHorizontal: 24, paddingHorizontal: 18, borderWidth: 1 },
  txItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14, gap: 14 },
  txIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  txBody: { flex: 1 },
  txMerchant: { fontFamily: "Cairo_700Bold", fontSize: 15, marginBottom: 3 },
  txCategory: { fontFamily: "Cairo_500Medium", fontSize: 12 },
  txAmount: { fontFamily: "Cairo_700Bold", fontSize: 15 },
});
