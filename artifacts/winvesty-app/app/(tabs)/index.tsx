import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
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
import { mockOpportunities } from "@/data/mockData";
import { enrichOpportunitiesWithMatch, sortOpportunities } from "@/utils/matching";
import { useColors } from "@/hooks/useColors";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { criteria } = useInvestorCriteria();
  const { unreadCount } = useNotifications();

  const enriched = enrichOpportunitiesWithMatch(mockOpportunities, criteria);
  const topOpportunities = sortOpportunities(enriched, "relevance").slice(0, 3);
  const matchCount = enriched.filter((o) => (o.matchScore ?? 0) >= 50).length;
  const isAdmin = user?.role === "admin";

  const STATS = [
    { label: "Dossiers actifs", value: String(mockOpportunities.length) },
    { label: "Correspondances", value: String(matchCount) },
    { label: "Non lues", value: String(unreadCount) },
  ];

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 100, paddingTop: Platform.OS === "web" ? 67 : 0 },
      ]}
      showsVerticalScrollIndicator={false}
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
              {user?.role === "startup"
                ? "Espace Startup"
                : user?.role === "investor_validated"
                ? "Investisseur Validé"
                : user?.role === "investor_pending"
                ? "Validation en cours"
                : "Administrateur"}
            </Text>
          </View>
          {matchCount > 0 && (
            <View style={[styles.roleTag, { backgroundColor: `${colors.gold}30`, borderWidth: 1, borderColor: `${colors.gold}50` }]}>
              <Feather name="zap" size={11} color={colors.gold} />
              <Text style={[styles.roleTagText, { color: colors.gold }]}>{matchCount} match{matchCount > 1 ? "es" : ""}</Text>
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

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
            <Text style={[styles.actionSub, { color: colors.mutedForeground }]}>{mockOpportunities.length} opportunités</Text>
          </Pressable>

          {user?.role === "startup" ? (
            <Pressable
              onPress={() => router.push("/(tabs)/submit")}
              style={({ pressed }) => [
                styles.actionCard,
                { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${colors.accent}15` }]}>
                <Feather name="upload" size={22} color={colors.accent} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.foreground }]}>Mon Dossier</Text>
              <Text style={[styles.actionSub, { color: colors.mutedForeground }]}>Déposer / suivre</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.push("/(tabs)/notifications")}
              style={({ pressed }) => [
                styles.actionCard,
                {
                  backgroundColor: unreadCount > 0 ? `${colors.gold}08` : colors.card,
                  borderColor: unreadCount > 0 ? `${colors.gold}30` : colors.border,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${colors.gold}20` }]}>
                <Feather name="bell" size={22} color={colors.gold} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.foreground }]}>Notifications</Text>
              <Text style={[styles.actionSub, { color: unreadCount > 0 ? colors.gold : colors.mutedForeground }]}>
                {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "Aucune nouvelle"}
              </Text>
            </Pressable>
          )}
        </View>

        {isAdmin && (
          <Pressable
            onPress={() => router.push("/admin")}
            style={({ pressed }) => [
              styles.adminCard,
              { backgroundColor: `${colors.primary}10`, borderColor: `${colors.primary}25`, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Feather name="shield" size={18} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.actionLabel, { color: colors.foreground }]}>Back-office Winvesty</Text>
              <Text style={[styles.actionSub, { color: colors.mutedForeground }]}>Publier dans la Deal Room · Gérer les opportunités</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            {matchCount > 0 ? "Opportunités recommandées" : "Opportunités récentes"}
          </Text>
          <Pressable onPress={() => router.push("/(tabs)/dealroom")}>
            <Text style={[styles.seeAll, { color: colors.accent }]}>Voir tout</Text>
          </Pressable>
        </View>

        {topOpportunities.map((opp) => (
          <OpportunityCard key={opp.id} opportunity={opp} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 24 },
  heroCard: { borderRadius: 20, padding: 22, gap: 14 },
  heroTop: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  heroGreeting: { fontSize: 14, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.6)" },
  heroName: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  iconBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  roleRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  roleTag: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  roleTagText: { fontSize: 12, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.9)", letterSpacing: 0.3 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", paddingTop: 8, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.12)" },
  statItem: { alignItems: "center", gap: 4, flex: 1 },
  statValue: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.55)", textAlign: "center" },
  section: { gap: 12 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  seeAll: { fontSize: 13, fontFamily: "Inter_500Medium" },
  actionGrid: { flexDirection: "row", gap: 10 },
  actionCard: { flex: 1, borderRadius: 16, borderWidth: 1, padding: 16, gap: 8 },
  actionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  actionLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  actionSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  adminCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
});
