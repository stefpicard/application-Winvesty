import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useNotifications } from "@/context/NotificationsContext";
import { NotificationItem } from "@/data/mockData";
import { useColors } from "@/hooks/useColors";

const TYPE_CONFIG = {
  new_matching_opportunity: { icon: "zap" as const, color: "#C9A84C", label: "Match" },
  startup_published: { icon: "layers" as const, color: "#3179AF", label: "Publication" },
  connection_request_update: { icon: "users" as const, color: "#053661", label: "Mise en relation" },
  profile_validation: { icon: "shield" as const, color: "#2E7D32", label: "Validation" },
  dealroom_update: { icon: "bell" as const, color: "#3179AF", label: "Deal Room" },
};

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const cfg = TYPE_CONFIG[item.type];
    const isUnread = !item.isRead;
    const isPriority = item.priority === "high";

    return (
      <Pressable
        onPress={() => {
          markRead(item.id);
          if (item.relatedOpportunityId) {
            router.push(`/opportunity/${item.relatedOpportunityId}`);
          }
        }}
        style={[
          styles.item,
          {
            backgroundColor: isUnread
              ? isPriority
                ? `${colors.gold}08`
                : `${colors.primary}06`
              : colors.card,
            borderColor: isUnread
              ? isPriority
                ? `${colors.gold}35`
                : `${colors.primary}20`
              : colors.border,
          },
        ]}
      >
        {isPriority && isUnread && (
          <View style={[styles.priorityStripe, { backgroundColor: colors.gold }]} />
        )}

        <View style={[styles.iconWrap, { backgroundColor: `${cfg.color}15` }]}>
          <Feather name={cfg.icon} size={18} color={cfg.color} />
        </View>

        <View style={styles.itemContent}>
          <View style={styles.itemTop}>
            <View style={styles.itemTopLeft}>
              <View style={[styles.typeTag, { backgroundColor: `${cfg.color}15` }]}>
                <Text style={[styles.typeTagText, { color: cfg.color }]}>{cfg.label}</Text>
              </View>
              {isPriority && (
                <View style={[styles.typeTag, { backgroundColor: `${colors.gold}18` }]}>
                  <Text style={[styles.typeTagText, { color: colors.gold }]}>Prioritaire</Text>
                </View>
              )}
            </View>
            {isUnread && <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />}
          </View>

          <Text style={[styles.itemTitle, { color: colors.foreground }]}>{item.title}</Text>
          <Text style={[styles.itemMessage, { color: colors.mutedForeground }]} numberOfLines={3}>
            {item.message}
          </Text>

          <View style={styles.itemBottom}>
            <Text style={[styles.itemDate, { color: colors.border }]}>
              {new Date(item.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
              })}
            </Text>
            {item.relatedOpportunityId && (
              <View style={styles.viewLink}>
                <Text style={[styles.viewLinkText, { color: colors.accent }]}>Voir l'opportunité</Text>
                <Feather name="arrow-right" size={12} color={colors.accent} />
              </View>
            )}
          </View>
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
            <View style={[styles.badge, { backgroundColor: colors.gold }]}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <Pressable onPress={markAllRead} style={styles.markAllBtn}>
            <Feather name="check-circle" size={13} color="rgba(255,255,255,0.55)" />
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
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="bell-off" size={40} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Aucune notification</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16, gap: 8 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  badge: { minWidth: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center", paddingHorizontal: 6 },
  badgeText: { fontSize: 12, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  markAllBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  markAllText: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.55)" },
  list: { padding: 16 },
  item: {
    flexDirection: "row",
    gap: 14,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    overflow: "hidden",
  },
  priorityStripe: { position: "absolute", left: 0, top: 0, bottom: 0, width: 3 },
  iconWrap: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  itemContent: { flex: 1, gap: 6 },
  itemTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemTopLeft: { flexDirection: "row", gap: 6 },
  typeTag: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  typeTagText: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 0.3 },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  itemTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", lineHeight: 20 },
  itemMessage: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  itemBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 2 },
  itemDate: { fontSize: 11, fontFamily: "Inter_400Regular" },
  viewLink: { flexDirection: "row", alignItems: "center", gap: 4 },
  viewLinkText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});
