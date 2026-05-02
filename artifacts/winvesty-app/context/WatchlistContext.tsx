import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type WatchlistStatus =
  | "À lire"
  | "Intéressant"
  | "À suivre"
  | "Demande envoyée"
  | "Contact établi"
  | "Non prioritaire";

export interface WatchlistEntry {
  opportunityId: string;
  status: WatchlistStatus;
  note?: string;
  savedAt: string;
  updatedAt: string;
}

interface WatchlistContextType {
  watchlist: WatchlistEntry[];
  isSaved: (id: string) => boolean;
  getEntry: (id: string) => WatchlistEntry | undefined;
  save: (id: string, status?: WatchlistStatus) => void;
  remove: (id: string) => void;
  updateStatus: (id: string, status: WatchlistStatus) => void;
  updateNote: (id: string, note: string) => void;
}

const WatchlistContext = createContext<WatchlistContextType | null>(null);

const STORAGE_KEY = "winvesty_watchlist";

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => { if (raw) setWatchlist(JSON.parse(raw)); })
      .catch(() => {});
  }, []);

  const persist = (updated: WatchlistEntry[]) => {
    setWatchlist(updated);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
  };

  const isSaved = (id: string) => watchlist.some((e) => e.opportunityId === id);

  const getEntry = (id: string) => watchlist.find((e) => e.opportunityId === id);

  const save = (id: string, status: WatchlistStatus = "À lire") => {
    if (isSaved(id)) return;
    const now = new Date().toISOString();
    persist([...watchlist, { opportunityId: id, status, savedAt: now, updatedAt: now }]);
  };

  const remove = (id: string) => {
    persist(watchlist.filter((e) => e.opportunityId !== id));
  };

  const updateStatus = (id: string, status: WatchlistStatus) => {
    persist(
      watchlist.map((e) =>
        e.opportunityId === id ? { ...e, status, updatedAt: new Date().toISOString() } : e
      )
    );
  };

  const updateNote = (id: string, note: string) => {
    persist(
      watchlist.map((e) =>
        e.opportunityId === id ? { ...e, note, updatedAt: new Date().toISOString() } : e
      )
    );
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, isSaved, getEntry, save, remove, updateStatus, updateNote }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used within WatchlistProvider");
  return ctx;
}
