import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { BadgeWEP } from "@/components/BadgeWEP";
import { Opportunity } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSave?: (id: string) => void;
  showMatchScore?: boolean;
}

export function OpportunityCard({ opportunity, onSave, showMatchScore = true }: OpportunityCardProps) {
  const colors = useColors();
  const score = opportunity.matchScore ?? 0;
  const isMatch = score >= 50;
  const isPriority = score >= 75;

  const readinessColor =
    opportunity.readinessScore >= 85
      ? colors.success
      : opportunity.readinessScore >= 70
      ? colors.warning
      : colors.accent;

  return (
    <Pressable
      onPress={() => router.push(`/opportunity/${opportunity.id}`)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: isPriority ? `${colors.gold}80` : isMatch ? `${colors.accent}40` : colors.border,
          borderWidth: isMatch ? 1.5 : 1,
          opacity: pressed ? 0.94 : 1,
        },
      ]}
    >
      {isMatch && (
        <View
          style={[
            styles.matchBanner,
            { backgroundColor: isPriority ? `${colors.gold}18` : `${colors.accent}10` },
          ]}
        >
          <Feather
            name="zap"
            size={11}
            color={isPriority ? colors.gold : colors.accent}
          />
          <Text
            style={[
              styles.matchBannerText,
              { color: isPriority ? colors.gold : colors.accent },
            ]}
          >
            {isPriority ? `Match prioritaire · ${score}%` : `Correspond à vos critères · ${score}%`}
          </Text>
        </View>
      )}

      <View style={styles.header}>
        <View style={[styles.logoPlaceholder, { backgroundColor: colors.primary }]}>
          <Text style={styles.logoText}>{opportunity.companyName.charAt(0)}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.companyName, { color: colors.foreground }]} numberOfLines={1}>
            {opportunity.companyName}
          </Text>
          <Text style={[styles.meta, { color: colors.mutedForeground }]}>
            {opportunity.sector} · {opportunity.country}
          </Text>
        </View>
        <Pressable onPress={() => onSave?.(opportunity.id)} hitSlop={12}>
          <Feather
            name="bookmark"
            size={20}
            color={opportunity.isSaved ? colors.accent : colors.border}
            style={{ opacity: opportunity.isSaved ? 1 : 0.5 }}
          />
        </Pressable>
      </View>

      <Text style={[styles.summary, { color: colors.mutedForeground }]} numberOfLines={2}>
        {opportunity.summary}
      </Text>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <BadgeWEP badge={opportunity.badge} size="sm" />
          <View style={[styles.stageBadge, { backgroundColor: colors.secondary }]}>
            <Text style={[styles.stageText, { color: colors.navyMid }]}>{opportunity.stage}</Text>
          </View>
          <View style={[styles.stageBadge, { backgroundColor: `${colors.accent}12` }]}>
            <Text style={[styles.stageText, { color: colors.accent }]}>{opportunity.operationType}</Text>
          </View>
        </View>
        <Text style={[styles.amount, { color: colors.primary }]}>{opportunity.amountSought}</Text>
      </View>

      <View style={styles.scoreRow}>
        <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>Préparation</Text>
        <View style={[styles.scoreBar, { backgroundColor: colors.secondary }]}>
          <View
            style={[
              styles.scoreBarFill,
              { width: `${opportunity.readinessScore}%` as any, backgroundColor: readinessColor },
            ]}
          />
        </View>
        <Text style={[styles.scoreValue, { color: readinessColor }]}>{opportunity.readinessScore}%</Text>
        {opportunity.mandateSigned && (
          <View style={[styles.mandateDot, { backgroundColor: `${colors.success}20`, borderColor: `${colors.success}40` }]}>
            <Text style={[styles.mandateText, { color: colors.success }]}>Mandat</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    overflow: "hidden",
  },
  matchBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginHorizontal: -16,
    marginTop: -16,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  matchBannerText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  logoPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoText: { color: "#FFFFFF", fontSize: 20, fontFamily: "Inter_700Bold" },
  headerInfo: { flex: 1, gap: 2 },
  companyName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  meta: { fontSize: 12, fontFamily: "Inter_400Regular" },
  summary: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  footerLeft: { flexDirection: "row", gap: 5, flexWrap: "wrap", flex: 1, marginRight: 8 },
  stageBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  stageText: { fontSize: 10, fontFamily: "Inter_500Medium", letterSpacing: 0.3 },
  amount: { fontSize: 15, fontFamily: "Inter_700Bold", flexShrink: 0 },
  scoreRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  scoreLabel: { fontSize: 11, fontFamily: "Inter_400Regular", width: 72 },
  scoreBar: { flex: 1, height: 4, borderRadius: 2, overflow: "hidden" },
  scoreBarFill: { height: 4, borderRadius: 2 },
  scoreValue: { fontSize: 11, fontFamily: "Inter_600SemiBold", width: 32, textAlign: "right" },
  mandateDot: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  mandateText: { fontSize: 10, fontFamily: "Inter_500Medium" },
});
