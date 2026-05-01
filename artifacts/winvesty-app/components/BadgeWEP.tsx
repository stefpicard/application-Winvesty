import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { WEPBadge } from "@/data/mockData";

interface BadgeWEPProps {
  badge: WEPBadge;
  size?: "sm" | "md";
}

export function BadgeWEP({ badge, size = "md" }: BadgeWEPProps) {
  const colors = useColors();

  const badgeStyle = {
    "WEP Access": { bg: colors.secondary, text: colors.navyMid, border: colors.border },
    "WEP Premium": { bg: colors.goldLight, text: "#8B6914", border: "#D4A853" },
    "WEP Strategic": { bg: colors.primary, text: "#FFFFFF", border: colors.primary },
  }[badge];

  const isSmall = size === "sm";

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: badgeStyle.bg,
          borderColor: badgeStyle.border,
          paddingHorizontal: isSmall ? 8 : 10,
          paddingVertical: isSmall ? 3 : 5,
        },
      ]}
    >
      <Text style={[styles.text, { color: badgeStyle.text, fontSize: isSmall ? 10 : 11 }]}>
        {badge.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.6,
  },
});
