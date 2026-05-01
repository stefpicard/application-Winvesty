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
import { mockOpportunities } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

export default function OpportunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const opportunity = mockOpportunities.find((o) => o.id === id);
  const [isSaved, setIsSaved] = useState(opportunity?.isSaved ?? false);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  if (!opportunity) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>Opportunité introuvable</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backText, { color: colors.accent }]}>Retour</Text>
        </Pressable>
      </View>
    );
  }

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
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </Pressable>
          <Pressable onPress={() => setIsSaved(!isSaved)} hitSlop={12}>
            <Feather name="bookmark" size={22} color={isSaved ? colors.gold : "rgba(255,255,255,0.4)"} />
          </Pressable>
        </View>

        <View style={styles.heroContent}>
          <View style={[styles.logoLarge, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
            <Text style={styles.logoLargeText}>{opportunity.companyName.charAt(0)}</Text>
          </View>
          <Text style={styles.companyName}>{opportunity.companyName}</Text>
          <Text style={styles.metaText}>
            {opportunity.sector} · {opportunity.country}
          </Text>
          <View style={styles.heroTags}>
            <BadgeWEP badge={opportunity.badge} />
            <View style={[styles.stageTag, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
              <Text style={styles.stageTagText}>{opportunity.stage}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 100) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.amountCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.amountRow}>
            <View style={styles.amountItem}>
              <Text style={[styles.amountLabel, { color: colors.mutedForeground }]}>Montant recherché</Text>
              <Text style={[styles.amountValue, { color: colors.primary }]}>{opportunity.amountSought}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.amountItem}>
              <Text style={[styles.amountLabel, { color: colors.mutedForeground }]}>Score WEP</Text>
              <Text style={[styles.amountValue, { color: readinessColor }]}>{opportunity.readinessScore}%</Text>
            </View>
          </View>
          <View style={[styles.scoreBar, { backgroundColor: colors.secondary }]}>
            <View style={[styles.scoreBarFill, { width: `${opportunity.readinessScore}%` as any, backgroundColor: readinessColor }]} />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Résumé</Text>
          <Text style={[styles.cardText, { color: colors.mutedForeground }]}>{opportunity.summary}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.winvestyHeader}>
            <Feather name="shield" size={16} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Avis Winvesty</Text>
          </View>
          <Text style={[styles.cardText, { color: colors.mutedForeground }]}>{opportunity.winvestyOpinion}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Documents disponibles</Text>
          <View style={styles.docsList}>
            {opportunity.documentsAvailable.map((doc) => (
              <View key={doc} style={[styles.docItem, { backgroundColor: colors.secondary }]}>
                <Feather name="file-text" size={14} color={colors.accent} />
                <Text style={[styles.docText, { color: colors.foreground }]}>{doc}</Text>
                <Feather name="download" size={14} color={colors.mutedForeground} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
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
                  {requested ? "Demande envoyée" : "Demander une mise en relation"}
                </Text>
              </>
            )}
          </Pressable>

          <Pressable
            onPress={() => setIsSaved(!isSaved)}
            style={({ pressed }) => [
              styles.secondaryBtn,
              { borderColor: colors.border, backgroundColor: colors.card, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Feather name="bookmark" size={18} color={isSaved ? colors.gold : colors.mutedForeground} />
            <Text style={[styles.secondaryBtnText, { color: isSaved ? colors.gold : colors.mutedForeground }]}>
              {isSaved ? "Sauvegardé" : "Sauvegarder"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFoundText: { fontSize: 16, fontFamily: "Inter_400Regular" },
  backText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  header: { paddingHorizontal: 20, paddingBottom: 24, gap: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  backBtn: {},
  heroContent: { alignItems: "center", gap: 10 },
  logoLarge: { width: 64, height: 64, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  logoLargeText: { fontSize: 26, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  companyName: { fontSize: 24, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  metaText: { fontSize: 14, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.65)" },
  heroTags: { flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  stageTag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  stageTagText: { fontSize: 12, fontFamily: "Inter_500Medium", color: "#FFFFFF" },
  content: { padding: 16, gap: 14 },
  amountCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 12 },
  amountRow: { flexDirection: "row", alignItems: "center" },
  amountItem: { flex: 1, alignItems: "center", gap: 4 },
  amountLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  amountValue: { fontSize: 22, fontFamily: "Inter_700Bold" },
  divider: { width: 1, height: 40, marginHorizontal: 16 },
  scoreBar: { height: 6, borderRadius: 3, overflow: "hidden" },
  scoreBarFill: { height: 6, borderRadius: 3 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 10 },
  cardTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  cardText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  winvestyHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  docsList: { gap: 8 },
  docItem: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 10 },
  docText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium" },
  actions: { gap: 10, marginTop: 4 },
  primaryBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, height: 52, borderRadius: 14 },
  primaryBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
  secondaryBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 46, borderRadius: 12, borderWidth: 1 },
  secondaryBtnText: { fontSize: 14, fontFamily: "Inter_500Medium" },
});
