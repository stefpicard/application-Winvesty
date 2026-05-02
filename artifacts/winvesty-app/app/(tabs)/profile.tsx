import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useInvestorCriteria } from "@/context/InvestorCriteriaContext";
import { useColors } from "@/hooks/useColors";

const INVESTOR_TYPES = ["VC", "Business Angel", "Family Office", "Corporate VC", "Entrepreneur investisseur", "Fonds sectoriel"];
const SECTORS = ["Intelligence Artificielle", "Fintech", "Santé", "Cleantech", "Immobilier", "Logistique", "B2B SaaS", "Commerce", "Industrie"];
const GEOS = ["France", "Belgique", "Suisse", "Allemagne", "UK", "USA", "Europe", "Global"];
const STAGES = ["Pre-seed", "Seed", "Série A", "Série B", "Série C+", "M&A", "Growth"];
const OP_TYPES = ["Levée de fonds", "M&A", "Cession", "Acquisition", "Rapprochement"];
const GROWTH_PROFILES = ["En croissance", "Rentable", "Retournable", "Stable"];

function MultiChipSelector({
  items,
  selected,
  onToggle,
  colors,
}: {
  items: string[];
  selected: string[];
  onToggle: (v: string) => void;
  colors: any;
}) {
  return (
    <View style={chipStyles.grid}>
      {items.map((item) => {
        const active = selected.includes(item);
        return (
          <Pressable
            key={item}
            onPress={() => onToggle(item)}
            style={[
              chipStyles.chip,
              {
                backgroundColor: active ? colors.primary : colors.secondary,
                borderColor: active ? colors.primary : colors.border,
              },
            ]}
          >
            <Text style={[chipStyles.text, { color: active ? "#FFFFFF" : colors.mutedForeground }]}>
              {item}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const chipStyles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  text: { fontSize: 12, fontFamily: "Inter_500Medium" },
});

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { criteria, updateCriteria } = useInvestorCriteria();

  const isInvestor = user?.role === "investor_validated" || user?.role === "investor_pending";
  const isPending = user?.role === "investor_pending";

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/onboarding");
  };

  const toggle = (field: "sectors" | "countries" | "stages" | "operationTypes" | "preferredGrowthProfile") =>
    (val: string) => {
      const current = criteria[field] as string[];
      updateCriteria({
        [field]: current.includes(val) ? current.filter((x) => x !== val) : [...current, val],
      });
    };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Platform.OS === "web" ? 67 : insets.top + 16, paddingBottom: insets.bottom + 100 },
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
        {isPending ? (
          <View style={[styles.statusBadge, { backgroundColor: "#F57C0020", borderColor: "#F57C0050" }]}>
            <Feather name="clock" size={12} color="#F57C00" />
            <Text style={[styles.statusBadgeText, { color: "#F57C00" }]}>Validation en cours</Text>
          </View>
        ) : isInvestor ? (
          <View style={[styles.statusBadge, { backgroundColor: "rgba(76,175,80,0.2)", borderColor: "rgba(76,175,80,0.4)" }]}>
            <Feather name="check-circle" size={12} color="#4CAF50" />
            <Text style={[styles.statusBadgeText, { color: "#4CAF50" }]}>Investisseur validé</Text>
          </View>
        ) : null}
      </View>

      {isInvestor && (
        <>
          <SectionCard title="Type d'investisseur" colors={colors}>
            <View style={chipStyles.grid}>
              {INVESTOR_TYPES.map((t) => (
                <Pressable
                  key={t}
                  onPress={() => updateCriteria({ investorType: t })}
                  style={[
                    chipStyles.chip,
                    {
                      backgroundColor: criteria.investorType === t ? colors.primary : colors.secondary,
                      borderColor: criteria.investorType === t ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[chipStyles.text, { color: criteria.investorType === t ? "#FFFFFF" : colors.mutedForeground }]}>
                    {t}
                  </Text>
                </Pressable>
              ))}
            </View>
          </SectionCard>

          <SectionCard title="Ticket d'investissement" colors={colors}>
            <View style={styles.ticketRow}>
              <View style={styles.ticketField}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Minimum (€)</Text>
                <TextInput
                  style={[styles.ticketInput, { borderColor: colors.border, backgroundColor: colors.background, color: colors.foreground }]}
                  value={String(criteria.minTicket)}
                  onChangeText={(v) => updateCriteria({ minTicket: Number(v) || 0 })}
                  keyboardType="numeric"
                  placeholder="100 000"
                  placeholderTextColor={colors.mutedForeground}
                />
              </View>
              <Text style={[styles.ticketSep, { color: colors.mutedForeground }]}>→</Text>
              <View style={styles.ticketField}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Maximum (€)</Text>
                <TextInput
                  style={[styles.ticketInput, { borderColor: colors.border, backgroundColor: colors.background, color: colors.foreground }]}
                  value={String(criteria.maxTicket)}
                  onChangeText={(v) => updateCriteria({ maxTicket: Number(v) || 0 })}
                  keyboardType="numeric"
                  placeholder="5 000 000"
                  placeholderTextColor={colors.mutedForeground}
                />
              </View>
            </View>
          </SectionCard>

          <SectionCard title="Chiffre d'affaires recherché" colors={colors}>
            <View style={styles.ticketRow}>
              <View style={styles.ticketField}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>CA min. (€)</Text>
                <TextInput
                  style={[styles.ticketInput, { borderColor: colors.border, backgroundColor: colors.background, color: colors.foreground }]}
                  value={String(criteria.minRevenue)}
                  onChangeText={(v) => updateCriteria({ minRevenue: Number(v) || 0 })}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.mutedForeground}
                />
              </View>
              <Text style={[styles.ticketSep, { color: colors.mutedForeground }]}>→</Text>
              <View style={styles.ticketField}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>CA max. (€)</Text>
                <TextInput
                  style={[styles.ticketInput, { borderColor: colors.border, backgroundColor: colors.background, color: colors.foreground }]}
                  value={String(criteria.maxRevenue)}
                  onChangeText={(v) => updateCriteria({ maxRevenue: Number(v) || 0 })}
                  keyboardType="numeric"
                  placeholder="10 000 000"
                  placeholderTextColor={colors.mutedForeground}
                />
              </View>
            </View>
          </SectionCard>

          <SectionCard title="Secteurs recherchés" colors={colors}>
            <MultiChipSelector items={SECTORS} selected={criteria.sectors} onToggle={toggle("sectors")} colors={colors} />
          </SectionCard>

          <SectionCard title="Zones géographiques" colors={colors}>
            <MultiChipSelector items={GEOS} selected={criteria.countries} onToggle={toggle("countries")} colors={colors} />
          </SectionCard>

          <SectionCard title="Stades d'investissement" colors={colors}>
            <MultiChipSelector items={STAGES} selected={criteria.stages} onToggle={toggle("stages")} colors={colors} />
          </SectionCard>

          <SectionCard title="Type d'opération" colors={colors}>
            <MultiChipSelector items={OP_TYPES} selected={criteria.operationTypes} onToggle={toggle("operationTypes")} colors={colors} />
          </SectionCard>

          <SectionCard title="Profil de croissance recherché" colors={colors}>
            <MultiChipSelector items={GROWTH_PROFILES} selected={criteria.preferredGrowthProfile} onToggle={toggle("preferredGrowthProfile")} colors={colors} />
          </SectionCard>

          <SectionCard title="Notifications de matching" colors={colors}>
            <View style={styles.notifRow}>
              <View style={styles.notifInfo}>
                <Text style={[styles.notifTitle, { color: colors.foreground }]}>Alertes Deal Room</Text>
                <Text style={[styles.notifDesc, { color: colors.mutedForeground }]}>
                  Recevoir une notification quand une nouvelle opportunité correspond à mes critères
                </Text>
              </View>
              <Switch
                value={criteria.notificationEnabled}
                onValueChange={(v) => updateCriteria({ notificationEnabled: v })}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor="#FFFFFF"
              />
            </View>
          </SectionCard>

          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [
              styles.saveBtn,
              { backgroundColor: saved ? colors.success : colors.accent, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Feather name={saved ? "check" : "save"} size={18} color="#FFFFFF" />
            <Text style={styles.saveBtnText}>{saved ? "Critères sauvegardés" : "Sauvegarder mes critères"}</Text>
          </Pressable>
        </>
      )}

      <Pressable
        onPress={handleLogout}
        style={({ pressed }) => [styles.logoutBtn, { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
      >
        <Feather name="log-out" size={16} color={colors.destructive} />
        <Text style={[styles.logoutText, { color: colors.destructive }]}>Se déconnecter</Text>
      </Pressable>
    </ScrollView>
  );
}

function SectionCard({ title, children, colors }: { title: string; children: React.ReactNode; colors: any }) {
  return (
    <View style={[sectionStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[sectionStyles.title, { color: colors.foreground }]}>{title}</Text>
      {children}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 14 },
  title: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});

const styles = StyleSheet.create({
  content: { padding: 16, gap: 14 },
  profileHero: { borderRadius: 20, padding: 22, alignItems: "center", gap: 12 },
  avatar: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 28, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  heroInfo: { alignItems: "center", gap: 4 },
  heroName: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  heroEmail: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.6)" },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  statusBadgeText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  ticketRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  ticketField: { flex: 1, gap: 6 },
  fieldLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  ticketInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 14, fontFamily: "Inter_500Medium" },
  ticketSep: { fontSize: 18, marginBottom: 10 },
  notifRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  notifInfo: { flex: 1, gap: 4 },
  notifTitle: { fontSize: 14, fontFamily: "Inter_500Medium" },
  notifDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 52, borderRadius: 14 },
  saveBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 50, borderRadius: 14, borderWidth: 1 },
  logoutText: { fontSize: 15, fontFamily: "Inter_500Medium" },
});
