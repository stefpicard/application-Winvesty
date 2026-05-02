import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BadgeWEP } from "@/components/BadgeWEP";
import { useInvestorCriteria } from "@/context/InvestorCriteriaContext";
import { mockOpportunities } from "@/data/mockData";
import { calculateMatchScore } from "@/utils/matching";
import { useColors } from "@/hooks/useColors";

function formatCurrency(val: number): string {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1).replace(".0", "")} M€`;
  if (val >= 1000) return `${Math.round(val / 1000)} K€`;
  return `${val} €`;
}

export default function OpportunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { criteria } = useInvestorCriteria();

  const opportunity = mockOpportunities.find((o) => o.id === id);
  const [isSaved, setIsSaved] = useState(opportunity?.isSaved ?? false);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  if (!opportunity) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>Introuvable</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backText, { color: colors.accent }]}>Retour</Text>
        </Pressable>
      </View>
    );
  }

  const matchResult = calculateMatchScore(opportunity, criteria);
  const readinessColor =
    opportunity.readinessScore >= 85 ? colors.success
    : opportunity.readinessScore >= 70 ? colors.warning
    : colors.accent;

  const handleConnectionRequest = async () => {
    setRequesting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setRequesting(false);
    setRequested(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.heroHeader,
          {
            backgroundColor: colors.primary,
            paddingTop: Platform.OS === "web" ? 67 : insets.top + 12,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </Pressable>
          <Pressable onPress={() => setIsSaved(!isSaved)} hitSlop={12}>
            <Feather name="bookmark" size={22} color={isSaved ? colors.gold : "rgba(255,255,255,0.4)"} />
          </Pressable>
        </View>

        <View style={styles.heroContent}>
          <View style={[styles.logoLarge, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
            <Text style={styles.logoLargeText}>{opportunity.companyName.charAt(0)}</Text>
          </View>
          <Text style={styles.companyName}>{opportunity.companyName}</Text>
          <Text style={styles.metaText}>
            {opportunity.sector}{opportunity.subSector ? ` · ${opportunity.subSector}` : ""} · {opportunity.city ?? opportunity.country}
          </Text>
          <View style={styles.heroTags}>
            <BadgeWEP badge={opportunity.badge} />
            <View style={[styles.stageTag, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
              <Text style={styles.stageTagText}>{opportunity.stage}</Text>
            </View>
            <View style={[styles.stageTag, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
              <Text style={styles.stageTagText}>{opportunity.operationType}</Text>
            </View>
          </View>
          {matchResult.isMatch && (
            <View style={[styles.matchTag, { backgroundColor: matchResult.isPriority ? `${colors.gold}30` : "rgba(255,255,255,0.12)", borderColor: matchResult.isPriority ? `${colors.gold}60` : "rgba(255,255,255,0.2)" }]}>
              <Feather name="zap" size={13} color={matchResult.isPriority ? colors.gold : "rgba(255,255,255,0.8)"} />
              <Text style={[styles.matchTagText, { color: matchResult.isPriority ? colors.gold : "rgba(255,255,255,0.85)" }]}>
                {matchResult.isPriority ? "Match prioritaire" : "Correspond à vos critères"} · {matchResult.score}%
              </Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 100) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.metricsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.metricsRow}>
            <MetricItem label="Montant recherché" value={opportunity.amountSought} color={colors.primary} colors={colors} />
            <View style={[styles.metricDivider, { backgroundColor: colors.border }]} />
            <MetricItem label="Score WEP" value={`${opportunity.readinessScore}%`} color={readinessColor} colors={colors} />
            {opportunity.revenue !== undefined && (
              <>
                <View style={[styles.metricDivider, { backgroundColor: colors.border }]} />
                <MetricItem label="CA" value={formatCurrency(opportunity.revenue)} color={colors.navyMid} colors={colors} />
              </>
            )}
          </View>

          {(opportunity.ebitda !== undefined || opportunity.growthRate !== undefined) && (
            <View style={[styles.metricsRow, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 }]}>
              {opportunity.ebitda !== undefined && (
                <MetricItem
                  label="EBITDA"
                  value={formatCurrency(Math.abs(opportunity.ebitda))}
                  color={opportunity.ebitda >= 0 ? colors.success : colors.warning}
                  colors={colors}
                  suffix={opportunity.ebitda < 0 ? " (négatif)" : ""}
                />
              )}
              {opportunity.ebitda !== undefined && opportunity.growthRate !== undefined && (
                <View style={[styles.metricDivider, { backgroundColor: colors.border }]} />
              )}
              {opportunity.growthRate !== undefined && (
                <MetricItem label="Croissance" value={`+${opportunity.growthRate}%`} color={colors.success} colors={colors} />
              )}
              {opportunity.mandateSigned && (
                <>
                  <View style={[styles.metricDivider, { backgroundColor: colors.border }]} />
                  <MetricItem label="Mandat" value="Signé" color={colors.success} colors={colors} />
                </>
              )}
            </View>
          )}

          <View style={[styles.scoreBarWrap, { backgroundColor: colors.secondary }]}>
            <View style={[styles.scoreBarFill, { width: `${opportunity.readinessScore}%` as any, backgroundColor: readinessColor }]} />
          </View>
        </View>

        {matchResult.isMatch && (
          <View style={[styles.matchCard, { backgroundColor: matchResult.isPriority ? `${colors.gold}10` : `${colors.accent}08`, borderColor: matchResult.isPriority ? `${colors.gold}30` : `${colors.accent}25` }]}>
            <View style={styles.matchCardHeader}>
              <Feather name="zap" size={15} color={matchResult.isPriority ? colors.gold : colors.accent} />
              <Text style={[styles.matchCardTitle, { color: matchResult.isPriority ? colors.gold : colors.accent }]}>
                Analyse de compatibilité · {matchResult.score}%
              </Text>
            </View>
            <View style={styles.breakdownGrid}>
              {[
                { label: "Secteur", value: matchResult.breakdown.sector, max: 30 },
                { label: "Pays", value: matchResult.breakdown.country, max: 20 },
                { label: "Ticket", value: matchResult.breakdown.ticket, max: 20 },
                { label: "Stade", value: matchResult.breakdown.stage, max: 15 },
                { label: "CA", value: matchResult.breakdown.revenue, max: 10 },
                { label: "Op.", value: matchResult.breakdown.operationType, max: 15 },
              ].map((item) => (
                <View key={item.label} style={styles.breakdownItem}>
                  <Text style={[styles.breakdownLabel, { color: colors.mutedForeground }]}>{item.label}</Text>
                  <View style={[styles.breakdownBar, { backgroundColor: colors.secondary }]}>
                    <View style={[styles.breakdownFill, { width: `${(item.value / item.max) * 100}%` as any, backgroundColor: item.value > 0 ? (matchResult.isPriority ? colors.gold : colors.accent) : colors.border }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Résumé</Text>
          <Text style={[styles.cardText, { color: colors.mutedForeground }]}>{opportunity.summary}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.winvestyTitleRow}>
            <Feather name="shield" size={16} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Avis Winvesty</Text>
          </View>
          <Text style={[styles.cardText, { color: colors.mutedForeground }]}>{opportunity.winvestyOpinion}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Documents disponibles</Text>
          {opportunity.documentsAvailable.map((doc) => (
            <Pressable
              key={doc}
              style={({ pressed }) => [styles.docItem, { backgroundColor: colors.secondary, opacity: pressed ? 0.7 : 1 }]}
            >
              <Feather name="file-text" size={14} color={colors.accent} />
              <Text style={[styles.docText, { color: colors.foreground }]}>{doc}</Text>
              <Feather name="download" size={14} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={handleConnectionRequest}
            disabled={requesting || requested}
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: requested ? colors.success : colors.primary, opacity: pressed || requesting ? 0.85 : 1 },
            ]}
          >
            {requesting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Feather name={requested ? "check" : "send"} size={18} color="#FFFFFF" />
                <Text style={styles.primaryBtnText}>
                  {requested ? "Demande envoyée" : "Demander une mise en relation"}
                </Text>
              </>
            )}
          </Pressable>
          <Pressable
            onPress={() => setIsSaved(!isSaved)}
            style={({ pressed }) => [
              styles.secondaryBtn,
              { borderColor: colors.border, backgroundColor: colors.card, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Feather name="bookmark" size={18} color={isSaved ? colors.gold : colors.mutedForeground} />
            <Text style={[styles.secondaryBtnText, { color: isSaved ? colors.gold : colors.mutedForeground }]}>
              {isSaved ? "Sauvegardé" : "Sauvegarder"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function MetricItem({ label, value, color, colors, suffix = "" }: { label: string; value: string; color: string; colors: any; suffix?: string }) {
  return (
    <View style={{ flex: 1, alignItems: "center", gap: 3 }}>
      <Text style={{ fontSize: 11, fontFamily: "Inter_400Regular", color: colors.mutedForeground, textAlign: "center" }}>{label}</Text>
      <Text style={{ fontSize: 16, fontFamily: "Inter_700Bold", color, textAlign: "center" }}>{value}{suffix}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFoundText: { fontSize: 16, fontFamily: "Inter_400Regular" },
  backText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  heroHeader: { paddingHorizontal: 20, paddingBottom: 24, gap: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  heroContent: { alignItems: "center", gap: 10 },
  logoLarge: { width: 64, height: 64, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  logoLargeText: { fontSize: 26, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  companyName: { fontSize: 24, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  metaText: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.65)", textAlign: "center" },
  heroTags: { flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  stageTag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  stageTagText: { fontSize: 12, fontFamily: "Inter_500Medium", color: "#FFFFFF" },
  matchTag: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  matchTagText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  content: { padding: 16, gap: 14 },
  metricsCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  metricsRow: { flexDirection: "row", alignItems: "center" },
  metricDivider: { width: 1, height: 36, marginHorizontal: 12 },
  scoreBarWrap: { height: 6, borderRadius: 3, overflow: "hidden" },
  scoreBarFill: { height: 6, borderRadius: 3 },
  matchCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  matchCardHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  matchCardTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  breakdownGrid: { gap: 8 },
  breakdownItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  breakdownLabel: { fontSize: 11, fontFamily: "Inter_400Regular", width: 40 },
  breakdownBar: { flex: 1, height: 4, borderRadius: 2, overflow: "hidden" },
  breakdownFill: { height: 4, borderRadius: 2 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  cardTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  cardText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  winvestyTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  docItem: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 10 },
  docText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium" },
  actions: { gap: 10, marginTop: 4 },
  primaryBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, height: 52, borderRadius: 14 },
  primaryBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
  secondaryBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 46, borderRadius: 12, borderWidth: 1 },
  secondaryBtnText: { fontSize: 14, fontFamily: "Inter_500Medium" },
});
