import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setRole } = useAuth();

  const handleSelect = (role: "startup" | "investor") => {
    setRole(role);
    router.push("/auth/login");
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.primary, paddingTop: insets.top + 32, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <View style={styles.logoSection}>
        <Text style={styles.logoText}>W</Text>
        <Text style={styles.brandName}>WINVESTY</Text>
        <Text style={styles.tagline}>La plateforme stratégique française{"\n"}de levée de fonds & M&A</Text>
      </View>

      <View style={styles.cardsSection}>
        <Text style={[styles.question, { color: "rgba(255,255,255,0.7)" }]}>Vous êtes...</Text>

        <Pressable
          onPress={() => handleSelect("startup")}
          style={({ pressed }) => [
            styles.roleCard,
            { backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)", opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <View style={[styles.roleIcon, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
            <Feather name="trending-up" size={26} color="#FFFFFF" />
          </View>
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>Une startup</Text>
            <Text style={styles.roleDesc}>Déposez votre dossier et accédez à des investisseurs qualifiés</Text>
          </View>
          <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.4)" />
        </Pressable>

        <Pressable
          onPress={() => handleSelect("investor")}
          style={({ pressed }) => [
            styles.roleCard,
            { backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)", opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <View style={[styles.roleIcon, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
            <Feather name="briefcase" size={26} color="#FFFFFF" />
          </View>
          <View style={styles.roleInfo}>
            <Text style={styles.roleTitle}>Un investisseur</Text>
            <Text style={styles.roleDesc}>Accédez à des opportunités sélectionnées par nos experts</Text>
          </View>
          <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.4)" />
        </Pressable>

        <Pressable
          onPress={() => router.push("/auth/login")}
          style={({ pressed }) => [
            styles.memberButton,
            { borderColor: "rgba(255,255,255,0.35)", opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={styles.memberText}>Déjà membre ? Se connecter</Text>
        </Pressable>
      </View>

      <Text style={styles.footerText}>Plateforme réservée aux professionnels</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoText: {
    fontSize: 56,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    lineHeight: 64,
  },
  brandName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: 6,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
    lineHeight: 22,
  },
  cardsSection: {
    flex: 1,
    gap: 14,
  },
  question: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    gap: 14,
  },
  roleIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  roleInfo: {
    flex: 1,
    gap: 4,
  },
  roleTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
  roleDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.65)",
    lineHeight: 18,
  },
  memberButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  memberText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.8)",
  },
  footerText: {
    textAlign: "center",
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.35)",
    letterSpacing: 0.5,
  },
});
