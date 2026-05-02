import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
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

import { useNotifications } from "@/context/NotificationsContext";
import { Opportunity, mockInvestorCriteria, mockOpportunities } from "@/data/mockData";
import { calculateMatchScore, generateMatchingNotifications } from "@/utils/matching";
import { useColors } from "@/hooks/useColors";

interface AdminOpportunity extends Opportunity {
  matchedInvestors?: number;
  notificationsCreated?: number;
  publishing?: boolean;
}

export default function AdminScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addNotification } = useNotifications();

  const [opportunities, setOpportunities] = useState<AdminOpportunity[]>(
    mockOpportunities.map((o) => ({ ...o }))
  );
  const [publishResult, setPublishResult] = useState<{ id: string; matched: number; notifs: number } | null>(null);

  const handlePublish = async (opp: AdminOpportunity) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === opp.id ? { ...o, publishing: true } : o))
    );

    await new Promise((r) => setTimeout(r, 1400));

    const matches = generateMatchingNotifications(opp, [mockInvestorCriteria]);
    const notifCount = matches.length;
    const matchedCount = matches.length;

    matches.forEach((m) => {
      const matchResult = calculateMatchScore(opp, mockInvestorCriteria);
      addNotification({
        userId: m.investorId,
        type: "new_matching_opportunity",
        title: m.isPriority ? "Nouvelle opportunité qualifiée" : "Nouvelle opportunité correspondant à vos critères",
        message: `${opp.companyName}, ${opp.operationType} ${opp.stage}, vient d'intégrer la Deal Room Winvesty et correspond à vos critères. Score de compatibilité : ${m.score}%.`,
        relatedOpportunityId: opp.id,
        isRead: false,
        priority: m.isPriority ? "high" : "normal",
      });
    });

    setOpportunities((prev) =>
      prev.map((o) =>
        o.id === opp.id
          ? {
              ...o,
              publishing: false,
              status: "published_in_dealroom",
              mandateSigned: true,
              visibleInDealRoom: true,
              matchedInvestors: matchedCount,
              notificationsCreated: notifCount,
            }
          : o
      )
    );

    setPublishResult({ id: opp.id, matched: matchedCount, notifs: notifCount });
    setTimeout(() => setPublishResult(null), 4000);
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Platform.OS === "web" ? 67 : insets.top + 12,
          paddingBottom: insets.bottom + 40,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageHeader}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <View>
          <Text style={[styles.pageTitle, { color: colors.foreground }]}>Back-office</Text>
          <Text style={[styles.pageSub, { color: colors.mutedForeground }]}>Publication Deal Room</Text>
        </View>
        <View style={[styles.adminBadge, { backgroundColor: `${colors.primary}15`, borderColor: `${colors.primary}30` }]}>
          <Feather name="shield" size={13} color={colors.primary} />
          <Text style={[styles.adminBadgeText, { color: colors.primary }]}>Admin</Text>
        </View>
      </View>

      <View style={[styles.statsRow, { backgroundColor: colors.primary, borderRadius: 16 }]}>
        {[
          { label: "Publiées", value: opportunities.filter((o) => o.visibleInDealRoom).length },
          { label: "En attente", value: opportunities.filter((o) => !o.visibleInDealRoom).length },
          { label: "Mandats", value: opportunities.filter((o) => o.mandateSigned).length },
        ].map((s) => (
          <View key={s.label} style={styles.statItem}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {publishResult && (
        <View style={[styles.publishResult, { backgroundColor: `${colors.success}12`, borderColor: `${colors.success}30` }]}>
          <Feather name="check-circle" size={18} color={colors.success} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.publishResultTitle, { color: colors.success }]}>Opportunité publiée avec succès</Text>
            <Text style={[styles.publishResultSub, { color: colors.mutedForeground }]}>
              {publishResult.matched} investisseur{publishResult.matched > 1 ? "s" : ""} correspondant · {publishResult.notifs} notification{publishResult.notifs > 1 ? "s" : ""} créée{publishResult.notifs > 1 ? "s" : ""}
            </Text>
          </View>
        </View>
      )}

      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Toutes les opportunités</Text>

      {opportunities.map((opp) => {
        const matchResult = calculateMatchScore(opp, mockInvestorCriteria);
        return (
          <View
            key={opp.id}
            style={[styles.oppCard, { backgroundColor: colors.card, borderColor: opp.visibleInDealRoom ? `${colors.success}40` : colors.border }]}
          >
            <View style={styles.oppHeader}>
              <View style={[styles.oppLogo, { backgroundColor: colors.primary }]}>
                <Text style={styles.oppLogoText}>{opp.companyName.charAt(0)}</Text>
              </View>
              <View style={styles.oppInfo}>
                <Text style={[styles.oppName, { color: colors.foreground }]}>{opp.companyName}</Text>
                <Text style={[styles.oppMeta, { color: colors.mutedForeground }]}>
                  {opp.sector} · {opp.country} · {opp.stage}
                </Text>
              </View>
              <View style={[styles.statusDot, { backgroundColor: opp.visibleInDealRoom ? colors.success : colors.warning }]} />
            </View>

            <View style={styles.oppDetails}>
              <DetailChip icon="tag" label={opp.amountSought} colors={colors} />
              <DetailChip icon="activity" label={opp.operationType} colors={colors} />
              {matchResult.isMatch && (
                <DetailChip icon="zap" label={`Match ${matchResult.score}%`} colors={colors} accent={colors.gold} />
              )}
            </View>

            {opp.matchedInvestors !== undefined && (
              <View style={[styles.matchSummary, { backgroundColor: `${colors.success}10` }]}>
                <Feather name="users" size={13} color={colors.success} />
                <Text style={[styles.matchSummaryText, { color: colors.success }]}>
                  {opp.matchedInvestors} investisseur{opp.matchedInvestors > 1 ? "s" : ""} matché{opp.matchedInvestors > 1 ? "s" : ""} · {opp.notificationsCreated} notification{(opp.notificationsCreated ?? 0) > 1 ? "s" : ""} envoyée{(opp.notificationsCreated ?? 0) > 1 ? "s" : ""}
                </Text>
              </View>
            )}

            <View style={styles.oppActions}>
              {opp.visibleInDealRoom ? (
                <View style={[styles.publishedTag, { backgroundColor: `${colors.success}12`, borderColor: `${colors.success}30` }]}>
                  <Feather name="check-circle" size={14} color={colors.success} />
                  <Text style={[styles.publishedTagText, { color: colors.success }]}>Publiée en Deal Room</Text>
                </View>
              ) : (
                <Pressable
                  onPress={() => handlePublish(opp)}
                  disabled={opp.publishing}
                  style={({ pressed }) => [
                    styles.publishBtn,
                    { backgroundColor: colors.primary, opacity: pressed || opp.publishing ? 0.8 : 1 },
                  ]}
                >
                  {opp.publishing ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Feather name="send" size={14} color="#FFFFFF" />
                      <Text style={styles.publishBtnText}>Publier dans la Deal Room</Text>
                    </>
                  )}
                </Pressable>
              )}

              {opp.visibleInDealRoom && (
                <Pressable
                  style={({ pressed }) => [
                    styles.retractBtn,
                    { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Feather name="eye-off" size={14} color={colors.mutedForeground} />
                  <Text style={[styles.retractBtnText, { color: colors.mutedForeground }]}>Retirer</Text>
                </Pressable>
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

function DetailChip({ icon, label, colors, accent }: { icon: any; label: string; colors: any; accent?: string }) {
  return (
    <View style={[detailStyles.chip, { backgroundColor: colors.secondary }]}>
      <Feather name={icon} size={11} color={accent ?? colors.mutedForeground} />
      <Text style={[detailStyles.text, { color: accent ?? colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  chip: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  text: { fontSize: 11, fontFamily: "Inter_500Medium" },
});

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16 },
  pageHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  pageTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  pageSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  adminBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, marginLeft: "auto" },
  adminBadgeText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  statsRow: { flexDirection: "row", padding: 20 },
  statItem: { flex: 1, alignItems: "center", gap: 4 },
  statValue: { fontSize: 24, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.6)" },
  publishResult: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 14, borderRadius: 12, borderWidth: 1 },
  publishResultTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  publishResultSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  oppCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  oppHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  oppLogo: { width: 42, height: 42, borderRadius: 10, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  oppLogoText: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  oppInfo: { flex: 1, gap: 2 },
  oppName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  oppMeta: { fontSize: 12, fontFamily: "Inter_400Regular" },
  statusDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  oppDetails: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  matchSummary: { flexDirection: "row", alignItems: "center", gap: 6, padding: 10, borderRadius: 10 },
  matchSummaryText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  oppActions: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  publishedTag: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  publishedTagText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  publishBtn: { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, flex: 1 },
  publishBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
  retractBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  retractBtnText: { fontSize: 13, fontFamily: "Inter_500Medium" },
});
