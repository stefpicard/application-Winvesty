import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const SETTINGS_SECTIONS = [
  {
    title: "Compte",
    items: [
      { icon: "user" as const, label: "Informations personnelles" },
      { icon: "bell" as const, label: "Préférences de notification" },
      { icon: "lock" as const, label: "Sécurité et mot de passe" },
    ],
  },
  {
    title: "Application",
    items: [
      { icon: "globe" as const, label: "Langue" },
      { icon: "smartphone" as const, label: "Version de l'application" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: "help-circle" as const, label: "Centre d'aide" },
      { icon: "mail" as const, label: "Contacter Winvesty" },
      { icon: "file-text" as const, label: "Conditions d'utilisation" },
      { icon: "shield" as const, label: "Politique de confidentialité" },
    ],
  },
];

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Platform.OS === "web" ? 67 : insets.top + 12,
          paddingBottom: insets.bottom + 40,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageHeader}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.pageTitle, { color: colors.foreground }]}>Paramètres</Text>
        <View style={{ width: 22 }} />
      </View>

      {SETTINGS_SECTIONS.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{section.title.toUpperCase()}</Text>
          <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {section.items.map((item, idx) => (
              <React.Fragment key={item.label}>
                <Pressable
                  style={({ pressed }) => [styles.settingItem, { opacity: pressed ? 0.7 : 1 }]}
                >
                  <View style={[styles.itemIcon, { backgroundColor: `${colors.primary}12` }]}>
                    <Feather name={item.icon} size={16} color={colors.primary} />
                  </View>
                  <Text style={[styles.itemLabel, { color: colors.foreground }]}>{item.label}</Text>
                  <Feather name="chevron-right" size={16} color={colors.border} />
                </Pressable>
                {idx < section.items.length - 1 && (
                  <View style={[styles.separator, { backgroundColor: colors.border }]} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={[styles.version, { color: colors.border }]}>Winvesty v1.0.0</Text>
        <Text style={[styles.version, { color: colors.border }]}>© 2026 Winvesty. Tous droits réservés.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 24 },
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  pageTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  section: { gap: 8 },
  sectionTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 1 },
  sectionCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemIcon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  itemLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  separator: { height: 1, marginLeft: 62 },
  footer: { alignItems: "center", gap: 4, paddingVertical: 8 },
  version: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
