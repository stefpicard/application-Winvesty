# Application Utilisateur Winvesty

Application officielle Winvesty destinée aux utilisateurs, startups, dirigeants, investisseurs et partenaires souhaitant accéder à l’écosystème Winvesty depuis une application mobile ou une plateforme d’apps.

Winvesty est une plateforme stratégique française dédiée à la levée de fonds, à la visibilité qualifiée, au matching investisseurs/startups et aux opérations M&A.

L’objectif de cette application est de proposer une expérience plus directe, plus fluide et plus premium que le simple accès au site web, avec une logique progressive d’application mobile, d’espace utilisateur, de notifications, de suivi et d’accès à certains services Winvesty.

---

## Objectif de l’application

L’application Winvesty a pour objectif de devenir un point d’entrée central pour les différents utilisateurs de l’écosystème Winvesty.

Elle doit permettre notamment de :

- présenter clairement les services Winvesty ;
- faciliter l’accès aux programmes WEP Access, WEP Premium et WEP Strategic ;
- accompagner les startups et entreprises dans leur démarche de levée de fonds ;
- permettre aux dirigeants de s’orienter vers des opérations M&A, de cession, d’acquisition ou de rapprochement ;
- faciliter l’inscription ou la qualification des investisseurs ;
- créer une expérience mobile plus crédible, plus fluide et plus professionnelle ;
- renforcer l’image digitale, premium et innovante de Winvesty ;
- préparer progressivement l’intégration avec la Deal Room Winvesty.

---

## Publics cibles

L’application s’adresse principalement à :

1. Startups en recherche de financement.
2. Entreprises souhaitant préparer une levée de fonds.
3. Dirigeants envisageant une cession, une acquisition, une transmission ou un rapprochement.
4. Investisseurs qualifiés.
5. Business angels.
6. Fonds VC.
7. Corporate VC.
8. Family offices.
9. Partenaires et prescripteurs : avocats d’affaires, experts-comptables, DAF externalisés, incubateurs, accélérateurs et réseaux entrepreneuriaux.

---

## Fonctionnalités prévues

Les fonctionnalités actuelles ou prévues peuvent inclure :

- écran d’accueil premium ;
- présentation de Winvesty ;
- présentation des programmes WEP ;
- parcours startup / entreprise ;
- parcours investisseur ;
- formulaire de candidature startup ;
- formulaire d’inscription investisseur ;
- accès à des contenus ou services selon le profil utilisateur ;
- notifications ;
- actualités Winvesty ;
- contenus pédagogiques sur la levée de fonds et le M&A ;
- suivi du dossier utilisateur ;
- connexion future avec la Deal Room Winvesty ;
- accès sécurisé à certaines opportunités ;
- redirection vers le site officiel Winvesty ;
- préparation à une publication sur Apple App Store et Google Play Store.

---

## Positionnement produit

L’application doit refléter le positionnement premium de Winvesty.

Les priorités produit sont :

- interface claire ;
- expérience simple ;
- parcours utilisateur fluide ;
- crédibilité immédiate auprès des investisseurs et dirigeants ;
- image professionnelle ;
- accès structuré aux services ;
- logique de plateforme stratégique ;
- expérience mobile rassurante ;
- cohérence avec l’image de marque Winvesty.

L’application ne doit pas être perçue comme une simple vitrine, mais comme un prolongement applicatif de l’écosystème Winvesty.

---

## Vision long terme

À terme, l’application pourra devenir un point d’entrée central pour :

- les startups en recherche de financement ;
- les entreprises en réflexion stratégique ;
- les investisseurs qualifiés ;
- les opportunités M&A ;
- les partenaires de sourcing ;
- les programmes WEP ;
- la Deal Room Winvesty ;
- les notifications d’opportunités ;
- le suivi des démarches ;
- l’accès à des services premium ;
- les futures briques de matching et d’analyse.

Cette application doit contribuer à renforcer l’ambition de Winvesty : devenir une plateforme digitale de référence pour les opérations d’investissement, de levée de fonds et de M&A.

---

## Stack technique

Le projet utilise une architecture monorepo basée sur pnpm et TypeScript.

### Stack principale

- pnpm
- TypeScript
- Node.js
- Expo
- React Native
- Expo Router
- React Native Web
- Supabase
- Zod
- React Query

---

## Structure du projet

Le projet est organisé en plusieurs blocs.

### Application utilisateur

L’application principale se trouve dans :

```text
artifacts/winvesty-app

## Instructions pour reprise du projet dans Replit

Avant toute modification du code, commencer par faire un état des lieux complet du projet.

Objectif : comprendre précisément l’architecture existante, les stacks utilisées, les dossiers importants, les commandes de lancement et les éventuels points de vigilance.

Analyser notamment :

1. La structure générale du repository.
2. Le rôle de chaque dossier principal.
3. Le `package.json` racine.
4. Le fonctionnement du monorepo pnpm.
5. Le dossier `artifacts/winvesty-app`.
6. Le dossier `artifacts/api-server`.
7. Le dossier `artifacts/mockup-sandbox`.
8. Les scripts disponibles.
9. Les dépendances principales.
10. Les variables d’environnement nécessaires.
11. Les commandes exactes pour lancer l’application.
12. Les commandes exactes pour lancer le backend.
13. Les erreurs potentielles au démarrage.
14. Les fichiers à ne surtout pas modifier sans validation.
15. Les fichiers probablement importants pour l’application utilisateur Winvesty.

Ne modifier aucun fichier pendant cette première étape.

À la fin de l’analyse, fournir :

- un résumé clair de l’architecture ;
- la stack exacte utilisée ;
- la commande recommandée pour lancer l’application principale ;
- la commande recommandée pour lancer le backend ;
- les éventuelles incohérences détectées ;
- les prochaines étapes recommandées avant de faire évoluer le projet.
