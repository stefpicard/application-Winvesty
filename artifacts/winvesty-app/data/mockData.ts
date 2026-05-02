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
  status: "draft" | "submitted" | "under_review" | "mandate_signed" | "published_in_dealroom" | "archived" | "rejected";
  mandateSigned: boolean;
  createdAt: string;
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
  readinessScore: number;
  badge: WEPBadge;
  winvestyOpinion: string;
  documentsAvailable: string[];
  revenue?: number;
  ebitda?: number;
  growthRate?: number;
  mandateSigned: boolean;
  visibleInDealRoom: boolean;
  publishedAt: string;
  status: "published_in_dealroom" | "archived";
  isSaved?: boolean;
  matchScore?: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: "new_matching_opportunity" | "startup_published" | "connection_request_update" | "profile_validation" | "dealroom_update";
  title: string;
  message: string;
  relatedOpportunityId?: string;
  isRead: boolean;
  priority: "normal" | "high";
  createdAt: string;
}

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
    summary: "Plateforme SaaS d'automatisation des processus RH propulsée par l'IA, déjà déployée chez 120 entreprises.",
    readinessScore: 87,
    badge: "WEP Strategic",
    winvestyOpinion: "Dossier très solide. Traction commerciale réelle et équipe expérimentée. Recommandé pour investissement.",
    documentsAvailable: ["Executive Summary", "Business Plan", "Pitch Deck", "Financiers"],
    revenue: 1200000,
    ebitda: -200000,
    growthRate: 145,
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
    summary: "Infrastructure de reporting ESG pour les fonds d'investissement. Certifié AMF. Croissance 340% en 18 mois.",
    readinessScore: 92,
    badge: "WEP Premium",
    winvestyOpinion: "Positionnement unique sur un marché en forte croissance réglementaire. Due diligence recommandée.",
    documentsAvailable: ["Executive Summary", "Pitch Deck", "Modèle Financier", "Certifications"],
    revenue: 2800000,
    ebitda: 420000,
    growthRate: 340,
    mandateSigned: true,
    visibleInDealRoom: true,
    publishedAt: "2026-04-29",
    status: "published_in_dealroom",
    isSaved: true,
  },
  {
    id: "opp-3",
    companyName: "MedTech Innov",
    sector: "Santé",
    subSector: "Dispositifs médicaux",
    country: "Suisse",
    city: "Genève",
    amountSought: "1,2 M€",
    amountSoughtValue: 1200000,
    stage: "Seed",
    operationType: "Levée de fonds",
    summary: "Dispositif médical de télésurveillance des patients chroniques. Marquage CE obtenu. Pilote en cours avec 3 CHU.",
    readinessScore: 74,
    badge: "WEP Access",
    winvestyOpinion: "Stade early mais fort potentiel réglementaire. Ticket adapté pour des investisseurs early-stage.",
    documentsAvailable: ["Executive Summary", "Pitch Deck"],
    revenue: 180000,
    ebitda: undefined,
    growthRate: 85,
    mandateSigned: true,
    visibleInDealRoom: true,
    publishedAt: "2026-04-25",
    status: "published_in_dealroom",
    isSaved: false,
  },
  {
    id: "opp-4",
    companyName: "LogiStack",
    sector: "Logistique",
    subSector: "Supply Chain",
    country: "France",
    city: "Lyon",
    amountSought: "5 M€",
    amountSoughtValue: 5000000,
    stage: "Série A",
    operationType: "Levée de fonds",
    summary: "OS logistique pour les PME industrielles. Intégrations ERP natives. 45 clients en 24 mois.",
    readinessScore: 81,
    badge: "WEP Premium",
    winvestyOpinion: "Excellente rétention clients et modèle récurrent. Marché sous-digitalisé avec forte opportunité.",
    documentsAvailable: ["Executive Summary", "Business Plan", "Pitch Deck", "Financiers", "Références clients"],
    revenue: 3400000,
    ebitda: 680000,
    growthRate: 120,
    mandateSigned: true,
    visibleInDealRoom: true,
    publishedAt: "2026-04-20",
    status: "published_in_dealroom",
    isSaved: false,
  },
  {
    id: "opp-5",
    companyName: "EnergyFlow",
    sector: "Cleantech",
    subSector: "Mobilité électrique",
    country: "Allemagne",
    city: "Munich",
    amountSought: "12 M€",
    amountSoughtValue: 12000000,
    stage: "Série B",
    operationType: "Levée de fonds",
    summary: "Réseau intelligent de recharge pour flottes électriques B2B. Partenariat signé avec 2 constructeurs automobiles.",
    readinessScore: 89,
    badge: "WEP Strategic",
    winvestyOpinion: "Timing parfait avec les obligations de transition énergétique. Dossier d'excellence.",
    documentsAvailable: ["Executive Summary", "Pitch Deck", "Modèle Financier", "Term Sheet modèle"],
    revenue: 4200000,
    ebitda: -800000,
    growthRate: 290,
    mandateSigned: true,
    visibleInDealRoom: true,
    publishedAt: "2026-04-30",
    status: "published_in_dealroom",
    isSaved: false,
  },
  {
    id: "opp-6",
    companyName: "PropTech Hub",
    sector: "Immobilier",
    subSector: "Gestion locative",
    country: "France",
    city: "Bordeaux",
    amountSought: "2 M€",
    amountSoughtValue: 2000000,
    stage: "Seed",
    operationType: "Levée de fonds",
    summary: "Plateforme de gestion locative nouvelle génération pour investisseurs particuliers. 12 000 utilisateurs actifs.",
    readinessScore: 68,
    badge: "WEP Access",
    winvestyOpinion: "Bonne adoption marché. Modèle économique à affiner mais communauté engagée.",
    documentsAvailable: ["Executive Summary", "Pitch Deck"],
    revenue: 420000,
    ebitda: undefined,
    growthRate: 65,
    mandateSigned: true,
    visibleInDealRoom: true,
    publishedAt: "2026-04-15",
    status: "published_in_dealroom",
    isSaved: false,
  },
  {
    id: "opp-7",
    companyName: "RetailTech Group",
    sector: "Commerce",
    subSector: "Retail Tech",
    country: "France",
    city: "Paris",
    amountSought: "22 M€",
    amountSoughtValue: 22000000,
    stage: "M&A",
    operationType: "M&A",
    summary: "Groupe de 3 enseignes retail spécialisées. EBITDA positif. Recherche repreneur stratégique ou fonds.",
    readinessScore: 84,
    badge: "WEP Strategic",
    winvestyOpinion: "Profil M&A rare. Valorisation attractive. Dossier complet avec données auditées.",
    documentsAvailable: ["Teaser", "Information Memorandum", "Comptes audités", "Données opérationnelles"],
    revenue: 18000000,
    ebitda: 2100000,
    growthRate: 12,
    mandateSigned: true,
    visibleInDealRoom: true,
    publishedAt: "2026-05-01",
    status: "published_in_dealroom",
    isSaved: false,
  },
];

export const mockInvestorCriteria: InvestorCriteria = {
  id: "crit-1",
  investorId: "user-1",
  investorType: "Business Angel",
  sectors: ["Intelligence Artificielle", "Fintech", "Cleantech"],
  countries: ["France", "Belgique", "Suisse"],
  minTicket: 100000,
  maxTicket: 5000000,
  stages: ["Série A", "Série B"],
  minRevenue: 500000,
  maxRevenue: 10000000,
  minEbitda: -500000,
  operationTypes: ["Levée de fonds"],
  preferredGrowthProfile: ["En croissance"],
  excludedSectors: ["Jeux", "Tabac"],
  keywords: ["SaaS", "IA", "ESG"],
  notificationEnabled: true,
};

export const mockNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    userId: "user-1",
    type: "new_matching_opportunity",
    title: "Nouvelle opportunité qualifiée",
    message: "EnergyFlow vient d'intégrer la Deal Room et correspond à vos critères d'investissement. Score de compatibilité : 85/100.",
    relatedOpportunityId: "opp-5",
    isRead: false,
    priority: "high",
    createdAt: "2026-04-30T09:15:00Z",
  },
  {
    id: "notif-2",
    userId: "user-1",
    type: "new_matching_opportunity",
    title: "Nouvelle opportunité correspondant à vos critères",
    message: "GreenFin Capital, Fintech ESG Série B, a été publiée dans la Deal Room Winvesty.",
    relatedOpportunityId: "opp-2",
    isRead: false,
    priority: "normal",
    createdAt: "2026-04-29T14:30:00Z",
  },
  {
    id: "notif-3",
    userId: "user-1",
    type: "profile_validation",
    title: "Profil investisseur validé",
    message: "Votre profil investisseur a été validé. Vous avez désormais accès à l'ensemble de la Deal Room.",
    isRead: false,
    priority: "normal",
    createdAt: "2026-04-27T10:00:00Z",
  },
  {
    id: "notif-4",
    userId: "user-1",
    type: "connection_request_update",
    title: "Mise en relation acceptée",
    message: "NovaTech Solutions a accepté votre demande de mise en relation. L'équipe Winvesty vous contactera sous 48h.",
    relatedOpportunityId: "opp-1",
    isRead: true,
    priority: "normal",
    createdAt: "2026-04-26T16:45:00Z",
  },
  {
    id: "notif-5",
    userId: "user-1",
    type: "dealroom_update",
    title: "Mise à jour Deal Room",
    message: "RetailTech Group — dossier M&A WEP Strategic vient d'être publié en Deal Room.",
    relatedOpportunityId: "opp-7",
    isRead: true,
    priority: "normal",
    createdAt: "2026-05-01T08:00:00Z",
  },
];

export const mockUser: UserProfile = {
  id: "user-1",
  name: "Alexandre Moreau",
  email: "alexandre.moreau@example.com",
  role: "investor_validated",
};

export const mockStartupUser: UserProfile = {
  id: "user-2",
  name: "Sophie Dubois",
  email: "sophie.dubois@example.com",
  role: "startup",
};

export const mockAdminUser: UserProfile = {
  id: "user-admin",
  name: "Admin Winvesty",
  email: "admin@winvesty.com",
  role: "admin",
};

export const mockStartupApplication: StartupApplication = {
  id: "app-1",
  userId: "user-2",
  companyName: "NovaTech Solutions",
  sector: "Intelligence Artificielle",
  country: "France",
  amountSought: "3 500 000",
  stage: "Série A",
  description: "Plateforme SaaS d'automatisation des processus RH propulsée par l'IA générative.",
  status: "published_in_dealroom",
  mandateSigned: true,
  createdAt: "2026-03-15",
};
