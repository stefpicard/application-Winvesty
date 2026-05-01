import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Notification, mockNotifications } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

const ICON_MAP = {
  validated: { icon: "check-circle" as const, color: "#2E7D32" },
  opportunity: { icon: "layers" as const, color: "#3179AF" },
  connection: { icon: "users" as const, color: "#C9A84C" },
  status: { icon: "shield" as const, color: "#053661" },
};

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const iconCfg = ICON_MAP[item.type];

    return (
      <Pressable
        onPress={() => markRead(item.id)}
        style={[
          styles.item,
          {
            backgroundColor: item.read ? colors.card : `${colors.primary}08`,
            borderColor: item.read ? colors.border : `${colors.primary}25`,
          },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: `${iconCfg.color}15` }]}>
          <Feather name={iconCfg.icon} size={18} color={iconCfg.color} />
        </View>
        <View style={styles.itemContent}>
          <View style={styles.itemTop}>
            <Text style={[styles.itemTitle, { color: colors.foreground }]}>{item.title}</Text>
            {!item.read && (
              <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />
            )}
          </View>
          <Text style={[styles.itemMessage, { color: colors.mutedForeground }]} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={[styles.itemDate, { color: colors.border }]}>
            {new Date(item.date).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>
      </Pressable>
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
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.accent }]}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <Pressable onPress={markAllRead}>
            <Text style={styles.markAllText}>Tout marquer comme lu</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 100) },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!notifications.length}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="bell-off" size={40} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Aucune notification
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
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  markAllText: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.55)" },
  list: { padding: 16 },
  item: {
    flexDirection: "row",
    gap: 14,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  itemContent: { flex: 1, gap: 4 },
  itemTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  itemTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4, marginLeft: 8, flexShrink: 0 },
  itemMessage: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  itemDate: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
