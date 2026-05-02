import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OpportunityCard } from "@/components/OpportunityCard";
import { useAuth } from "@/context/AuthContext";
import { useInvestorCriteria } from "@/context/InvestorCriteriaContext";
import { useNotifications } from "@/context/NotificationsContext";
import { useWatchlist } from "@/context/WatchlistContext";
import {
  mockOpportunities,
  mockStartupApplication,
  mockStartupScore,
} from "@/data/mockData";
import { enrichOpportunitiesWithMatch, sortOpportunities } from "@/utils/matching";
import { useColors } from "@/hooks/useColors";

const STARTUP_STEPS = [
  { key: "submitted", label: "Dossier reçu" },
  { key: "under_review", label: "Analyse en cours" },
  { key: "winvesty_feedback", label: "Retour Winvesty" },
  { key: "mandate_signed", label: "Mandat signé" },
  { key: "wep_label", label: "Label WEP" },
  { key: "published_in_dealroom", label: "Publication Deal Room" },
  { key: "in_contact", label: "Mise en relation" },
];

function getStepIndex(status: string): number {
  const idx = STARTUP_STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { criteria } = useInvestorCriteria();
  const { unreadCount } = useNotifications();
  const { watchlist } = useWatchlist();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    setRefreshing(false);
  }, []);

  const isAdmin = user?.role === "admin";
  const isStartup = user?.role === "startup";

  const enriched = enrichOpportunitiesWithMatch(mockOpportunities, criteria);
  const publicOpps = enriched.filter((o) => !o.isConfidential);
  const confidentialOpps = enriched.filter((o) => o.isConfidential);
  const topMatches = sortOpportunities(
    publicOpps.filter((o) => (o.matchScore ?? 0) >= 50),
    "relevance"
  ).slice(0, 3);
  const recentOpps = sortOpportunities(publicOpps, "date").slice(0, 2);
  const matchCount = publicOpps.filter((o) => (o.matchScore ?? 0) >= 50).length;
  const priorityCount = publicOpps.filter((o) => (o.matchScore ?? 0) >= 75).length;

  if (isStartup) {
    return (
      <StartupCockpit
        colors={colors}
        insets={insets}
        user={user}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 67 : 0 },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
        <View style={styles.heroTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroGreeting}>Bonjour,</Text>
            <Text style={styles.heroName}>{user?.name ?? "Bienvenue"}</Text>
          </View>
          <Pressable
            onPress={() => router.push("/settings")}
            style={[styles.iconBtn, { backgroundColor: "rgba(255,255,255,0.12)" }]}
          >
            <Feather name="settings" size={18} color="#FFFFFF" />
          </Pressable>
          {isAdmin && (
            <Pressable
              onPress={() => router.push("/admin")}
              style={[styles.iconBtn, { backgroundColor: "rgba(255,255,255,0.12)" }]}
            >
              <Feather name="shield" size={18} color="#FFFFFF" />
            </Pressable>
          )}
        </View>

        <View style={styles.roleRow}>
          <View style={[styles.roleTag, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
            <Text style={styles.roleTagText}>
              {user?.role === "investor_validated"
                ? "Investor Cockpit"
                : user?.role === "investor_pending"
                ? "Validation en cours"
                : "Administrateur"}
            </Text>
          </View>
          {priorityCount > 0 && (
            <View
              style={[
                styles.roleTag,
                { backgroundColor: `${colors.gold}30`, borderWidth: 1, borderColor: `${colors.gold}50` },
              ]}
            >
              <Feather name="zap" size={11} color={colors.gold} />
              <Text style={[styles.roleTagText, { color: colors.gold }]}>
                {priorityCount} match{priorityCount > 1 ? "es" : ""} prioritaire{priorityCount > 1 ? "s" : ""}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          {[
            { label: "Correspondances", value: String(matchCount) },
            { label: "Watchlist", value: String(watchlist.length) },
            { label: "Non lues", value: String(unreadCount) },
          ].map((s) => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {matchCount > 0 && (
        <Pressable
          onPress={() => router.push("/(tabs)/dealroom")}
          style={[styles.alertBanner, { backgroundColor: `${colors.gold}12`, borderColor: `${colors.gold}30` }]}
        >
          <Feather name="zap" size={16} color={colors.gold} />
          <Text style={[styles.alertText, { color: colors.foreground }]}>
            <Text style={{ fontFamily: "Inter_700Bold", color: colors.gold }}>
              {matchCount} opportunité{matchCount > 1 ? "s" : ""}
            </Text>{" "}
            correspondent à vos critères d'investissement.
          </Text>
          <Feather name="chevron-right" size={14} color={colors.gold} />
        </Pressable>
      )}

      {confidentialOpps.length > 0 && (
        <Pressable
          onPress={() => router.push("/(tabs)/dealroom")}
          style={({ pressed }) => [
            styles.confidentialBanner,
            {
              backgroundColor: `${colors.primary}08`,
              borderColor: `${colors.primary}25`,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <View style={[styles.lockIcon, { backgroundColor: `${colors.primary}15` }]}>
            <Feather name="lock" size={16} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.confidentialTitle, { color: colors.foreground }]}>
              {confidentialOpps.length} opportunité{confidentialOpps.length > 1 ? "s" : ""} confidentielle{confidentialOpps.length > 1 ? "s" : ""}
            </Text>
            <Text style={[styles.confidentialSub, { color: colors.mutedForeground }]}>
              Disponibles sur demande · Accès WEP Strategic
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        </Pressable>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Actions rapides</Text>
        <View style={styles.actionGrid}>
          <Pressable
            onPress={() => router.push("/(tabs)/dealroom")}
            style={({ pressed }) => [
              styles.actionCard,
              { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <View style={[styles.actionIcon, { backgroundColor: `${colors.primary}15` }]}>
              <Feather name="layers" size={22} color={colors.primary} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.foreground }]}>Deal Room</Text>
            <Text style={[styles.actionSub, { color: colors.mutedForeground }]}>
              {publicOpps.length} opportunités
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(tabs)/profile")}
            style={({ pressed }) => [
              styles.actionCard,
              {
                backgroundColor: watchlist.length > 0 ? `${colors.accent}08` : colors.card,
                borderColor: watchlist.length > 0 ? `${colors.accent}30` : colors.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <View style={[styles.actionIcon, { backgroundColor: `${colors.accent}15` }]}>
              <Feather name="bookmark" size={22} color={colors.accent} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.foreground }]}>Ma Watchlist</Text>
            <Text style={[styles.actionSub, { color: colors.mutedForeground }]}>
              {watchlist.length} sauvegardé{watchlist.length > 1 ? "s" : ""}
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.push("/(tabs)/notifications")}
          style={({ pressed }) => [
            styles.notifCard,
            {
              backgroundColor: unreadCount > 0 ? `${colors.gold}08` : colors.card,
              borderColor: unreadCount > 0 ? `${colors.gold}30` : colors.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <View style={[styles.actionIcon, { backgroundColor: `${colors.gold}20` }]}>
            <Feather name="bell" size={20} color={colors.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.actionLabel, { color: colors.foreground }]}>Notifications</Text>
            <Text
              style={[
                styles.actionSub,
                { color: unreadCount > 0 ? colors.gold : colors.mutedForeground },
              ]}
            >
              {unreadCount > 0
                ? `${unreadCount} nouvelle${unreadCount > 1 ? "s" : ""} notification${unreadCount > 1 ? "s" : ""}`
                : "Aucune nouvelle notification"}
            </Text>
          </View>
          {unreadCount > 0 && (
            <View style={[styles.notifBadge, { backgroundColor: colors.gold }]}>
              <Text style={styles.notifBadgeText}>{unreadCount}</Text>
            </View>
          )}
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        </Pressable>

        {isAdmin && (
          <Pressable
            onPress={() => router.push("/admin")}
            style={({ pressed }) => [
              styles.adminCard,
              {
                backgroundColor: `${colors.primary}10`,
                borderColor: `${colors.primary}25`,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Feather name="shield" size={18} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.actionLabel, { color: colors.foreground }]}>Back-office Winvesty</Text>
              <Text style={[styles.actionSub, { color: colors.mutedForeground }]}>
                Publier · Gérer · Notifier
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      {topMatches.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Feather name="zap" size={15} color={colors.gold} />
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Recommandé pour vous
              </Text>
            </View>
            <Pressable onPress={() => router.push("/(tabs)/dealroom")}>
              <Text style={[styles.seeAll, { color: colors.accent }]}>Voir tout</Text>
            </Pressable>
          </View>
          {topMatches.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </View>
      )}

      {topMatches.length === 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Nouveaux dossiers</Text>
            <Pressable onPress={() => router.push("/(tabs)/dealroom")}>
              <Text style={[styles.seeAll, { color: colors.accent }]}>Voir tout</Text>
            </Pressable>
          </View>
          {recentOpps.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </View>
      )}

      <View style={[styles.criteriaCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.criteriaHeader}>
          <Feather name="sliders" size={16} color={colors.accent} />
          <Text style={[styles.criteriaTitle, { color: colors.foreground }]}>
            Mes critères d'investissement
          </Text>
        </View>
        <View style={styles.criteriaChips}>
          {criteria.sectors.slice(0, 3).map((s) => (
            <View key={s} style={[styles.criteriaChip, { backgroundColor: `${colors.primary}10` }]}>
              <Text style={[styles.criteriaChipText, { color: colors.primary }]}>{s}</Text>
            </View>
          ))}
          {criteria.stages.slice(0, 2).map((s) => (
            <View key={s} style={[styles.criteriaChip, { backgroundColor: `${colors.accent}10` }]}>
              <Text style={[styles.criteriaChipText, { color: colors.accent }]}>{s}</Text>
            </View>
          ))}
          {criteria.sectors.length === 0 && criteria.stages.length === 0 && (
            <Text style={[styles.criteriaEmpty, { color: colors.mutedForeground }]}>
              Aucun critère défini — définissez vos préférences
            </Text>
          )}
        </View>
        <Pressable
          onPress={() => router.push("/(tabs)/profile")}
          style={({ pressed }) => [
            styles.criteriaBtn,
            { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={[styles.criteriaBtnText, { color: colors.accent }]}>Gérer mes critères</Text>
          <Feather name="arrow-right" size={14} color={colors.accent} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

function StartupCockpit({
  colors,
  insets,
  user,
  refreshing,
  onRefresh,
}: {
  colors: any;
  insets: any;
  user: any;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const app = mockStartupApplication;
  const score = mockStartupScore;
  const currentStepIdx = getStepIndex(app.status);

  const docValidated = app.documents.filter((d) => d.status === "validated").length;
  const docTotal = app.documents.length;

  const docColor = (status: string) => {
    switch (status) {
      case "validated": return "#4CAF50";
      case "to_correct": return "#F57C00";
      case "to_complete": return colors.mutedForeground;
      default: return colors.accent;
    }
  };
  const docLabel = (status: string) => {
    switch (status) {
      case "validated": return "Validé";
      case "to_correct": return "À corriger";
      case "to_complete": return "À compléter";
      default: return "Reçu";
    }
  };
  const docIcon = (status: string): any => {
    switch (status) {
      case "validated": return "check-circle";
      case "to_correct": return "alert-circle";
      case "to_complete": return "circle";
      default: return "file";
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 67 : 0 },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
        <View style={styles.heroTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroGreeting}>Bonjour,</Text>
            <Text style={styles.heroName}>{user?.name ?? "Startup"}</Text>
          </View>
          <Pressable
            onPress={() => router.push("/settings")}
            style={[styles.iconBtn, { backgroundColor: "rgba(255,255,255,0.12)" }]}
          >
            <Feather name="settings" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
        <View style={styles.roleRow}>
          <View style={[styles.roleTag, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
            <Text style={styles.roleTagText}>Startup Cockpit</Text>
          </View>
          {app.wepLabel && (
            <View
              style={[
                styles.roleTag,
                { backgroundColor: `${colors.gold}30`, borderWidth: 1, borderColor: `${colors.gold}50` },
              ]}
            >
              <Feather name="award" size={11} color={colors.gold} />
              <Text style={[styles.roleTagText, { color: colors.gold }]}>{app.wepLabel}</Text>
            </View>
          )}
        </View>
        <View style={styles.statsRow}>
          {[
            { label: "Score WEP", value: `${score.overall}/100` },
            { label: "Docs validés", value: `${docValidated}/${docTotal}` },
            { label: "Étape", value: `${Math.max(0, currentStepIdx + 1)}/${STARTUP_STEPS.length}` },
          ].map((s) => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <Feather name="activity" size={16} color={colors.accent} />
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Progression du dossier</Text>
        </View>
        <View style={styles.stepsContainer}>
          {STARTUP_STEPS.map((step, idx) => {
            const isDone = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            const isPending = idx > currentStepIdx;
            return (
              <View key={step.key} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <View
                    style={[
                      styles.stepDot,
                      {
                        backgroundColor: isDone ? "#4CAF50" : isCurrent ? colors.primary : colors.border,
                        borderWidth: isCurrent ? 2 : 0,
                        borderColor: isCurrent ? colors.primary : "transparent",
                      },
                    ]}
                  >
                    {isDone && <Feather name="check" size={10} color="#FFFFFF" />}
                    {isCurrent && <View style={[styles.stepDotInner, { backgroundColor: "#FFFFFF" }]} />}
                  </View>
                  {idx < STARTUP_STEPS.length - 1 && (
                    <View
                      style={[styles.stepLine, { backgroundColor: isDone ? "#4CAF50" : colors.border }]}
                    />
                  )}
                </View>
                <View style={[styles.stepContent, { opacity: isPending ? 0.4 : 1 }]}>
                  <Text
                    style={[
                      styles.stepLabel,
                      {
                        color: isCurrent ? colors.primary : isDone ? "#4CAF50" : colors.mutedForeground,
                        fontFamily: isCurrent ? "Inter_600SemiBold" : "Inter_400Regular",
                      },
                    ]}
                  >
                    {step.label}
                  </Text>
                  {isCurrent && (
                    <View style={[styles.currentBadge, { backgroundColor: `${colors.primary}15` }]}>
                      <Text style={[styles.currentBadgeText, { color: colors.primary }]}>En cours</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {app.winvestyFeedback && (
        <View
          style={[
            styles.card,
            { backgroundColor: `${colors.primary}08`, borderColor: `${colors.primary}25` },
          ]}
        >
          <View style={styles.cardHeader}>
            <Feather name="shield" size={16} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Message Winvesty</Text>
          </View>
          <Text style={[styles.cardText, { color: colors.mutedForeground }]}>
            {app.winvestyFeedback}
          </Text>
        </View>
      )}

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.scoreHeader}>
          <View style={styles.cardHeader}>
            <Feather name="bar-chart-2" size={16} color={colors.accent} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Score de préparation</Text>
          </View>
          <View style={styles.scoreGlobal}>
            <Text style={[styles.scoreNumber, { color: colors.primary }]}>{score.overall}</Text>
            <Text style={[styles.scoreMax, { color: colors.mutedForeground }]}>/100</Text>
          </View>
        </View>
        <View style={[styles.scoreBarWrap, { backgroundColor: colors.secondary }]}>
          <View
            style={[
              styles.scoreBarFill,
              {
                width: `${score.overall}%` as any,
                backgroundColor:
                  score.overall >= 75 ? "#4CAF50" : score.overall >= 50 ? colors.accent : "#F57C00",
              },
            ]}
          />
        </View>
        <View style={styles.dimensionsGrid}>
          {(
            [
              ["pitchClarity", "Pitch"],
              ["traction", "Traction"],
              ["businessModel", "Modèle"],
              ["deckQuality", "Deck"],
              ["financialPreparation", "Financier"],
              ["team", "Équipe"],
            ] as [keyof typeof score.dimensions, string][]
          ).map(([key, label]) => {
            const val = score.dimensions[key];
            return (
              <View key={key} style={styles.dimensionItem}>
                <Text style={[styles.dimensionLabel, { color: colors.mutedForeground }]}>{label}</Text>
                <View style={[styles.dimBar, { backgroundColor: colors.secondary }]}>
                  <View
                    style={[
                      styles.dimBarFill,
                      {
                        width: `${val}%` as any,
                        backgroundColor:
                          val >= 70 ? "#4CAF50" : val >= 50 ? colors.accent : "#F57C00",
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.dimensionVal, { color: colors.foreground }]}>{val}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <Feather name="file-text" size={16} color={colors.accent} />
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Mes documents</Text>
        </View>
        {app.documents.map((doc, idx) => (
          <View
            key={doc.id}
            style={[
              styles.docItem,
              {
                borderBottomWidth: idx < app.documents.length - 1 ? StyleSheet.hairlineWidth : 0,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <Feather name={docIcon(doc.status)} size={15} color={docColor(doc.status)} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.docName, { color: colors.foreground }]}>{doc.name}</Text>
              {doc.uploadedAt && (
                <Text style={[styles.docDate, { color: colors.mutedForeground }]}>
                  Transmis le {new Date(doc.uploadedAt).toLocaleDateString("fr-FR")}
                </Text>
              )}
            </View>
            <View style={[styles.docStatus, { backgroundColor: `${docColor(doc.status)}15` }]}>
              <Text style={[styles.docStatusText, { color: docColor(doc.status) }]}>
                {docLabel(doc.status)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View
        style={[styles.card, { backgroundColor: `${colors.gold}08`, borderColor: `${colors.gold}25` }]}
      >
        <View style={styles.cardHeader}>
          <Feather name="star" size={16} color={colors.gold} />
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Points forts</Text>
        </View>
        {score.strengths.map((s, i) => (
          <View key={i} style={styles.bulletItem}>
            <Feather name="check-circle" size={13} color="#4CAF50" />
            <Text style={[styles.bulletText, { color: colors.foreground }]}>{s}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <Feather name="alert-triangle" size={16} color="#F57C00" />
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Priorités à renforcer</Text>
        </View>
        {score.recommendations.map((r, i) => (
          <View key={i} style={styles.bulletItem}>
            <Text style={[styles.bulletNumber, { color: colors.primary }]}>{i + 1}.</Text>
            <Text style={[styles.bulletText, { color: colors.mutedForeground }]}>{r}</Text>
          </View>
        ))}
      </View>

      <Pressable
        onPress={() => router.push("/(tabs)/submit")}
        style={({ pressed }) => [
          styles.ctaBtn,
          { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Feather name="upload" size={18} color="#FFFFFF" />
        <Text style={styles.ctaBtnText}>Gérer mon dossier</Text>
        <Feather name="arrow-right" size={16} color="rgba(255,255,255,0.6)" />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16 },
  heroCard: { borderRadius: 20, padding: 22, gap: 14 },
  heroTop: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  heroGreeting: { fontSize: 14, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.6)" },
  heroName: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  iconBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  roleRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  roleTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  roleTagText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.9)",
    letterSpacing: 0.3,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.12)",
  },
  statItem: { alignItems: "center", gap: 4, flex: 1 },
  statValue: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  statLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.55)",
    textAlign: "center",
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  alertText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  confidentialBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  lockIcon: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  confidentialTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  confidentialSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  section: { gap: 10 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  seeAll: { fontSize: 13, fontFamily: "Inter_500Medium" },
  actionGrid: { flexDirection: "row", gap: 10 },
  actionCard: { flex: 1, borderRadius: 16, borderWidth: 1, padding: 16, gap: 8 },
  notifCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  actionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  actionLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  actionSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  notifBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  notifBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  adminCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  criteriaCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  criteriaHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  criteriaTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  criteriaChips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  criteriaChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  criteriaChipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  criteriaEmpty: { fontSize: 13, fontFamily: "Inter_400Regular" },
  criteriaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
  },
  criteriaBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", flex: 1 },
  cardText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  scoreHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  scoreGlobal: { flexDirection: "row", alignItems: "baseline", gap: 2 },
  scoreNumber: { fontSize: 28, fontFamily: "Inter_700Bold" },
  scoreMax: { fontSize: 14, fontFamily: "Inter_400Regular" },
  scoreBarWrap: { height: 8, borderRadius: 4, overflow: "hidden" },
  scoreBarFill: { height: 8, borderRadius: 4 },
  dimensionsGrid: { gap: 8 },
  dimensionItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  dimensionLabel: { fontSize: 11, fontFamily: "Inter_400Regular", width: 58 },
  dimBar: { flex: 1, height: 4, borderRadius: 2, overflow: "hidden" },
  dimBarFill: { height: 4, borderRadius: 2 },
  dimensionVal: { fontSize: 11, fontFamily: "Inter_600SemiBold", width: 24, textAlign: "right" },
  stepsContainer: { gap: 0 },
  stepRow: { flexDirection: "row", gap: 12 },
  stepLeft: { alignItems: "center", width: 20 },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotInner: { width: 6, height: 6, borderRadius: 3 },
  stepLine: { width: 2, flex: 1, minHeight: 16, marginVertical: 2 },
  stepContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 16,
  },
  stepLabel: { fontSize: 13, lineHeight: 18 },
  currentBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  currentBadgeText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  docItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  docName: { fontSize: 13, fontFamily: "Inter_500Medium" },
  docDate: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  docStatus: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  docStatusText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  bulletItem: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  bulletText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  bulletNumber: { fontSize: 13, fontFamily: "Inter_700Bold", minWidth: 18 },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 52,
    borderRadius: 14,
  },
  ctaBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },
});
