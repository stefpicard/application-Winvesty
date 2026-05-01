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
  status: "draft" | "pending" | "validated" | "published";
  createdAt: string;
}

export interface InvestorProfile {
  id: string;
  userId: string;
  type: "VC" | "Business Angel" | "Family Office" | "Corporate VC";
  minTicket: string;
  maxTicket: string;
  sectors: string[];
  geographies: string[];
  stages: string[];
  status: "pending" | "validated";
}

export type WEPBadge = "WEP Access" | "WEP Premium" | "WEP Strategic";

export interface Opportunity {
  id: string;
  companyName: string;
  logo?: string;
  sector: string;
  country: string;
  amountSought: string;
  stage: string;
  summary: string;
  readinessScore: number;
  badge: WEPBadge;
  winvestyOpinion: string;
  documentsAvailable: string[];
  isSaved?: boolean;
}

export interface Notification {
  id: string;
  type: "validated" | "opportunity" | "connection" | "status";
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export const mockOpportunities: Opportunity[] = [
  {
    id: "opp-1",
    companyName: "NovaTech Solutions",
    sector: "Intelligence Artificielle",
    country: "France",
    amountSought: "3,5 M€",
    stage: "Série A",
    summary: "Plateforme SaaS d'automatisation des processus RH propulsée par l'IA, déjà déployée chez 120 entreprises.",
    readinessScore: 87,
    badge: "WEP Strategic",
    winvestyOpinion: "Dossier très solide. Traction commerciale réelle et équipe expérimentée. Recommandé pour investissement.",
    documentsAvailable: ["Executive Summary", "Business Plan", "Pitch Deck", "Financiers"],
    isSaved: false,
  },
  {
    id: "opp-2",
    companyName: "GreenFin Capital",
    sector: "Fintech / ESG",
    country: "Belgique",
    amountSought: "8 M€",
    stage: "Série B",
    summary: "Infrastructure de reporting ESG pour les fonds d'investissement. Certifié AMF. Croissance 340% en 18 mois.",
    readinessScore: 92,
    badge: "WEP Premium",
    winvestyOpinion: "Positionnement unique sur un marché en forte croissance réglementaire. Due diligence recommandée.",
    documentsAvailable: ["Executive Summary", "Pitch Deck", "Modèle Financier", "Certifications"],
    isSaved: true,
  },
  {
    id: "opp-3",
    companyName: "MedTech Innov",
    sector: "Santé / MedTech",
    country: "Suisse",
    amountSought: "1,2 M€",
    stage: "Seed",
    summary: "Dispositif médical de télésurveillance des patients chroniques. Marquage CE obtenu. Pilote en cours avec 3 CHU.",
    readinessScore: 74,
    badge: "WEP Access",
    winvestyOpinion: "Stade early mais fort potentiel réglementaire. Ticket adapté pour des investisseurs early-stage.",
    documentsAvailable: ["Executive Summary", "Pitch Deck"],
    isSaved: false,
  },
  {
    id: "opp-4",
    companyName: "LogiStack",
    sector: "Logistique / Supply Chain",
    country: "France",
    amountSought: "5 M€",
    stage: "Série A",
    summary: "OS logistique pour les PME industrielles. Intégrations ERP natives. 45 clients en 24 mois.",
    readinessScore: 81,
    badge: "WEP Premium",
    winvestyOpinion: "Excellente rétention clients et modèle récurrent. Marché sous-digitalisé avec forte opportunité.",
    documentsAvailable: ["Executive Summary", "Business Plan", "Pitch Deck", "Financiers", "Références clients"],
    isSaved: false,
  },
  {
    id: "opp-5",
    companyName: "EnergyFlow",
    sector: "Cleantech / Énergie",
    country: "Allemagne",
    amountSought: "12 M€",
    stage: "Série B",
    summary: "Réseau intelligent de recharge pour flottes électriques B2B. Partenariat signé avec 2 constructeurs automobiles.",
    readinessScore: 89,
    badge: "WEP Strategic",
    winvestyOpinion: "Timing parfait avec les obligations de transition énergétique. Dossier d'excellence.",
    documentsAvailable: ["Executive Summary", "Pitch Deck", "Modèle Financier", "Term Sheet modèle"],
    isSaved: false,
  },
  {
    id: "opp-6",
    companyName: "PropTech Hub",
    sector: "Immobilier / PropTech",
    country: "France",
    amountSought: "2 M€",
    stage: "Seed",
    summary: "Plateforme de gestion locative nouvelle génération pour investisseurs particuliers. 12 000 utilisateurs actifs.",
    readinessScore: 68,
    badge: "WEP Access",
    winvestyOpinion: "Bonne adoption marché. Modèle économique à affiner mais communauté engagée.",
    documentsAvailable: ["Executive Summary", "Pitch Deck"],
    isSaved: false,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "validated",
    title: "Dossier validé",
    message: "Votre dossier NovaTech Solutions a été validé par l'équipe Winvesty et est maintenant visible dans la Deal Room.",
    date: "2026-04-30",
    read: false,
  },
  {
    id: "notif-2",
    type: "opportunity",
    title: "Nouvelle opportunité",
    message: "Une nouvelle opportunité dans le secteur FinTech correspondant à vos critères vient d'être publiée.",
    date: "2026-04-29",
    read: false,
  },
  {
    id: "notif-3",
    type: "connection",
    title: "Demande de mise en relation",
    message: "Un investisseur qualifié souhaite entrer en contact avec votre startup. Consultez votre espace.",
    date: "2026-04-28",
    read: true,
  },
  {
    id: "notif-4",
    type: "status",
    title: "Statut modifié",
    message: "Votre profil investisseur a été validé. Vous avez désormais accès à l'ensemble de la Deal Room.",
    date: "2026-04-27",
    read: true,
  },
  {
    id: "notif-5",
    type: "opportunity",
    title: "Nouvelle opportunité",
    message: "EnergyFlow, Série B Cleantech — dossier WEP Strategic disponible en Deal Room.",
    date: "2026-04-25",
    read: true,
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

export const mockStartupApplication: StartupApplication = {
  id: "app-1",
  userId: "user-2",
  companyName: "NovaTech Solutions",
  sector: "Intelligence Artificielle",
  country: "France",
  amountSought: "3 500 000",
  stage: "Série A",
  description: "Plateforme SaaS d'automatisation des processus RH propulsée par l'IA générative.",
  status: "validated",
  createdAt: "2026-03-15",
};
