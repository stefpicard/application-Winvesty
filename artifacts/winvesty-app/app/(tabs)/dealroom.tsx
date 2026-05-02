import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BadgeWEP } from "@/components/BadgeWEP";
import { OpportunityCard } from "@/components/OpportunityCard";
import { useInvestorCriteria } from "@/context/InvestorCriteriaContext";
import { useWatchlist } from "@/context/WatchlistContext";
import { Opportunity, WEPBadge, mockOpportunities } from "@/data/mockData";
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

type DealRoomTab = "recommended" | "all" | "confidential";

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

function ConfidentialCard({
  opportunity,
  colors,
  matchScore,
}: {
  opportunity: Opportunity;
  colors: any;
  matchScore?: number;
}) {
  const [requested, setRequested] = useState(false);

  return (
    <View
      style={[
        confStyles.card,
        { backgroundColor: colors.card, borderColor: `${colors.primary}20` },
      ]}
    >
      <View style={confStyles.lockedBanner}>
        <Feather name="lock" size={12} color={colors.primary} />
        <Text style={[confStyles.lockedText, { color: colors.primary }]}>
          CONFIDENTIEL — Accès sur demande
        </Text>
      </View>

      <View style={confStyles.cardBody}>
        <View style={[confStyles.blurredLogo, { backgroundColor: `${colors.primary}20` }]}>
          <Feather name="eye-off" size={20} color={colors.primary} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[confStyles.sector, { color: colors.foreground }]}>
            {opportunity.sector}
            {opportunity.subSector ? ` · ${opportunity.subSector}` : ""}
          </Text>
          <Text style={[confStyles.meta, { color: colors.mutedForeground }]}>
            {opportunity.country} · {opportunity.stage} · {opportunity.operationType}
          </Text>
          <Text style={[confStyles.amount, { color: colors.primary }]}>
            {opportunity.amountSought}
          </Text>
        </View>
        <BadgeWEP badge={opportunity.badge} />
      </View>

      <View style={confStyles.metrics}>
        <View style={[confStyles.metricChip, { backgroundColor: `${colors.primary}10` }]}>
          <Feather name="bar-chart-2" size={11} color={colors.primary} />
          <Text style={[confStyles.metricText, { color: colors.primary }]}>
            Score WEP : {opportunity.readinessScore}
          </Text>
        </View>
        {matchScore !== undefined && matchScore >= 50 && (
          <View
            style={[
              confStyles.metricChip,
              { backgroundColor: matchScore >= 75 ? `${colors.gold}18` : `${colors.accent}12` },
            ]}
          >
            <Feather name="zap" size={11} color={matchScore >= 75 ? colors.gold : colors.accent} />
            <Text
              style={[
                confStyles.metricText,
                { color: matchScore >= 75 ? colors.gold : colors.accent },
              ]}
            >
              Match {matchScore}%
            </Text>
          </View>
        )}
      </View>

      {opportunity.growthRate && (
        <Text style={[confStyles.hint, { color: colors.mutedForeground }]}>
          Croissance : +{opportunity.growthRate}% · Informations détaillées sur validation uniquement
        </Text>
      )}

      <Pressable
        onPress={() => setRequested(true)}
        disabled={requested}
        style={({ pressed }) => [
          confStyles.requestBtn,
          {
            backgroundColor: requested ? `${colors.success}15` : colors.primary,
            borderColor: requested ? colors.success : colors.primary,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Feather name={requested ? "check" : "send"} size={14} color={requested ? "#4CAF50" : "#FFFFFF"} />
        <Text style={[confStyles.requestBtnText, { color: requested ? "#4CAF50" : "#FFFFFF" }]}>
          {requested ? "Demande envoyée à Winvesty" : "Demander l'accès"}
        </Text>
      </Pressable>
    </View>
  );
}

const confStyles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, overflow: "hidden", marginBottom: 12 },
  lockedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 10,
    paddingHorizontal: 14,
    backgroundColor: "rgba(5,54,97,0.06)",
  },
  lockedText: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5 },
  cardBody: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  blurredLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sector: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  meta: { fontSize: 12, fontFamily: "Inter_400Regular" },
  amount: { fontSize: 15, fontFamily: "Inter_700Bold" },
  metrics: { flexDirection: "row", gap: 8, paddingHorizontal: 14, paddingBottom: 8 },
  metricChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  metricText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  hint: { fontSize: 11, fontFamily: "Inter_400Regular", paddingHorizontal: 14, paddingBottom: 10 },
  requestBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    margin: 14,
    marginTop: 6,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
  },
  requestBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});

export default function DealRoomScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { criteria } = useInvestorCriteria();
  const { isSaved, save, remove } = useWatchlist();

  const [activeTab, setActiveTab] = useState<DealRoomTab>("all");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<DealRoomFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    setRefreshing(false);
  }, []);

  const enriched = useMemo(
    () => enrichOpportunitiesWithMatch(opportunities, criteria),
    [opportunities, criteria]
  );

  const publicEnriched = useMemo(() => enriched.filter((o) => !o.isConfidential), [enriched]);
  const confidentialEnriched = useMemo(() => enriched.filter((o) => o.isConfidential), [enriched]);
  const recommendedEnriched = useMemo(
    () =>
      sortOpportunities(
        publicEnriched.filter((o) => (o.matchScore ?? 0) >= 50),
        "relevance"
      ),
    [publicEnriched]
  );

  const applyFilters = useCallback(
    (list: Opportunity[]) => {
      let result = list;
      const q = search.toLowerCase();
      if (q) {
        result = result.filter(
          (o) =>
            o.companyName.toLowerCase().includes(q) ||
            o.sector.toLowerCase().includes(q) ||
            o.country.toLowerCase().includes(q) ||
            (o.subSector && o.subSector.toLowerCase().includes(q))
        );
      }
      if (filters.sectors.length) result = result.filter((o) => filters.sectors.includes(o.sector));
      if (filters.countries.length) result = result.filter((o) => filters.countries.includes(o.country));
      if (filters.stages.length) result = result.filter((o) => filters.stages.includes(o.stage));
      if (filters.operationTypes.length) result = result.filter((o) => filters.operationTypes.includes(o.operationType));
      if (filters.wepBadges.length) result = result.filter((o) => filters.wepBadges.includes(o.badge));
      if (filters.minScore > 0) result = result.filter((o) => o.readinessScore >= filters.minScore);
      if (filters.matchOnly) result = result.filter((o) => (o.matchScore ?? 0) >= 50);
      if (filters.savedOnly) result = result.filter((o) => isSaved(o.id));
      if (filters.mandateOnly) result = result.filter((o) => o.mandateSigned);
      if (filters.deckOnly) result = result.filter((o) => o.documentsAvailable.some((d) => d.toLowerCase().includes("deck")));
      return sortOpportunities(result, sortBy);
    },
    [search, filters, sortBy, isSaved]
  );

  const filteredAll = useMemo(() => applyFilters(publicEnriched), [applyFilters, publicEnriched]);
  const filteredRecommended = useMemo(() => applyFilters(recommendedEnriched), [applyFilters, recommendedEnriched]);

  const numActiveFilters = activeFilterCount(filters);
  const matchCount = useMemo(
    () => publicEnriched.filter((o) => (o.matchScore ?? 0) >= 50).length,
    [publicEnriched]
  );

  const toggleSave = useCallback(
    (id: string) => {
      if (isSaved(id)) remove(id);
      else save(id);
      setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, isSaved: !o.isSaved } : o)));
    },
    [isSaved, save, remove]
  );

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch("");
  };

  const displayedList = activeTab === "recommended" ? filteredRecommended : filteredAll;

  const TABS: { key: DealRoomTab; label: string; count: number }[] = [
    { key: "recommended", label: "Pour vous", count: recommendedEnriched.length },
    { key: "all", label: "Toutes", count: publicEnriched.length },
    { key: "confidential", label: "Confidentiel", count: confidentialEnriched.length },
  ];

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

        <View style={styles.tabRow}>
          {TABS.map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tab,
                {
                  backgroundColor:
                    activeTab === tab.key ? "rgba(255,255,255,0.2)" : "transparent",
                  borderColor:
                    activeTab === tab.key ? "rgba(255,255,255,0.5)" : "transparent",
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === tab.key ? "#FFFFFF" : "rgba(255,255,255,0.55)" },
                ]}
              >
                {tab.label}
              </Text>
              {tab.count > 0 && (
                <View
                  style={[
                    styles.tabCount,
                    {
                      backgroundColor:
                        activeTab === tab.key
                          ? tab.key === "confidential"
                            ? `${colors.gold}80`
                            : "rgba(255,255,255,0.25)"
                          : "rgba(255,255,255,0.12)",
                    },
                  ]}
                >
                  <Text style={styles.tabCountText}>{tab.count}</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>

        {activeTab !== "confidential" && (
          <>
            <View
              style={[
                styles.searchBar,
                {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderColor: "rgba(255,255,255,0.15)",
                },
              ]}
            >
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
                    backgroundColor:
                      showFilters || numActiveFilters > 0
                        ? "rgba(255,255,255,0.22)"
                        : "rgba(255,255,255,0.1)",
                    borderColor:
                      showFilters || numActiveFilters > 0
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(255,255,255,0.15)",
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
                <Feather
                  name="zap"
                  size={14}
                  color={filters.matchOnly ? colors.gold : "#FFFFFF"}
                />
                <Text
                  style={[
                    styles.toolbarBtnText,
                    { color: filters.matchOnly ? colors.gold : "#FFFFFF" },
                  ]}
                >
                  Mes critères
                </Text>
              </Pressable>

              {numActiveFilters > 0 && (
                <Pressable
                  onPress={resetFilters}
                  style={[
                    styles.toolbarBtn,
                    {
                      backgroundColor: "rgba(229,57,53,0.25)",
                      borderColor: "rgba(229,57,53,0.4)",
                    },
                  ]}
                >
                  <Feather name="x" size={14} color="#FF7070" />
                  <Text style={[styles.toolbarBtnText, { color: "#FF7070" }]}>Réinit.</Text>
                </Pressable>
              )}

              <View style={styles.spacer} />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.sortScroll}
              >
                {SORT_OPTIONS.map((s) => (
                  <Pressable
                    key={s.value}
                    onPress={() => setSortBy(s.value)}
                    style={[
                      styles.sortChip,
                      {
                        backgroundColor:
                          sortBy === s.value ? "rgba(255,255,255,0.2)" : "transparent",
                        borderColor:
                          sortBy === s.value ? "rgba(255,255,255,0.4)" : "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sortChipText,
                        {
                          color:
                            sortBy === s.value ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                        },
                      ]}
                    >
                      {s.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </>
        )}
      </View>

      {showFilters && activeTab !== "confidential" && (
        <ScrollView
          style={[
            styles.filtersPanel,
            { backgroundColor: colors.card, borderBottomColor: colors.border },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.filtersPanelContent}>
            <ChipRow
              title="Secteur"
              items={SECTORS}
              selected={filters.sectors}
              onToggle={(v) => setFilters((f) => ({ ...f, sectors: toggle(f.sectors, v) }))}
              colors={colors}
            />
            <ChipRow
              title="Pays"
              items={COUNTRIES}
              selected={filters.countries}
              onToggle={(v) => setFilters((f) => ({ ...f, countries: toggle(f.countries, v) }))}
              colors={colors}
            />
            <ChipRow
              title="Stade"
              items={STAGES}
              selected={filters.stages}
              onToggle={(v) => setFilters((f) => ({ ...f, stages: toggle(f.stages, v) }))}
              colors={colors}
            />
            <ChipRow
              title="Type d'opération"
              items={OP_TYPES}
              selected={filters.operationTypes}
              onToggle={(v) =>
                setFilters((f) => ({ ...f, operationTypes: toggle(f.operationTypes, v) }))
              }
              colors={colors}
            />
            <ChipRow
              title="Statut WEP"
              items={WEP_BADGES}
              selected={filters.wepBadges}
              onToggle={(v) =>
                setFilters((f) => ({ ...f, wepBadges: toggle(f.wepBadges, v as WEPBadge) }))
              }
              colors={colors}
            />

            <View style={[chipRowStyles.section, { paddingHorizontal: 16 }]}>
              <Text
                style={[chipRowStyles.title, { color: colors.mutedForeground, paddingHorizontal: 0 }]}
              >
                OPTIONS
              </Text>
              <View style={styles.togglesGrid}>
                {[
                  { key: "mandateOnly", label: "Mandat signé", icon: "shield" as const },
                  { key: "deckOnly", label: "Deck disponible", icon: "file-text" as const },
                  { key: "savedOnly", label: "Watchlist", icon: "bookmark" as const },
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
                      <Feather
                        name={opt.icon}
                        size={13}
                        color={active ? "#FFFFFF" : colors.mutedForeground}
                      />
                      <Text
                        style={[
                          styles.toggleChipText,
                          { color: active ? "#FFFFFF" : colors.mutedForeground },
                        ]}
                      >
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

      {activeTab === "confidential" ? (
        <ScrollView
          contentContainerStyle={[
            styles.confList,
            { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 100) },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          <View
            style={[
              styles.confHeader,
              { backgroundColor: `${colors.gold}10`, borderColor: `${colors.gold}25` },
            ]}
          >
            <Feather name="lock" size={15} color={colors.gold} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.confHeaderTitle, { color: colors.foreground }]}>
                Opportunités confidentielles
              </Text>
              <Text style={[styles.confHeaderSub, { color: colors.mutedForeground }]}>
                Accès réservé aux investisseurs WEP Strategic après validation Winvesty
              </Text>
            </View>
          </View>

          {confidentialEnriched.map((opp) => (
            <ConfidentialCard
              key={opp.id}
              opportunity={opp}
              colors={colors}
              matchScore={opp.matchScore}
            />
          ))}

          {confidentialEnriched.length === 0 && (
            <View style={styles.empty}>
              <Feather name="lock" size={40} color={colors.border} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                Aucune opportunité confidentielle
              </Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                Les opportunités confidentielles apparaîtront ici lorsqu'elles seront disponibles.
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <FlatList
          data={displayedList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OpportunityCard
              opportunity={{ ...item, isSaved: isSaved(item.id) }}
              onSave={toggleSave}
            />
          )}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 100) },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListHeaderComponent={
            activeTab === "recommended" && recommendedEnriched.length > 0 ? (
              <View
                style={[
                  styles.recoBanner,
                  { backgroundColor: `${colors.gold}10`, borderColor: `${colors.gold}25` },
                ]}
              >
                <Feather name="zap" size={14} color={colors.gold} />
                <Text style={[styles.recoBannerText, { color: colors.foreground }]}>
                  <Text style={{ fontFamily: "Inter_700Bold", color: colors.gold }}>
                    {recommendedEnriched.length} opportunité{recommendedEnriched.length > 1 ? "s" : ""}
                  </Text>{" "}
                  correspondent à vos critères d'investissement
                </Text>
              </View>
            ) : activeTab === "recommended" ? null : null
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="inbox" size={40} color={colors.border} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                {activeTab === "recommended"
                  ? "Aucun match trouvé"
                  : "Aucune opportunité trouvée"}
              </Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                {activeTab === "recommended"
                  ? "Définissez vos critères d'investissement dans votre profil pour voir les opportunités qui vous correspondent."
                  : "Aucune opportunité ne correspond exactement à vos filtres.\nVous pouvez élargir vos critères ou consulter les opportunités recommandées par Winvesty."}
              </Text>
              {activeTab === "recommended" ? (
                <Pressable
                  onPress={() => router.push("/(tabs)/profile")}
                  style={[styles.resetBtn, { backgroundColor: colors.primary }]}
                >
                  <Text style={styles.resetBtnText}>Définir mes critères</Text>
                </Pressable>
              ) : numActiveFilters > 0 ? (
                <Pressable
                  onPress={resetFilters}
                  style={[styles.resetBtn, { backgroundColor: colors.primary }]}
                >
                  <Text style={styles.resetBtnText}>Élargir les critères</Text>
                </Pressable>
              ) : null}
            </View>
          }
        />
      )}

      {activeTab !== "confidential" && (
        <View
          style={[
            styles.statusBar,
            { backgroundColor: colors.card, borderTopColor: colors.border },
          ]}
        >
          <Text style={[styles.statusText, { color: colors.mutedForeground }]}>
            {displayedList.length} résultat{displayedList.length > 1 ? "s" : ""}
            {numActiveFilters > 0
              ? ` · ${numActiveFilters} filtre${numActiveFilters > 1 ? "s" : ""}`
              : ""}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12, gap: 10 },
  headerTitle: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerText: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: 1.5,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  liveText: { fontSize: 12, fontFamily: "Inter_500Medium", color: "#4CAF50", letterSpacing: 0.5 },
  matchCountBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  matchCountText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  tabRow: { flexDirection: "row", gap: 6 },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  tabCount: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
  },
  tabCountText: { fontSize: 10, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
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
  toolbarRow: { flexDirection: "row", alignItems: "center", gap: 6 },
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
  filterBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
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
  list: { padding: 16, gap: 0 },
  confList: { padding: 16, gap: 0 },
  confHeader: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: "flex-start",
  },
  confHeaderTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  confHeaderSub: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  recoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  recoBannerText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  empty: { alignItems: "center", paddingTop: 48, gap: 12, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  emptyText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  resetBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 4 },
  resetBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
  statusBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 28,
    borderTopWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
