# Winvesty Mobile App - Changelog

## v2.0.0 — Massive UX Upgrade (02 mai 2026)

### Nouvelles fonctionnalités

**Investor Cockpit (Accueil)**
- Hero card avec statistiques live (correspondances, watchlist, notifications non lues)
- Bannière d'alerte matching (nombre d'opportunités correspondant aux critères)
- Bannière deals confidentiels (accès WEP Strategic)
- Actions rapides : Deal Room, Watchlist, Notifications, Back-office admin
- Section "Recommandé pour vous" (top 3 matches)
- Bloc critères d'investissement avec chips + lien vers profil
- Pull-to-refresh

**Startup Cockpit (Accueil - rôle startup)**
- Progression en 7 étapes visuelles (stepper animé)
- Score de préparation global + 6 dimensions avec barres
- Message Winvesty (feedback personnalisé)
- Liste documents avec statut (Validé / À corriger / À compléter)
- Points forts et recommandés prioritaires
- CTA "Gérer mon dossier"

**Deal Room intelligente avec 3 onglets**
- "Pour vous" : opportunités filtrées par critères investisseur + score match
- "Toutes" : toutes les opportunités publiques
- "Confidentiel" : opportunités masquées avec système de demande d'accès
- Recherche plein texte (société, secteur, pays)
- Filtres avancés : secteur, pays, stade, type d'opération, badge WEP, options
- Tri : Pertinence / Date / Montant / Score WEP
- Badge "X match" en temps réel dans le header
- Bandeau "Pour vous" contextuel
- Indicateur "Live" dans le header

**Confidential Cards**
- Informations partiellement masquées (société cachée)
- Secteur, stade, pays, montant et badge WEP visibles
- Score WEP + match score affichés
- Bouton "Demander l'accès" avec état "Demande envoyée"

**Fiche opportunité avec 9 onglets**
- **Résumé** : synthèse + métriques (Montant, Score WEP, CA, EBITDA, Croissance, Mandat)
- **Marché** : description du marché adressable
- **Traction** : métriques commerciales + KPI grid (CA, Croissance, Effectifs)
- **Équipe** : présentation + date de fondation
- **Financement** : historique + tableau de la levée actuelle
- **Documents** : liste des documents disponibles (accès sur validation)
- **Avis Winvesty** : analyse qualitative + points forts/vigilance + recommandation
- **Pourquoi ce deal ?** : score match détaillé par dimension avec breakdown
- **Mise en relation** : processus 3 étapes + bouton de demande

**Watchlist investisseur**
- Contexte WatchlistContext avec persistance AsyncStorage
- Statuts : À lire, Intéressant, À suivre, Demande envoyée, Contact établi, Non prioritaire
- Sauvegarde/suppression depuis OpportunityCard et detail
- Compteur dans le cockpit et la barre de navigation

**Supabase**
- Client `lib/supabase.ts` configuré (EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY)
- Persistance session via AsyncStorage

**Auth**
- Connexion admin via email contenant "admin" ou "winvesty"
- Startup Cockpit automatiquement pour rôle "startup"

### Données mock étendues
- 7 opportunités dont 2 confidentielles (opp-6, opp-7)
- `StartupApplication`, `StartupDocument`, `StartupScore` avec données réalistes
- Notifications enrichies (confidential_available, winvesty_opinion_added, new_deck_available)
- `marketDescription`, `tractionDescription`, `teamDescription`, `financingHistory` pour chaque opportunité
- `winvestyStrengths`, `winvestyWarnings`, `winvestyRecommendation`

---

## stable-mobile-app-v1-before-ux-upgrade

Version sauvegardée avant les nouvelles évolutions UX investisseur et startup.

**Checkpoint Git de référence :** `b0f82551daf797aa77c0cc8f7a12247664f9c0aa`

Cette version correspond à l'état de l'application avec :
- 5 onglets : Accueil, Deal Room, Dossier, Profil, Alertes
- Matching de base avec score (secteur, pays, ticket, stade, CA, type d'opération, mots-clés)
- Deal Room avec filtres avancés
- Profil investisseur avec 9 critères
- Notifications in-app
- Back-office admin de base
- Fiche opportunité avec analyse de compatibilité
- @supabase/supabase-js installé
