import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BadgeWEP } from "@/components/BadgeWEP";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Opportunity, WEPBadge, mockOpportunities } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

const BADGE_FILTERS: { label: string; value: WEPBadge | "all" }[] = [
  { label: "Tous", value: "all" },
  { label: "Strategic", value: "WEP Strategic" },
  { label: "Premium", value: "WEP Premium" },
  { label: "Access", value: "WEP Access" },
];

export default function DealRoomScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<WEPBadge | "all">("all");
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);

  const filtered = opportunities.filter((opp) => {
    const matchesBadge = activeFilter === "all" || opp.badge === activeFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      opp.companyName.toLowerCase().includes(q) ||
      opp.sector.toLowerCase().includes(q) ||
      opp.country.toLowerCase().includes(q);
    return matchesBadge && matchesSearch;
  });

  const toggleSave = (id: string) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, isSaved: !o.isSaved } : o))
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.primary,
            paddingTop: Platform.OS === "web" ? 67 : insets.top + 12,
          },
        ]}
      >
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>DEAL ROOM</Text>
          <View style={[styles.liveDot, { backgroundColor: "#4CAF50" }]} />
          <Text style={styles.liveText}>Live</Text>
        </View>
        <Text style={styles.headerSub}>{filtered.length} opportunité{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}</Text>

        <View style={[styles.searchBar, { backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.15)" }]}>
          <Feather name="search" size={16} color="rgba(255,255,255,0.5)" />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Société, secteur, pays..."
            placeholderTextColor="rgba(255,255,255,0.4)"
          />
          {!!search && (
            <Pressable onPress={() => setSearch("")} hitSlop={8}>
              <Feather name="x" size={14} color="rgba(255,255,255,0.5)" />
            </Pressable>
          )}
        </View>

        <View style={styles.filters}>
          {BADGE_FILTERS.map((f) => (
            <Pressable
              key={f.value}
              onPress={() => setActiveFilter(f.value)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: activeFilter === f.value ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)",
                  borderColor: activeFilter === f.value ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.12)",
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: activeFilter === f.value ? "#FFFFFF" : "rgba(255,255,255,0.6)" },
                ]}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OpportunityCard opportunity={item} onSave={toggleSave} />
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 100) },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!filtered.length}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="inbox" size={40} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Aucune opportunité trouvée
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: 1.5,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#4CAF50",
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.55)",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#FFFFFF",
  },
  filters: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  list: { padding: 16 },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
});
