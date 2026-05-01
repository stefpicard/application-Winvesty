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
import { mockOpportunities } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

const STATS = [
  { label: "Dossiers actifs", value: "247", icon: "folder" as const },
  { label: "Investisseurs", value: "83", icon: "users" as const },
  { label: "Levées réalisées", value: "12", icon: "check-circle" as const },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const topOpportunities = mockOpportunities.slice(0, 3);

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
          <View>
            <Text style={styles.heroGreeting}>Bonjour,</Text>
            <Text style={styles.heroName}>{user?.name ?? "Bienvenue"}</Text>
          </View>
          <Pressable
            onPress={() => router.push("/settings")}
            style={[styles.settingsBtn, { backgroundColor: "rgba(255,255,255,0.12)" }]}
          >
            <Feather name="settings" size={18} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.roleTag}>
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

        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.quickActions, { gap: 10 }]}>
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
            <Text style={[styles.actionSub, { color: colors.mutedForeground }]}>6 opportunités</Text>
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
              onPress={() => router.push("/(tabs)/profile")}
              style={({ pressed }) => [
                styles.actionCard,
                { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${colors.gold}20` }]}>
                <Feather name="user-check" size={22} color={colors.gold} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.foreground }]}>Mon Profil</Text>
              <Text style={[styles.actionSub, { color: colors.mutedForeground }]}>Critères & statut</Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.opportunitiesSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Opportunités récentes</Text>
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
  heroCard: {
    borderRadius: 20,
    padding: 22,
    gap: 16,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroGreeting: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.6)",
  },
  heroName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  roleTag: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.15)",
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
  statItem: { alignItems: "center", gap: 4 },
  statValue: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.55)",
    textAlign: "center",
  },
  quickActions: {},
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
  actionGrid: {
    flexDirection: "row",
    gap: 10,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  actionSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  opportunitiesSection: { gap: 12 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAll: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
});
