import { Feather } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OpportunityCard } from "@/components/OpportunityCard";
import { Opportunity, WEPBadge, mockOpportunities } from "@/data/mockData";
import { useInvestorCriteria } from "@/context/InvestorCriteriaContext";
import { SortOption, enrichOpportunitiesWithMatch, sortOpportunities } from "@/utils/matching";
import { useColors } from "@/hooks/useColors";

const SECTORS = ["Intelligence Artificielle", "Fintech", "Santé", "Cleantech", "Logistique", "Immobilier", "Commerce"];
const COUNTRIES = ["France", "Belgique", "Suisse", "Allemagne", "USA", "Autre"];
const STAGES = ["Pre-seed", "Seed", "Série A", "Série B", "M&A", "Série C+"];
const OP_TYPES = ["Levée de fonds", "M&A", "Cession", "Acquisition", "Rapprochement"];
const WEP_BADGES: WEPBadge[] = ["WEP Strategic", "WEP Premium", "WEP Access"];
const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Pertinence", value: "relevance" },
  { label: "Date", value: "date" },
  { label: "Montant", value: "amount" },
  { label: "Score WEP", value: "score" },
];

interface DealRoomFilters {
  sectors: string[];
  countries: string[];
  stages: string[];
  operationTypes: string[];
  wepBadges: WEPBadge[];
  minScore: number;
  matchOnly: boolean;
  savedOnly: boolean;
  mandateOnly: boolean;
  deckOnly: boolean;
}

const DEFAULT_FILTERS: DealRoomFilters = {
  sectors: [],
  countries: [],
  stages: [],
  operationTypes: [],
  wepBadges: [],
  minScore: 0,
  matchOnly: false,
  savedOnly: false,
  mandateOnly: false,
  deckOnly: false,
};

function activeFilterCount(filters: DealRoomFilters): number {
  return (
    filters.sectors.length +
    filters.countries.length +
    filters.stages.length +
    filters.operationTypes.length +
    filters.wepBadges.length +
    (filters.minScore > 0 ? 1 : 0) +
    (filters.matchOnly ? 1 : 0) +
    (filters.savedOnly ? 1 : 0) +
    (filters.mandateOnly ? 1 : 0) +
    (filters.deckOnly ? 1 : 0)
  );
}

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

function ChipRow({
  title,
  items,
  selected,
  onToggle,
  colors,
}: {
  title: string;
  items: string[];
  selected: string[];
  onToggle: (v: string) => void;
  colors: any;
}) {
  return (
    <View style={chipRowStyles.section}>
      <Text style={[chipRowStyles.title, { color: colors.mutedForeground }]}>{title.toUpperCase()}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={chipRowStyles.row}>
        {items.map((item) => {
          const active = selected.includes(item);
          return (
            <Pressable
              key={item}
              onPress={() => onToggle(item)}
              style={[
                chipRowStyles.chip,
                {
                  backgroundColor: active ? colors.primary : colors.secondary,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[chipRowStyles.chipText, { color: active ? "#FFFFFF" : colors.mutedForeground }]}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const chipRowStyles = StyleSheet.create({
  section: { gap: 8 },
  title: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8, paddingHorizontal: 16 },
  row: { paddingHorizontal: 16, gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
});

export default function DealRoomScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { criteria } = useInvestorCriteria();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<DealRoomFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);

  const enriched = useMemo(
    () => enrichOpportunitiesWithMatch(opportunities, criteria),
    [opportunities, criteria]
  );

  const filtered = useMemo(() => {
    let list = enriched;

    const q = search.toLowerCase();
    if (q) {
      list = list.filter(
        (o) =>
          o.companyName.toLowerCase().includes(q) ||
          o.sector.toLowerCase().includes(q) ||
          o.country.toLowerCase().includes(q) ||
          (o.subSector && o.subSector.toLowerCase().includes(q))
      );
    }
    if (filters.sectors.length) list = list.filter((o) => filters.sectors.includes(o.sector));
    if (filters.countries.length) list = list.filter((o) => filters.countries.includes(o.country));
    if (filters.stages.length) list = list.filter((o) => filters.stages.includes(o.stage));
    if (filters.operationTypes.length) list = list.filter((o) => filters.operationTypes.includes(o.operationType));
    if (filters.wepBadges.length) list = list.filter((o) => filters.wepBadges.includes(o.badge));
    if (filters.minScore > 0) list = list.filter((o) => o.readinessScore >= filters.minScore);
    if (filters.matchOnly) list = list.filter((o) => (o.matchScore ?? 0) >= 50);
    if (filters.savedOnly) list = list.filter((o) => o.isSaved);
    if (filters.mandateOnly) list = list.filter((o) => o.mandateSigned);
    if (filters.deckOnly) list = list.filter((o) => o.documentsAvailable.some((d) => d.toLowerCase().includes("deck")));

    return sortOpportunities(list, sortBy);
  }, [enriched, search, filters, sortBy]);

  const numActiveFilters = activeFilterCount(filters);

  const toggleSave = useCallback((id: string) => {
    setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, isSaved: !o.isSaved } : o)));
  }, []);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch("");
  };

  const matchCount = useMemo(() => enriched.filter((o) => (o.matchScore ?? 0) >= 50).length, [enriched]);

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
          {matchCount > 0 && (
            <View style={[styles.matchCountBadge, { backgroundColor: colors.gold }]}>
              <Text style={styles.matchCountText}>{matchCount} match</Text>
            </View>
          )}
        </View>
        <Text style={[styles.headerSub, { color: "rgba(255,255,255,0.55)" }]}>
          {filtered.length} opportunité{filtered.length > 1 ? "s" : ""}
          {numActiveFilters > 0 ? ` · ${numActiveFilters} filtre${numActiveFilters > 1 ? "s" : ""} actif${numActiveFilters > 1 ? "s" : ""}` : ""}
        </Text>

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

        <View style={styles.toolbarRow}>
          <Pressable
            onPress={() => setShowFilters(!showFilters)}
            style={[
              styles.toolbarBtn,
              {
                backgroundColor: showFilters || numActiveFilters > 0 ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.1)",
                borderColor: showFilters || numActiveFilters > 0 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)",
              },
            ]}
          >
            <Feather name="sliders" size={14} color="#FFFFFF" />
            <Text style={styles.toolbarBtnText}>Filtres</Text>
            {numActiveFilters > 0 && (
              <View style={[styles.filterBadge, { backgroundColor: colors.gold }]}>
                <Text style={styles.filterBadgeText}>{numActiveFilters}</Text>
              </View>
            )}
          </Pressable>

          <Pressable
            onPress={() => setFilters((f) => ({ ...f, matchOnly: !f.matchOnly }))}
            style={[
              styles.toolbarBtn,
              {
                backgroundColor: filters.matchOnly ? `${colors.gold}40` : "rgba(255,255,255,0.1)",
                borderColor: filters.matchOnly ? colors.gold : "rgba(255,255,255,0.15)",
              },
            ]}
          >
            <Feather name="zap" size={14} color={filters.matchOnly ? colors.gold : "#FFFFFF"} />
            <Text style={[styles.toolbarBtnText, { color: filters.matchOnly ? colors.gold : "#FFFFFF" }]}>
              Mes critères
            </Text>
          </Pressable>

          {numActiveFilters > 0 && (
            <Pressable
              onPress={resetFilters}
              style={[styles.toolbarBtn, { backgroundColor: "rgba(229,57,53,0.25)", borderColor: "rgba(229,57,53,0.4)" }]}
            >
              <Feather name="x" size={14} color="#FF7070" />
              <Text style={[styles.toolbarBtnText, { color: "#FF7070" }]}>Réinit.</Text>
            </Pressable>
          )}

          <View style={styles.spacer} />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortScroll}>
            {SORT_OPTIONS.map((s) => (
              <Pressable
                key={s.value}
                onPress={() => setSortBy(s.value)}
                style={[
                  styles.sortChip,
                  {
                    backgroundColor: sortBy === s.value ? "rgba(255,255,255,0.2)" : "transparent",
                    borderColor: sortBy === s.value ? "rgba(255,255,255,0.4)" : "transparent",
                  },
                ]}
              >
                <Text style={[styles.sortChipText, { color: sortBy === s.value ? "#FFFFFF" : "rgba(255,255,255,0.5)" }]}>
                  {s.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>

      {showFilters && (
        <ScrollView
          style={[styles.filtersPanel, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.filtersPanelContent}>
            <ChipRow title="Secteur" items={SECTORS} selected={filters.sectors} onToggle={(v) => setFilters((f) => ({ ...f, sectors: toggle(f.sectors, v) }))} colors={colors} />
            <ChipRow title="Pays" items={COUNTRIES} selected={filters.countries} onToggle={(v) => setFilters((f) => ({ ...f, countries: toggle(f.countries, v) }))} colors={colors} />
            <ChipRow title="Stade" items={STAGES} selected={filters.stages} onToggle={(v) => setFilters((f) => ({ ...f, stages: toggle(f.stages, v) }))} colors={colors} />
            <ChipRow title="Type d'opération" items={OP_TYPES} selected={filters.operationTypes} onToggle={(v) => setFilters((f) => ({ ...f, operationTypes: toggle(f.operationTypes, v) }))} colors={colors} />
            <ChipRow title="Statut WEP" items={WEP_BADGES} selected={filters.wepBadges} onToggle={(v) => setFilters((f) => ({ ...f, wepBadges: toggle(f.wepBadges, v as WEPBadge) }))} colors={colors} />

            <View style={[chipRowStyles.section, { paddingHorizontal: 16 }]}>
              <Text style={[chipRowStyles.title, { color: colors.mutedForeground, paddingHorizontal: 0 }]}>OPTIONS</Text>
              <View style={styles.togglesGrid}>
                {[
                  { key: "mandateOnly", label: "Mandat signé", icon: "shield" as const },
                  { key: "deckOnly", label: "Deck disponible", icon: "file-text" as const },
                  { key: "savedOnly", label: "Sauvegardées", icon: "bookmark" as const },
                ].map((opt) => {
                  const active = filters[opt.key as keyof DealRoomFilters] as boolean;
                  return (
                    <Pressable
                      key={opt.key}
                      onPress={() => setFilters((f) => ({ ...f, [opt.key]: !active }))}
                      style={[
                        styles.toggleChip,
                        {
                          backgroundColor: active ? colors.primary : colors.secondary,
                          borderColor: active ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Feather name={opt.icon} size={13} color={active ? "#FFFFFF" : colors.mutedForeground} />
                      <Text style={[styles.toggleChipText, { color: active ? "#FFFFFF" : colors.mutedForeground }]}>
                        {opt.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OpportunityCard opportunity={item} onSave={toggleSave} />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 100) },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="inbox" size={40} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Aucune opportunité trouvée
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Aucune opportunité ne correspond exactement à vos filtres.{"\n"}
              Vous pouvez élargir vos critères ou consulter les opportunités recommandées par Winvesty.
            </Text>
            {numActiveFilters > 0 && (
              <Pressable
                onPress={resetFilters}
                style={[styles.resetBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.resetBtnText}>Élargir les critères</Text>
              </Pressable>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12, gap: 10 },
  headerTitle: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerText: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#FFFFFF", letterSpacing: 1.5 },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  liveText: { fontSize: 12, fontFamily: "Inter_500Medium", color: "#4CAF50", letterSpacing: 0.5 },
  matchCountBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  matchCountText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", color: "#FFFFFF" },
  toolbarRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "nowrap" },
  toolbarBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    flexShrink: 0,
  },
  toolbarBtnText: { fontSize: 12, fontFamily: "Inter_500Medium", color: "#FFFFFF" },
  filterBadge: { width: 16, height: 16, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  filterBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  spacer: { flex: 1 },
  sortScroll: { flexShrink: 1 },
  sortChip: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 4,
  },
  sortChipText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  filtersPanel: { maxHeight: 320, borderBottomWidth: 1 },
  filtersPanelContent: { paddingVertical: 16, gap: 16 },
  togglesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  toggleChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  toggleChipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  list: { padding: 16 },
  empty: { alignItems: "center", paddingTop: 48, gap: 12, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  emptyText: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },
  resetBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 4 },
  resetBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
});
