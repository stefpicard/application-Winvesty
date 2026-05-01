import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const INVESTOR_TYPES = ["VC", "Business Angel", "Family Office", "Corporate VC"];
const SECTORS = ["IA / Tech", "Fintech", "Santé", "Cleantech", "Immobilier", "Logistique", "B2B SaaS"];
const GEOS = ["France", "Europe", "USA", "DACH", "Benelux", "Global"];
const STAGES = ["Pre-seed", "Seed", "Série A", "Série B", "Série C+"];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const isInvestor = user?.role === "investor_validated" || user?.role === "investor_pending";
  const isPending = user?.role === "investor_pending";

  const [investorType, setInvestorType] = useState("Business Angel");
  const [selectedSectors, setSelectedSectors] = useState<string[]>(["IA / Tech", "Fintech"]);
  const [selectedGeos, setSelectedGeos] = useState<string[]>(["France", "Europe"]);
  const [selectedStages, setSelectedStages] = useState<string[]>(["Série A", "Série B"]);

  const toggleItem = (item: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/onboarding");
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Platform.OS === "web" ? 67 : insets.top + 16,
          paddingBottom: insets.bottom + 100,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.profileHero, { backgroundColor: colors.primary }]}>
        <View style={[styles.avatar, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0) ?? "U"}</Text>
        </View>
        <View style={styles.heroInfo}>
          <Text style={styles.heroName}>{user?.name}</Text>
          <Text style={styles.heroEmail}>{user?.email}</Text>
        </View>
        {isPending && (
          <View style={[styles.pendingBadge, { backgroundColor: "#F57C0020", borderColor: "#F57C0050" }]}>
            <Feather name="clock" size={12} color="#F57C00" />
            <Text style={[styles.pendingText, { color: "#F57C00" }]}>Validation en cours</Text>
          </View>
        )}
        {!isPending && isInvestor && (
          <View style={[styles.pendingBadge, { backgroundColor: "rgba(76,175,80,0.2)", borderColor: "rgba(76,175,80,0.4)" }]}>
            <Feather name="check-circle" size={12} color="#4CAF50" />
            <Text style={[styles.pendingText, { color: "#4CAF50" }]}>Investisseur validé</Text>
          </View>
        )}
      </View>

      {isInvestor && (
        <>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Type d'investisseur</Text>
            <View style={styles.chipGrid}>
              {INVESTOR_TYPES.map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setInvestorType(t)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: investorType === t ? colors.primary : colors.secondary,
                      borderColor: investorType === t ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.chipText, { color: investorType === t ? "#FFFFFF" : colors.mutedForeground }]}>
                    {t}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Ticket d'investissement</Text>
            <View style={styles.ticketRow}>
              <View style={styles.ticketItem}>
                <Text style={[styles.ticketLabel, { color: colors.mutedForeground }]}>Minimum</Text>
                <Text style={[styles.ticketValue, { color: colors.primary }]}>100 000 €</Text>
              </View>
              <View style={[styles.ticketDivider, { backgroundColor: colors.border }]} />
              <View style={styles.ticketItem}>
                <Text style={[styles.ticketLabel, { color: colors.mutedForeground }]}>Maximum</Text>
                <Text style={[styles.ticketValue, { color: colors.primary }]}>5 000 000 €</Text>
              </View>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Secteurs recherchés</Text>
            <View style={styles.chipGrid}>
              {SECTORS.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => toggleItem(s, selectedSectors, setSelectedSectors)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selectedSectors.includes(s) ? colors.accent : colors.secondary,
                      borderColor: selectedSectors.includes(s) ? colors.accent : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.chipText, { color: selectedSectors.includes(s) ? "#FFFFFF" : colors.mutedForeground }]}>
                    {s}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Zones géographiques</Text>
            <View style={styles.chipGrid}>
              {GEOS.map((g) => (
                <Pressable
                  key={g}
                  onPress={() => toggleItem(g, selectedGeos, setSelectedGeos)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selectedGeos.includes(g) ? colors.accent : colors.secondary,
                      borderColor: selectedGeos.includes(g) ? colors.accent : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.chipText, { color: selectedGeos.includes(g) ? "#FFFFFF" : colors.mutedForeground }]}>
                    {g}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Stades d'investissement</Text>
            <View style={styles.chipGrid}>
              {STAGES.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => toggleItem(s, selectedStages, setSelectedStages)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: selectedStages.includes(s) ? colors.primary : colors.secondary,
                      borderColor: selectedStages.includes(s) ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.chipText, { color: selectedStages.includes(s) ? "#FFFFFF" : colors.mutedForeground }]}>
                    {s}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </>
      )}

      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => [
          styles.logoutBtn,
          { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Feather name="log-out" size={16} color={colors.destructive} />
        <Text style={[styles.logoutText, { color: colors.destructive }]}>Se déconnecter</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16 },
  profileHero: {
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 28, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  heroInfo: { alignItems: "center", gap: 4 },
  heroName: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  heroEmail: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.6)" },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  pendingText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 14 },
  cardTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  ticketRow: { flexDirection: "row", alignItems: "center" },
  ticketItem: { flex: 1, alignItems: "center", gap: 4 },
  ticketLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  ticketValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  ticketDivider: { width: 1, height: 40, marginHorizontal: 16 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
  },
  logoutText: { fontSize: 15, fontFamily: "Inter_500Medium" },
});
