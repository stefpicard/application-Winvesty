export type UserRole = "startup" | "investor_pending" | "investor_validated" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface StartupApplication {
  id: string;
  userId: string;
  companyName: string;
  sector: string;
  country: string;
  amountSought: string;
  stage: string;
  description: string;
  status:
    | "draft"
    | "submitted"
    | "under_review"
    | "winvesty_feedback"
    | "mandate_signed"
    | "wep_label"
    | "published_in_dealroom"
    | "in_contact"
    | "archived"
    | "rejected";
  mandateSigned: boolean;
  wepLabel?: "WEP Access" | "WEP Premium" | "WEP Strategic";
  readinessScore?: number;
  winvestyFeedback?: string;
  documents: StartupDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface StartupDocument {
  id: string;
  name: string;
  type: "pitch_deck" | "teaser" | "business_plan" | "financial_plan" | "legal" | "mandate" | "other";
  status: "received" | "to_complete" | "validated" | "to_correct";
  uploadedAt?: string;
}

export interface StartupScore {
  overall: number;
  dimensions: {
    pitchClarity: number;
    traction: number;
    businessModel: number;
    fundingCoherence: number;
    deckQuality: number;
    financialPreparation: number;
    marketPositioning: number;
    team: number;
    timing: number;
  };
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

export interface InvestorCriteria {
  id: string;
  investorId: string;
  investorType: string;
  sectors: string[];
  countries: string[];
  minTicket: number;
  maxTicket: number;
  stages: string[];
  minRevenue: number;
  maxRevenue: number;
  minEbitda: number;
  operationTypes: string[];
  preferredGrowthProfile: string[];
  excludedSectors: string[];
  keywords: string[];
  notificationEnabled: boolean;
}

export type WEPBadge = "WEP Access" | "WEP Premium" | "WEP Strategic";
export type OperationType = "Levée de fonds" | "M&A" | "Cession" | "Acquisition" | "Rapprochement";

export interface Opportunity {
  id: string;
  companyName: string;
  logo?: string;
  sector: string;
  subSector?: string;
  country: string;
  city?: string;
  amountSought: string;
  amountSoughtValue: number;
  stage: string;
  operationType: OperationType;
  summary: string;
  marketDescription?: string;
  tractionDescription?: string;
  teamDescription?: string;
  financingHistory?: string;
  readinessScore: number;
  badge: WEPBadge;
  winvestyOpinion: string;
  winvestyStrengths?: string[];
  winvestyWarnings?: string[];
  winvestyRecommendation?: string;
  documentsAvailable: string[];
  revenue?: number;
  ebitda?: number;
  growthRate?: number;
  employees?: number;
  founded?: number;
  mandateSigned: boolean;
  visibleInDealRoom: boolean;
  isConfidential?: boolean;
  publishedAt: string;
  status: "published_in_dealroom" | "archived";
  isSaved?: boolean;
  matchScore?: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type:
    | "new_matching_opportunity"
    | "startup_published"
    | "connection_request_update"
    | "profile_validation"
    | "dealroom_update"
    | "new_deck_available"
    | "confidential_available"
    | "winvesty_opinion_added";
  title: string;
  message: string;
  relatedOpportunityId?: string;
  isRead: boolean;
  priority: "normal" | "high";
  createdAt: string;
}

export const mockUser: UserProfile = {
  id: "user-investor-1",
  name: "Alexandre Dupont",
  email: "alexandre@fund.fr",
  role: "investor_validated",
};

export const mockStartupUser: UserProfile = {
  id: "user-startup-1",
  name: "Marie Laurent",
  email: "marie@techstartup.fr",
  role: "startup",
};

export const mockAdminUser: UserProfile = {
  id: "user-admin-1",
  name: "Admin Winvesty",
  email: "admin@winvesty.fr",
  role: "admin",
};

export const mockInvestorCriteria: InvestorCriteria = {
  id: "crit-1",
  investorId: "user-investor-1",
  investorType: "VC",
  sectors: ["Intelligence Artificielle", "Fintech", "Santé"],
  countries: ["France", "Belgique", "Suisse"],
  minTicket: 500000,
  maxTicket: 5000000,
  stages: ["Seed", "Série A"],
  minRevenue: 0,
  maxRevenue: 10000000,
  minEbitda: 0,
  operationTypes: ["Levée de fonds"],
  preferredGrowthProfile: ["En croissance"],
  excludedSectors: [],
  keywords: ["SaaS", "IA", "plateforme"],
  notificationEnabled: true,
};

export const mockOpportunities: Opportunity[] = [
  {
    id: "opp-1",
    companyName: "NovaTech Solutions",
    sector: "Intelligence Artificielle",
    subSector: "RH & Automatisation",
    country: "France",
    city: "Paris",
    amountSought: "3,5 M€",
    amountSoughtValue: 3500000,
    stage: "Série A",
    operationType: "Levée de fonds",
    summary:
      "Plateforme SaaS d'automatisation des processus RH propulsée par l'IA, déjà déployée chez 120 entreprises. Solution verticale adressant un marché mondial de 400 Mds€.",
    marketDescription:
      "Le marché mondial des logiciels RH atteint 400 Mds€ avec une croissance annuelle de 12%. NovaTech cible d'abord les ETI françaises (15 000 cibles) avant une expansion européenne.",
    tractionDescription:
      "120 clients actifs, NRR de 115%, 12 M€ ARR en croissance de +145% YoY. Churn < 3%. Pipeline qualifié de 8 M€ ARR.",
    teamDescription:
      "Équipe de 45 personnes. CEO ex-Oracle 12 ans. CTO cofondateur, PhD en ML. CPO ex-Workday. 4 membres du board avec exits >50M€.",
    financingHistory:
      "Seed de 800K€ en 2023 (BPIFrance + business angels). Série A actuelle de 3,5M€ pour accélérer les ventes et l'internationalisation.",
    readinessScore: 87,
    badge: "WEP Strategic",
    winvestyOpinion:
      "Dossier très solide. Traction commerciale réelle et équipe expérimentée. Le NRR de 115% démontre une vraie valeur produit. Modèle économique SaaS récurrent avec des métriques exemplaires pour le stade.",
    winvestyStrengths: [
      "Traction commerciale exceptionnelle",
      "NRR > 100% prouvé",
      "Équipe senior avec track record",
      "Marché addressable massif",
    ],
    winvestyWarnings: ["Compétition US à surveiller", "Internationalisation à valider"],
    winvestyRecommendation: "Fortement recommandé pour investisseurs Série A tech B2B.",
    documentsAvailable: ["Executive Summary", "Business Plan", "Pitch Deck", "Financiers"],
    revenue: 1200000,
    ebitda: -200000,
    growthRate: 145,
    employees: 45,
    founded: 2022,
    mandateSigned: true,
    visibleInDealRoom: true,
    publishedAt: "2026-04-28",
    status: "published_in_dealroom",
    isSaved: false,
  },
  {
    id: "opp-2",
    companyName: "GreenFin Capital",
    sector: "Fintech",
    subSector: "ESG & Reporting",
    country: "Belgique",
    city: "Bruxelles",
    amountSought: "8 M€",
    amountSoughtValue: 8000000,
    stage: "Série B",
    operationType: "Levée de fonds",
    summary:
      "Solution de reporting ESG réglementaire pour institutions financières. Clients : 3 grandes banques européennes. Croissance x3 depuis 2024.",
    marketDescription:
      "Marché du reporting ESG en explosion suite à la directive CSRD. 50 000 entreprises concernées en Europe d'ici 2026. Marché estimé à 12 Mds€.",
    tractionDescription:
      "3 grandes banques clientes (dont 2 du top 10 européen), 2,1M€ ARR, pipeline de 5M€ ARR. Taux de renouvellement 100%.",
    teamDescription:
      "Fondateurs ex-KPMG et ex-BNP Paribas. Équipe de 28 personnes dont 8 experts réglementaires.",
    financingHistory: "Série A de 3M€ en 2024. Série B actuelle pour scaling commercial et expansion UK/DE.",
    readinessScore: 82,
    badge: "WEP Premium",
    winvestyOpinion:
      "Timing parfait avec l'entrée en vigueur de la CSRD. Clients de référence très rassurants. La réglementation est un tailwind puissant.",
    winvestyStrengths: [
      "Clients bancaires de référence",
      "Réglementation favorable CSRD",
      "Recurring revenue 100% retention",
    ],
    winvestyWarnings: ["Risque réglementaire si assouplissement", "Compétiteurs établis (MSCI, Bloomberg)"],
    winvestyRecommendation: "Recommandé pour investisseurs Fintech/ESG.",
    documentsAvailable: ["Pitch Deck", "Executive Summary", "Financiers"],
    revenue: 2100000,
    ebitda: 150000,
    growthRate: 210,
    employees: 28,
    founded: 2023,
    mandateSigned: true,
    visibleInDealRoom: true,
    publishedAt: "2026-04-25",
    status: "published_in_dealroom",
    isSaved: false,
  },
  {
    id: "opp-3",
    companyName: "MedPulse Health",
    sector: "Santé",
    subSector: "Digital Health",
    country: "France",
    city: "Lyon",
    amountSought: "2,5 M€",
    amountSoughtValue: 2500000,
    stage: "Seed",
    operationType: "Levée de fonds",
    summary:
      "Application de suivi et prévention des maladies chroniques intégrant wearables et IA prédictive. 8 000 patients actifs. Partenariat avec 3 mutuelles.",
    marketDescription:
      "Marché de la santé numérique : 660 Mds$ en 2025, CAGR 28%. Les maladies chroniques représentent 80% des dépenses de santé.",
    tractionDescription:
      "8 000 patients actifs, taux de rétention 78% à 12 mois. 3 partenariats mutuelles signés. Résultats cliniques validés (-23% hospitalisations).",
    teamDescription:
      "CEO médecin-chercheur, ex-AP-HP. CTO PhD en IA santé. Équipe de 18 personnes incluant 4 médecins.",
    financingHistory: "Amorçage BPI 300K€ + love money 200K€. Seed actuel pour industrialisation.",
    readinessScore: 71,
    badge: "WEP Premium",
    winvestyOpinion:
      "Bonne validation clinique et partenariats prometteurs. L'équipe médicale rassure. Le modèle B2B2C via mutuelles est le bon go-to-market.",
    winvestyStrengths: [
      "Validation clinique solide",
      "Partenariats mutuelles actifs",
      "Équipe médicale crédible",
    ],
    winvestyWarnings: [
      "Chemin vers la rentabilité long",
      "Réglementation santé complexe",
      "Ticket modeste pour le secteur",
    ],
    winvestyRecommendation: "Recommandé pour investisseurs Digital Health.",
    documentsAvailable: ["Pitch Deck", "Executive Summary"],
    revenue: 180000,
    ebitda: -420000,
    growthRate: 320,
    employees: 18,
    founded: 2024,
    mandateSigned: false,
    visibleInDealRoom: true,
    publishedAt: "2026-04-20",
    status: "published_in_dealroom",
    isSaved: false,
  },
  {
    id: "opp-4",
    companyName: "LogiSmart",
    sector: "Logistique",
    subSector: "Supply Chain",
    country: "France",
    city: "Marseille",
    amountSought: "12 M€",
    amountSoughtValue: 12000000,
    stage: "Série B",
    operationType: "M&A",
    summary:
      "Leader des solutions de supply chain intelligente pour la grande distribution. CA 8,5M€. Rentable depuis 2024. Cession partielle envisagée.",
    marketDescription:
      "Logistique intelligente : 50 Mds€ en Europe. Clients grande distribution très demandeurs post-Covid.",
    tractionDescription:
      "CA 8,5M€, croissance +35%, EBITDA +18%. 45 clients grande distribution dont 3 du top 10 français.",
    teamDescription:
      "Fondateurs ex-Geodis et ex-Carrefour. Équipe 120 personnes. Management solide en place.",
    financingHistory: "Croissance organique. Pas de levée externe. Cession partielle actuelle.",
    readinessScore: 90,
    badge: "WEP Strategic",
    winvestyOpinion:
      "Dossier exceptionnel. Rentabilité réelle, traction prouvée, marché défensif. Opportunité rare pour investisseurs M&A.",
    winvestyStrengths: [
      "Rentable et cash-flow positif",
      "Leadership marché établi",
      "Clients grande distribution fidèles",
    ],
    winvestyWarnings: ["Valorisation élevée", "Marché mature"],
    winvestyRecommendation: "Fortement recommandé pour investisseurs M&A/growth.",
    documentsAvailable: ["Information Memorandum", "Financiers", "Audit préliminaire"],
    revenue: 8500000,
    ebitda: 1530000,
    growthRate: 35,
    employees: 120,
    founded: 2019,
    mandateSigned: true,
    visibleInDealRoom: true,
    publishedAt: "2026-04-15",
    status: "published_in_dealroom",
    isSaved: false,
  },
  {
    id: "opp-5",
    companyName: "PropTech Immo",
    sector: "Immobilier",
    subSector: "Real Estate Tech",
    country: "Suisse",
    city: "Genève",
    amountSought: "5 M€",
    amountSoughtValue: 5000000,
    stage: "Série A",
    operationType: "Levée de fonds",
    summary:
      "Plateforme d'investissement immobilier fractionné pour family offices. AUM de 45M€ géré. Certifié FINMA.",
    marketDescription:
      "L'immobilier fractionné est en plein essor en Europe. Marché adressable 200 Mds€. Réglementation favorable en Suisse.",
    tractionDescription:
      "45M€ AUM, 340 investisseurs actifs, rendement moyen 7,2% annuel. 12 projets finalisés.",
    teamDescription:
      "Fondateurs ex-UBS et ex-Credit Suisse. Régulé FINMA. Équipe de 22 personnes.",
    financingHistory: "Seed 1,5M€ en 2024. Série A pour développement produit et expansion européenne.",
    readinessScore: 78,
    badge: "WEP Premium",
    winvestyOpinion:
      "Profil rassurant avec cadre réglementaire suisse. AUM en croissance. Niche à fort potentiel en Europe.",
    winvestyStrengths: [
      "Régulation FINMA",
      "Track record de 12 projets",
      "Équipe banque privée",
    ],
    winvestyWarnings: ["Dépendant du marché immobilier", "Scalabilité à prouver"],
    winvestyRecommendation: "Recommandé pour family offices et investisseurs immobilier.",
    documentsAvailable: ["Pitch Deck", "Track Record", "Rapport FINMA"],
    revenue: 680000,
    ebitda: 120000,
    growthRate: 88,
    employees: 22,
    founded: 2023,
    mandateSigned: true,
    visibleInDealRoom: true,
    publishedAt: "2026-04-10",
    status: "published_in_dealroom",
    isSaved: false,
  },
  {
    id: "opp-6",
    companyName: "Projet Confidentiel Alpha",
    sector: "Intelligence Artificielle",
    subSector: "Infrastructures IA",
    country: "France",
    city: "Paris",
    amountSought: "15–25 M€",
    amountSoughtValue: 20000000,
    stage: "Série B",
    operationType: "Levée de fonds",
    summary:
      "Opportunité confidentielle. Accès sur validation Winvesty uniquement. Leader européen de son segment, en croissance de +180% YoY.",
    readinessScore: 94,
    badge: "WEP Strategic",
    winvestyOpinion: "Dossier d'exception réservé aux investisseurs Winvesty Strategic.",
    winvestyStrengths: [],
    winvestyWarnings: [],
    documentsAvailable: [],
    growthRate: 180,
    mandateSigned: true,
    visibleInDealRoom: true,
    isConfidential: true,
    publishedAt: "2026-04-30",
    status: "published_in_dealroom",
    isSaved: false,
  },
  {
    id: "opp-7",
    companyName: "Projet Confidentiel Beta",
    sector: "Santé",
    subSector: "Biotech",
    country: "Suisse",
    city: "Lausanne",
    amountSought: "30–50 M€",
    amountSoughtValue: 40000000,
    stage: "Série C+",
    operationType: "M&A",
    summary:
      "Opération M&A confidentielle dans le secteur Biotech. Actif stratégique recherché par plusieurs fonds de premier plan.",
    readinessScore: 96,
    badge: "WEP Strategic",
    winvestyOpinion: "Réservé aux investisseurs qualifiés WEP Strategic.",
    winvestyStrengths: [],
    winvestyWarnings: [],
    documentsAvailable: [],
    mandateSigned: true,
    visibleInDealRoom: true,
    isConfidential: true,
    publishedAt: "2026-05-01",
    status: "published_in_dealroom",
    isSaved: false,
  },
];

export const mockStartupApplication: StartupApplication = {
  id: "app-1",
  userId: "user-startup-1",
  companyName: "TechVision AI",
  sector: "Intelligence Artificielle",
  country: "France",
  amountSought: "2 M€",
  stage: "Seed",
  description: "Plateforme d'analyse prédictive pour le retail.",
  status: "winvesty_feedback",
  mandateSigned: false,
  readinessScore: 64,
  winvestyFeedback:
    "Votre dossier a été analysé par nos équipes. Points forts : technologie différenciante, marché adressable clair. À renforcer : projections financières à consolider, profil commercial manquant.",
  documents: [
    { id: "doc-1", name: "Pitch Deck", type: "pitch_deck", status: "validated", uploadedAt: "2026-04-15" },
    { id: "doc-2", name: "Executive Summary", type: "teaser", status: "validated", uploadedAt: "2026-04-15" },
    { id: "doc-3", name: "Business Plan", type: "business_plan", status: "to_correct", uploadedAt: "2026-04-18" },
    { id: "doc-4", name: "Prévisionnel Financier", type: "financial_plan", status: "to_complete" },
    { id: "doc-5", name: "Mandat Winvesty", type: "mandate", status: "to_complete" },
  ],
  createdAt: "2026-04-10",
  updatedAt: "2026-04-28",
};

export const mockStartupScore: StartupScore = {
  overall: 64,
  dimensions: {
    pitchClarity: 78,
    traction: 55,
    businessModel: 70,
    fundingCoherence: 65,
    deckQuality: 82,
    financialPreparation: 45,
    marketPositioning: 72,
    team: 60,
    timing: 68,
  },
  strengths: [
    "Technologie différenciante et brevetable",
    "Marché adressable bien défini (TAM 12 Mds€)",
    "Pitch deck de qualité professionnelle",
    "Positionnement marché clair",
  ],
  improvements: [
    "Projections financières à consolider (P&L détaillé 3 ans)",
    "Traction commerciale limitée (0 clients payants)",
    "Équipe à compléter : profil commercial senior manquant",
    "Prévisionnel de trésorerie non transmis",
  ],
  recommendations: [
    "Compléter le prévisionnel financier en priorité",
    "Recruter un Head of Sales avant la Deal Room",
    "Signer le mandat Winvesty pour accélérer le processus",
    "Ajouter 2–3 lettres d'intention ou pilotes clients",
  ],
};

export const mockNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    userId: "user-investor-1",
    type: "new_matching_opportunity",
    title: "Nouvelle opportunité qualifiée",
    message:
      "NovaTech Solutions, levée de fonds Série A, vient d'intégrer la Deal Room et correspond à 91% à vos critères. Score WEP : 87/100.",
    relatedOpportunityId: "opp-1",
    isRead: false,
    priority: "high",
    createdAt: "2026-04-28T10:30:00Z",
  },
  {
    id: "notif-2",
    userId: "user-investor-1",
    type: "new_matching_opportunity",
    title: "Nouvelle opportunité ESG Fintech",
    message:
      "GreenFin Capital (Fintech ESG, Série B, Belgique) correspond à 74% à vos critères d'investissement.",
    relatedOpportunityId: "opp-2",
    isRead: false,
    priority: "normal",
    createdAt: "2026-04-25T14:00:00Z",
  },
  {
    id: "notif-3",
    userId: "user-investor-1",
    type: "confidential_available",
    title: "Opportunité confidentielle disponible",
    message:
      "Une opportunité stratégique (IA, Série B, France, 15–25 M€) est disponible pour les investisseurs WEP Strategic. Demandez l'accès.",
    relatedOpportunityId: "opp-6",
    isRead: false,
    priority: "high",
    createdAt: "2026-04-30T09:00:00Z",
  },
  {
    id: "notif-4",
    userId: "user-investor-1",
    type: "new_deck_available",
    title: "Nouveau deck disponible",
    message: "MedPulse Health a mis à jour son pitch deck. Consultez le dossier mis à jour.",
    relatedOpportunityId: "opp-3",
    isRead: true,
    priority: "normal",
    createdAt: "2026-04-20T16:45:00Z",
  },
  {
    id: "notif-5",
    userId: "user-investor-1",
    type: "winvesty_opinion_added",
    title: "Avis Winvesty publié",
    message:
      "L'équipe Winvesty a publié son analyse sur LogiSmart. Score WEP : 90/100. Dossier exceptionnel.",
    relatedOpportunityId: "opp-4",
    isRead: true,
    priority: "normal",
    createdAt: "2026-04-15T11:20:00Z",
  },
];
