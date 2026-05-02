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
import { useWatchlist } from "@/context/WatchlistContext";
import { mockOpportunities } from "@/data/mockData";
import { calculateMatchScore } from "@/utils/matching";
import { useColors } from "@/hooks/useColors";

type DetailTab = "resume" | "market" | "traction" | "team" | "financing" | "documents" | "opinion" | "why" | "contact";

const DETAIL_TABS: { key: DetailTab; label: string }[] = [
  { key: "resume", label: "Résumé" },
  { key: "market", label: "Marché" },
  { key: "traction", label: "Traction" },
  { key: "team", label: "Équipe" },
  { key: "financing", label: "Financement" },
  { key: "documents", label: "Documents" },
  { key: "opinion", label: "Avis Winvesty" },
  { key: "why", label: "Pourquoi ce deal ?" },
  { key: "contact", label: "Mise en relation" },
];

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
  const { isSaved, save, remove } = useWatchlist();

  const opportunity = mockOpportunities.find((o) => o.id === id);
  const [activeTab, setActiveTab] = useState<DetailTab>("resume");
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
  const saved = isSaved(opportunity.id);

  const readinessColor =
    opportunity.readinessScore >= 85
      ? colors.success
      : opportunity.readinessScore >= 70
      ? colors.warning
      : colors.accent;

  const handleConnectionRequest = async () => {
    setRequesting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setRequesting(false);
    setRequested(true);
  };

  const toggleSave = () => {
    if (saved) remove(opportunity.id);
    else save(opportunity.id);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "resume":
        return (
          <View style={styles.tabContent}>
            <Text style={[styles.cardText, { color: colors.mutedForeground }]}>
              {opportunity.summary}
            </Text>
            <View style={[styles.metricsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.metricsRow}>
                <MetricItem label="Montant" value={opportunity.amountSought} color={colors.primary} colors={colors} />
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
                      suffix={opportunity.ebitda < 0 ? " (nég.)" : ""}
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
          </View>
        );

      case "market":
        return (
          <View style={styles.tabContent}>
            {opportunity.marketDescription ? (
              <Text style={[styles.cardText, { color: colors.mutedForeground }]}>
                {opportunity.marketDescription}
              </Text>
            ) : (
              <EmptySection label="Données marché non disponibles" colors={colors} />
            )}
          </View>
        );

      case "traction":
        return (
          <View style={styles.tabContent}>
            {opportunity.tractionDescription ? (
              <>
                <Text style={[styles.cardText, { color: colors.mutedForeground }]}>
                  {opportunity.tractionDescription}
                </Text>
                {(opportunity.revenue !== undefined || opportunity.growthRate !== undefined) && (
                  <View style={[styles.kpiGrid, { borderColor: colors.border }]}>
                    {opportunity.revenue !== undefined && (
                      <View style={[styles.kpiItem, { borderColor: colors.border }]}>
                        <Text style={[styles.kpiValue, { color: colors.primary }]}>
                          {formatCurrency(opportunity.revenue)}
                        </Text>
                        <Text style={[styles.kpiLabel, { color: colors.mutedForeground }]}>Chiffre d'affaires</Text>
                      </View>
                    )}
                    {opportunity.growthRate !== undefined && (
                      <View style={[styles.kpiItem, { borderColor: colors.border }]}>
                        <Text style={[styles.kpiValue, { color: colors.success }]}>
                          +{opportunity.growthRate}%
                        </Text>
                        <Text style={[styles.kpiLabel, { color: colors.mutedForeground }]}>Croissance annuelle</Text>
                      </View>
                    )}
                    {opportunity.employees !== undefined && (
                      <View style={[styles.kpiItem, { borderColor: colors.border }]}>
                        <Text style={[styles.kpiValue, { color: colors.navyMid }]}>
                          {opportunity.employees}
                        </Text>
                        <Text style={[styles.kpiLabel, { color: colors.mutedForeground }]}>Collaborateurs</Text>
                      </View>
                    )}
                  </View>
                )}
              </>
            ) : (
              <EmptySection label="Données de traction non disponibles" colors={colors} />
            )}
          </View>
        );

      case "team":
        return (
          <View style={styles.tabContent}>
            {opportunity.teamDescription ? (
              <Text style={[styles.cardText, { color: colors.mutedForeground }]}>
                {opportunity.teamDescription}
              </Text>
            ) : (
              <EmptySection label="Informations équipe non disponibles" colors={colors} />
            )}
            {opportunity.founded && (
              <View style={[styles.infoRow, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
                <Feather name="calendar" size={14} color={colors.mutedForeground} />
                <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
                  Fondée en {opportunity.founded}
                </Text>
              </View>
            )}
          </View>
        );

      case "financing":
        return (
          <View style={styles.tabContent}>
            {opportunity.financingHistory ? (
              <Text style={[styles.cardText, { color: colors.mutedForeground }]}>
                {opportunity.financingHistory}
              </Text>
            ) : (
              <EmptySection label="Historique de financement non disponible" colors={colors} />
            )}
            <View style={[styles.fundingCard, { backgroundColor: `${colors.primary}08`, borderColor: `${colors.primary}20` }]}>
              <View style={styles.fundingRow}>
                <Text style={[styles.fundingLabel, { color: colors.mutedForeground }]}>Montant recherché</Text>
                <Text style={[styles.fundingValue, { color: colors.primary }]}>{opportunity.amountSought}</Text>
              </View>
              <View style={styles.fundingRow}>
                <Text style={[styles.fundingLabel, { color: colors.mutedForeground }]}>Stade</Text>
                <Text style={[styles.fundingValue, { color: colors.foreground }]}>{opportunity.stage}</Text>
              </View>
              <View style={styles.fundingRow}>
                <Text style={[styles.fundingLabel, { color: colors.mutedForeground }]}>Type d'opération</Text>
                <Text style={[styles.fundingValue, { color: colors.foreground }]}>{opportunity.operationType}</Text>
              </View>
              <View style={[styles.fundingRow, { borderBottomWidth: 0 }]}>
                <Text style={[styles.fundingLabel, { color: colors.mutedForeground }]}>Mandat Winvesty</Text>
                <Text style={[styles.fundingValue, { color: opportunity.mandateSigned ? colors.success : colors.mutedForeground }]}>
                  {opportunity.mandateSigned ? "Signé ✓" : "Non signé"}
                </Text>
              </View>
            </View>
          </View>
        );

      case "documents":
        return (
          <View style={styles.tabContent}>
            {opportunity.documentsAvailable.length > 0 ? (
              <>
                <Text style={[styles.sectionNote, { color: colors.mutedForeground }]}>
                  Documents disponibles sur demande après mise en relation validée par Winvesty.
                </Text>
                {opportunity.documentsAvailable.map((doc) => (
                  <Pressable
                    key={doc}
                    style={({ pressed }) => [
                      styles.docItem,
                      { backgroundColor: colors.secondary, opacity: pressed ? 0.7 : 1 },
                    ]}
                  >
                    <Feather name="file-text" size={14} color={colors.accent} />
                    <Text style={[styles.docText, { color: colors.foreground }]}>{doc}</Text>
                    <Feather name="download" size={14} color={colors.mutedForeground} />
                  </Pressable>
                ))}
              </>
            ) : (
              <EmptySection label="Aucun document disponible actuellement" colors={colors} />
            )}
          </View>
        );

      case "opinion":
        return (
          <View style={styles.tabContent}>
            <View style={[styles.winvestyHeader, { backgroundColor: `${colors.primary}08` }]}>
              <Feather name="shield" size={18} color={colors.primary} />
              <Text style={[styles.winvestyTitle, { color: colors.primary }]}>Analyse Winvesty</Text>
            </View>
            <Text style={[styles.cardText, { color: colors.mutedForeground }]}>
              {opportunity.winvestyOpinion}
            </Text>
            {opportunity.winvestyStrengths && opportunity.winvestyStrengths.length > 0 && (
              <View style={[styles.listCard, { backgroundColor: `${colors.success}08`, borderColor: `${colors.success}25` }]}>
                <Text style={[styles.listCardTitle, { color: colors.success }]}>
                  Points forts
                </Text>
                {opportunity.winvestyStrengths.map((s, i) => (
                  <View key={i} style={styles.listItem}>
                    <Feather name="check-circle" size={13} color={colors.success} />
                    <Text style={[styles.listItemText, { color: colors.foreground }]}>{s}</Text>
                  </View>
                ))}
              </View>
            )}
            {opportunity.winvestyWarnings && opportunity.winvestyWarnings.length > 0 && (
              <View style={[styles.listCard, { backgroundColor: "#F57C0010", borderColor: "#F57C0030" }]}>
                <Text style={[styles.listCardTitle, { color: "#F57C00" }]}>
                  Points de vigilance
                </Text>
                {opportunity.winvestyWarnings.map((w, i) => (
                  <View key={i} style={styles.listItem}>
                    <Feather name="alert-circle" size={13} color="#F57C00" />
                    <Text style={[styles.listItemText, { color: colors.foreground }]}>{w}</Text>
                  </View>
                ))}
              </View>
            )}
            {opportunity.winvestyRecommendation && (
              <View style={[styles.recommendationCard, { backgroundColor: `${colors.primary}08`, borderColor: `${colors.primary}20` }]}>
                <Feather name="star" size={14} color={colors.gold} />
                <Text style={[styles.recommendationText, { color: colors.foreground }]}>
                  {opportunity.winvestyRecommendation}
                </Text>
              </View>
            )}
          </View>
        );

      case "why":
        return (
          <View style={styles.tabContent}>
            {matchResult.isMatch ? (
              <>
                <View
                  style={[
                    styles.whyHeader,
                    {
                      backgroundColor: matchResult.isPriority ? `${colors.gold}12` : `${colors.accent}10`,
                      borderColor: matchResult.isPriority ? `${colors.gold}30` : `${colors.accent}25`,
                    },
                  ]}
                >
                  <Feather name="zap" size={18} color={matchResult.isPriority ? colors.gold : colors.accent} />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.whyScore,
                        { color: matchResult.isPriority ? colors.gold : colors.accent },
                      ]}
                    >
                      Score de match : {matchResult.score}%
                    </Text>
                    <Text style={[styles.whyExplain, { color: colors.mutedForeground }]}>
                      Cette opportunité vous est proposée car elle correspond à vos critères sur{" "}
                      {Object.values(matchResult.breakdown).filter((v) => v > 0).length} dimension
                      {Object.values(matchResult.breakdown).filter((v) => v > 0).length > 1 ? "s" : ""}.
                    </Text>
                  </View>
                </View>

                {[
                  { label: "Secteur", value: matchResult.breakdown.sector, max: 30, icon: "tag" as const, desc: opportunity.sector },
                  { label: "Pays", value: matchResult.breakdown.country, max: 20, icon: "map-pin" as const, desc: opportunity.country },
                  { label: "Ticket", value: matchResult.breakdown.ticket, max: 20, icon: "dollar-sign" as const, desc: opportunity.amountSought },
                  { label: "Stade", value: matchResult.breakdown.stage, max: 15, icon: "trending-up" as const, desc: opportunity.stage },
                  { label: "CA", value: matchResult.breakdown.revenue, max: 10, icon: "bar-chart" as const, desc: opportunity.revenue ? formatCurrency(opportunity.revenue) : "N/A" },
                  { label: "Type d'opération", value: matchResult.breakdown.operationType, max: 15, icon: "layers" as const, desc: opportunity.operationType },
                ].map((item) => (
                  <View
                    key={item.label}
                    style={[
                      styles.dimensionCard,
                      {
                        backgroundColor: item.value > 0 ? `${colors.accent}08` : colors.card,
                        borderColor: item.value > 0 ? `${colors.accent}20` : colors.border,
                      },
                    ]}
                  >
                    <View style={styles.dimensionLeft}>
                      <View
                        style={[
                          styles.dimensionIcon,
                          { backgroundColor: item.value > 0 ? `${colors.accent}15` : colors.secondary },
                        ]}
                      >
                        <Feather
                          name={item.icon}
                          size={14}
                          color={item.value > 0 ? colors.accent : colors.mutedForeground}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.dimensionName, { color: colors.foreground }]}>
                          {item.label}
                        </Text>
                        <Text style={[styles.dimensionDesc, { color: colors.mutedForeground }]}>
                          {item.desc}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.dimensionRight}>
                      {item.value > 0 ? (
                        <Feather name="check-circle" size={16} color={colors.success} />
                      ) : (
                        <Feather name="circle" size={16} color={colors.border} />
                      )}
                      <Text
                        style={[
                          styles.dimensionScore,
                          { color: item.value > 0 ? colors.accent : colors.border },
                        ]}
                      >
                        +{item.value}
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <View style={styles.noMatchWhy}>
                <Feather name="info" size={32} color={colors.border} />
                <Text style={[styles.noMatchTitle, { color: colors.foreground }]}>
                  Pas encore de critères définis
                </Text>
                <Text style={[styles.noMatchText, { color: colors.mutedForeground }]}>
                  Définissez vos critères d'investissement dans votre profil pour voir pourquoi cette opportunité vous correspond.
                </Text>
                <Pressable
                  onPress={() => {
                    router.back();
                    router.push("/(tabs)/profile");
                  }}
                  style={[styles.criteriaBtn, { backgroundColor: colors.primary }]}
                >
                  <Text style={styles.criteriaBtnText}>Définir mes critères</Text>
                </Pressable>
              </View>
            )}
          </View>
        );

      case "contact":
        return (
          <View style={styles.tabContent}>
            <View style={[styles.contactHeader, { backgroundColor: `${colors.primary}08`, borderColor: `${colors.primary}20` }]}>
              <Feather name="send" size={18} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.contactTitle, { color: colors.foreground }]}>
                  Demande de mise en relation
                </Text>
                <Text style={[styles.contactSub, { color: colors.mutedForeground }]}>
                  Winvesty transmet votre demande et qualifie la mise en relation dans les 48h.
                </Text>
              </View>
            </View>

            <View style={[styles.processSteps, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {[
                { step: "1", label: "Vous envoyez votre demande", sub: "Winvesty la reçoit immédiatement" },
                { step: "2", label: "Winvesty qualifie", sub: "Vérification des critères dans les 48h" },
                { step: "3", label: "Mise en relation directe", sub: "Introduction officielle par Winvesty" },
              ].map((s) => (
                <View key={s.step} style={styles.processStep}>
                  <View style={[styles.processStepNum, { backgroundColor: colors.primary }]}>
                    <Text style={styles.processStepNumText}>{s.step}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.processStepLabel, { color: colors.foreground }]}>{s.label}</Text>
                    <Text style={[styles.processStepSub, { color: colors.mutedForeground }]}>{s.sub}</Text>
                  </View>
                </View>
              ))}
            </View>

            <Pressable
              onPress={handleConnectionRequest}
              disabled={requesting || requested}
              style={({ pressed }) => [
                styles.primaryBtn,
                {
                  backgroundColor: requested ? colors.success : colors.primary,
                  opacity: pressed || requesting ? 0.85 : 1,
                },
              ]}
            >
              {requesting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Feather name={requested ? "check" : "send"} size={18} color="#FFFFFF" />
                  <Text style={styles.primaryBtnText}>
                    {requested ? "Demande envoyée à Winvesty" : "Demander une mise en relation"}
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        );

      default:
        return null;
    }
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
          <Pressable onPress={toggleSave} hitSlop={12}>
            <Feather name="bookmark" size={22} color={saved ? colors.gold : "rgba(255,255,255,0.4)"} />
          </Pressable>
        </View>

        <View style={styles.heroContent}>
          <View style={[styles.logoLarge, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
            <Text style={styles.logoLargeText}>{opportunity.companyName.charAt(0)}</Text>
          </View>
          <Text style={styles.companyName}>{opportunity.companyName}</Text>
          <Text style={styles.metaText}>
            {opportunity.sector}
            {opportunity.subSector ? ` · ${opportunity.subSector}` : ""} ·{" "}
            {opportunity.city ?? opportunity.country}
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
            <View
              style={[
                styles.matchTag,
                {
                  backgroundColor: matchResult.isPriority
                    ? `${colors.gold}30`
                    : "rgba(255,255,255,0.12)",
                  borderColor: matchResult.isPriority
                    ? `${colors.gold}60`
                    : "rgba(255,255,255,0.2)",
                },
              ]}
            >
              <Feather
                name="zap"
                size={13}
                color={matchResult.isPriority ? colors.gold : "rgba(255,255,255,0.8)"}
              />
              <Text
                style={[
                  styles.matchTagText,
                  {
                    color: matchResult.isPriority
                      ? colors.gold
                      : "rgba(255,255,255,0.85)",
                  },
                ]}
              >
                {matchResult.isPriority ? "Match prioritaire" : "Correspond à vos critères"} ·{" "}
                {matchResult.score}%
              </Text>
            </View>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContent}
        >
          {DETAIL_TABS.map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.detailTab,
                {
                  backgroundColor:
                    activeTab === tab.key ? "rgba(255,255,255,0.2)" : "transparent",
                  borderBottomWidth: activeTab === tab.key ? 2 : 0,
                  borderBottomColor: activeTab === tab.key ? "#FFFFFF" : "transparent",
                },
              ]}
            >
              <Text
                style={[
                  styles.detailTabText,
                  {
                    color:
                      activeTab === tab.key ? "#FFFFFF" : "rgba(255,255,255,0.55)",
                    fontFamily: activeTab === tab.key ? "Inter_600SemiBold" : "Inter_400Regular",
                  },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 100) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </ScrollView>
    </View>
  );
}

function MetricItem({
  label,
  value,
  color,
  colors,
  suffix = "",
}: {
  label: string;
  value: string;
  color: string;
  colors: any;
  suffix?: string;
}) {
  return (
    <View style={{ flex: 1, alignItems: "center", gap: 3 }}>
      <Text
        style={{
          fontSize: 11,
          fontFamily: "Inter_400Regular",
          color: colors.mutedForeground,
          textAlign: "center",
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 16,
          fontFamily: "Inter_700Bold",
          color,
          textAlign: "center",
        }}
      >
        {value}
        {suffix}
      </Text>
    </View>
  );
}

function EmptySection({ label, colors }: { label: string; colors: any }) {
  return (
    <View style={{ alignItems: "center", paddingVertical: 24, gap: 8 }}>
      <Feather name="info" size={28} color={colors.border} />
      <Text style={{ fontSize: 13, fontFamily: "Inter_400Regular", color: colors.mutedForeground, textAlign: "center" }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFoundText: { fontSize: 16, fontFamily: "Inter_400Regular" },
  backText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  heroHeader: { paddingHorizontal: 20, paddingBottom: 0, gap: 14 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  heroContent: { alignItems: "center", gap: 8 },
  logoLarge: {
    width: 60,
    height: 60,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  logoLargeText: { fontSize: 24, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  companyName: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  metaText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
  },
  heroTags: { flexDirection: "row", gap: 6, flexWrap: "wrap", justifyContent: "center" },
  stageTag: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  stageTagText: { fontSize: 11, fontFamily: "Inter_500Medium", color: "#FFFFFF" },
  matchTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  matchTagText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  tabsScroll: { marginTop: 8 },
  tabsContent: { paddingHorizontal: 4, gap: 2 },
  detailTab: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  detailTabText: { fontSize: 12, letterSpacing: 0.2 },
  content: { padding: 16, gap: 14 },
  tabContent: { gap: 14 },
  cardText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  metricsCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  metricsRow: { flexDirection: "row", alignItems: "center" },
  metricDivider: { width: 1, height: 32, marginHorizontal: 12 },
  scoreBarWrap: { height: 6, borderRadius: 3, overflow: "hidden" },
  scoreBarFill: { height: 6, borderRadius: 3 },
  kpiGrid: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  kpiItem: {
    flex: 1,
    alignItems: "center",
    padding: 14,
    gap: 4,
    borderRightWidth: 1,
  },
  kpiValue: { fontSize: 20, fontFamily: "Inter_700Bold" },
  kpiLabel: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center" },
  sectionNote: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
    fontStyle: "italic",
  },
  docItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 10,
  },
  docText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium" },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  infoText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  fundingCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  fundingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  fundingLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  fundingValue: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  winvestyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
  },
  winvestyTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  listCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  listCardTitle: { fontSize: 13, fontFamily: "Inter_700Bold" },
  listItem: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  listItemText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  recommendationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  recommendationText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium", lineHeight: 19 },
  whyHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  whyScore: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 4 },
  whyExplain: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  dimensionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  dimensionLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  dimensionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  dimensionName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  dimensionDesc: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  dimensionRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  dimensionScore: { fontSize: 12, fontFamily: "Inter_700Bold" },
  noMatchWhy: { alignItems: "center", paddingVertical: 32, gap: 12 },
  noMatchTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  noMatchText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  criteriaBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 4 },
  criteriaBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
  contactHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  contactTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  contactSub: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  processSteps: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  processStep: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  processStepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  processStepNumText: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  processStepLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  processStepSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 52,
    borderRadius: 14,
  },
  primaryBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
});
