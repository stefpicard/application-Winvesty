import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { mockStartupApplication } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

const SECTORS = ["IA / Tech", "Fintech", "Santé", "Cleantech", "Immobilier", "Logistique", "B2B SaaS", "Autre"];
const STAGES = ["Pre-seed", "Seed", "Série A", "Série B", "Série C+", "M&A"];
const STATUS_CONFIG = {
  draft: { label: "Brouillon", color: "#6B7E94", icon: "edit-2" as const },
  pending: { label: "En attente de validation", color: "#F57C00", icon: "clock" as const },
  validated: { label: "Validé par Winvesty", color: "#2E7D32", icon: "check-circle" as const },
  published: { label: "Publié en Deal Room", color: "#053661", icon: "layers" as const },
};

export default function SubmitScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [hasApplication, setHasApplication] = useState(true);
  const [companyName, setCompanyName] = useState(mockStartupApplication.companyName);
  const [sector, setSector] = useState(mockStartupApplication.sector);
  const [country, setCountry] = useState(mockStartupApplication.country);
  const [amount, setAmount] = useState(mockStartupApplication.amountSought);
  const [stage, setStage] = useState(mockStartupApplication.stage);
  const [description, setDescription] = useState(mockStartupApplication.description);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const status = mockStartupApplication.status;
  const statusInfo = STATUS_CONFIG[status];

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!hasApplication) {
    return (
      <View style={[styles.emptyState, { backgroundColor: colors.background, paddingTop: Platform.OS === "web" ? 67 : insets.top }]}>
        <Feather name="folder-plus" size={48} color={colors.border} />
        <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Déposez votre dossier</Text>
        <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>
          Commencez par créer votre dossier pour être visible par les investisseurs sélectionnés par Winvesty.
        </Text>
        <Pressable
          onPress={() => setHasApplication(true)}
          style={[styles.startBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.startBtnText}>Créer mon dossier</Text>
        </Pressable>
      </View>
    );
  }

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
      <View style={styles.pageHeader}>
        <Text style={[styles.pageTitle, { color: colors.foreground }]}>Mon Dossier</Text>
        <View style={[styles.statusBadge, { backgroundColor: `${statusInfo.color}15`, borderColor: `${statusInfo.color}40` }]}>
          <Feather name={statusInfo.icon} size={12} color={statusInfo.color} />
          <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>Informations générales</Text>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Nom de la société</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background, color: colors.foreground }]}
            value={companyName}
            onChangeText={setCompanyName}
            placeholder="Nom de votre startup"
            placeholderTextColor={colors.mutedForeground}
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Secteur d'activité</Text>
          <View style={styles.chipGrid}>
            {SECTORS.map((s) => (
              <Pressable
                key={s}
                onPress={() => setSector(s)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: sector === s ? colors.primary : colors.secondary,
                    borderColor: sector === s ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={[styles.chipText, { color: sector === s ? "#FFFFFF" : colors.mutedForeground }]}>
                  {s}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>Pays</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background, color: colors.foreground }]}
              value={country}
              onChangeText={setCountry}
              placeholder="France"
              placeholderTextColor={colors.mutedForeground}
            />
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>Montant (€)</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background, color: colors.foreground }]}
              value={amount}
              onChangeText={setAmount}
              placeholder="3 000 000"
              keyboardType="numeric"
              placeholderTextColor={colors.mutedForeground}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Stade de développement</Text>
          <View style={styles.chipGrid}>
            {STAGES.map((s) => (
              <Pressable
                key={s}
                onPress={() => setStage(s)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: stage === s ? colors.accent : colors.secondary,
                    borderColor: stage === s ? colors.accent : colors.border,
                  },
                ]}
              >
                <Text style={[styles.chipText, { color: stage === s ? "#FFFFFF" : colors.mutedForeground }]}>
                  {s}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Description du projet</Text>
          <TextInput
            style={[
              styles.textArea,
              { borderColor: colors.border, backgroundColor: colors.background, color: colors.foreground },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Décrivez votre projet, votre traction, vos différenciateurs..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>Documents</Text>
        <Pressable style={[styles.uploadBtn, { borderColor: colors.border, backgroundColor: colors.secondary }]}>
          <Feather name="upload-cloud" size={24} color={colors.accent} />
          <Text style={[styles.uploadText, { color: colors.accent }]}>Uploader le Pitch Deck</Text>
          <Text style={[styles.uploadSub, { color: colors.mutedForeground }]}>PDF, PPTX — max 20 Mo</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={handleSave}
        disabled={saving}
        style={({ pressed }) => [
          styles.saveBtn,
          { backgroundColor: saved ? colors.success : colors.primary, opacity: pressed || saving ? 0.85 : 1 },
        ]}
      >
        {saving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Feather name={saved ? "check" : "save"} size={18} color="#FFFFFF" />
            <Text style={styles.saveBtnText}>{saved ? "Sauvegardé !" : "Sauvegarder le dossier"}</Text>
          </>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16 },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyTitle: { fontSize: 22, fontFamily: "Inter_700Bold", textAlign: "center" },
  emptyDesc: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
  startBtn: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14, marginTop: 8 },
  startBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
  pageHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  pageTitle: { fontSize: 22, fontFamily: "Inter_700Bold" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 16 },
  cardTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  field: { gap: 8 },
  label: { fontSize: 13, fontFamily: "Inter_500Medium" },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, height: 46, fontSize: 14, fontFamily: "Inter_400Regular" },
  textArea: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, fontFamily: "Inter_400Regular", minHeight: 100 },
  row: { flexDirection: "row", gap: 12 },
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  uploadBtn: { borderWidth: 1.5, borderStyle: "dashed", borderRadius: 12, padding: 24, alignItems: "center", gap: 8 },
  uploadText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  uploadSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 52, borderRadius: 14 },
  saveBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },
});
