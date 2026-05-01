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
}

export function OpportunityCard({ opportunity, onSave }: OpportunityCardProps) {
  const colors = useColors();

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
          borderColor: colors.border,
          opacity: pressed ? 0.94 : 1,
        },
      ]}
    >
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
        <Pressable
          onPress={() => onSave?.(opportunity.id)}
          hitSlop={12}
        >
          <Feather
            name={opportunity.isSaved ? "bookmark" : "bookmark"}
            size={20}
            color={opportunity.isSaved ? colors.accent : colors.border}
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
        </View>
        <View style={styles.footerRight}>
          <Text style={[styles.amount, { color: colors.primary }]}>{opportunity.amountSought}</Text>
        </View>
      </View>

      <View style={styles.scoreRow}>
        <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>Score de préparation</Text>
        <View style={[styles.scoreBar, { backgroundColor: colors.secondary }]}>
          <View
            style={[
              styles.scoreBarFill,
              { width: `${opportunity.readinessScore}%` as any, backgroundColor: readinessColor },
            ]}
          />
        </View>
        <Text style={[styles.scoreValue, { color: readinessColor }]}>{opportunity.readinessScore}%</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  companyName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  meta: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  summary: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerLeft: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  stageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  stageText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.3,
  },
  footerRight: {},
  amount: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  scoreLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    width: 120,
  },
  scoreBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  scoreBarFill: {
    height: 4,
    borderRadius: 2,
  },
  scoreValue: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    width: 32,
    textAlign: "right",
  },
});
