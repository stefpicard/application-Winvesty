import { InvestorCriteria, Opportunity } from "@/data/mockData";

export interface MatchResult {
  score: number;
  isPriority: boolean;
  isMatch: boolean;
  breakdown: MatchBreakdown;
}

export interface MatchBreakdown {
  sector: number;
  country: number;
  ticket: number;
  stage: number;
  revenue: number;
  operationType: number;
  keywords: number;
}

const THRESHOLDS = {
  match: 50,
  priority: 75,
};

const SCORES = {
  sector: 30,
  country: 20,
  ticket: 20,
  stage: 15,
  revenue: 10,
  operationType: 15,
  keywords: 10,
};

export function calculateMatchScore(
  opportunity: Opportunity,
  criteria: InvestorCriteria
): MatchResult {
  const breakdown: MatchBreakdown = {
    sector: 0,
    country: 0,
    ticket: 0,
    stage: 0,
    revenue: 0,
    operationType: 0,
    keywords: 0,
  };

  if (
    criteria.sectors.some(
      (s) =>
        s.toLowerCase() === opportunity.sector.toLowerCase() ||
        (opportunity.subSector && s.toLowerCase() === opportunity.subSector.toLowerCase())
    )
  ) {
    breakdown.sector = SCORES.sector;
  }

  if (criteria.countries.some((c) => c.toLowerCase() === opportunity.country.toLowerCase())) {
    breakdown.country = SCORES.country;
  }

  if (
    opportunity.amountSoughtValue >= criteria.minTicket &&
    opportunity.amountSoughtValue <= criteria.maxTicket
  ) {
    breakdown.ticket = SCORES.ticket;
  } else if (
    opportunity.amountSoughtValue >= criteria.minTicket * 0.5 &&
    opportunity.amountSoughtValue <= criteria.maxTicket * 2
  ) {
    breakdown.ticket = Math.round(SCORES.ticket * 0.5);
  }

  if (
    criteria.stages.some(
      (s) => s.toLowerCase() === opportunity.stage.toLowerCase()
    )
  ) {
    breakdown.stage = SCORES.stage;
  }

  if (opportunity.revenue !== undefined) {
    if (
      opportunity.revenue >= criteria.minRevenue &&
      opportunity.revenue <= criteria.maxRevenue
    ) {
      breakdown.revenue = SCORES.revenue;
    }
  }

  if (
    criteria.operationTypes.some(
      (t) => t.toLowerCase() === opportunity.operationType.toLowerCase()
    )
  ) {
    breakdown.operationType = SCORES.operationType;
  }

  if (
    criteria.keywords.some(
      (kw) =>
        opportunity.summary.toLowerCase().includes(kw.toLowerCase()) ||
        opportunity.sector.toLowerCase().includes(kw.toLowerCase()) ||
        (opportunity.subSector && opportunity.subSector.toLowerCase().includes(kw.toLowerCase()))
    )
  ) {
    breakdown.keywords = SCORES.keywords;
  }

  const score = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const maxScore = Object.values(SCORES).reduce((a, b) => a + b, 0);
  const normalizedScore = Math.round((score / maxScore) * 100);

  return {
    score: normalizedScore,
    isPriority: normalizedScore >= THRESHOLDS.priority,
    isMatch: normalizedScore >= THRESHOLDS.match,
    breakdown,
  };
}

export function enrichOpportunitiesWithMatch(
  opportunities: Opportunity[],
  criteria: InvestorCriteria | null
): Opportunity[] {
  if (!criteria) return opportunities;
  return opportunities.map((opp) => ({
    ...opp,
    matchScore: calculateMatchScore(opp, criteria).score,
  }));
}

export function sortOpportunities(
  opportunities: Opportunity[],
  sortBy: SortOption
): Opportunity[] {
  return [...opportunities].sort((a, b) => {
    switch (sortBy) {
      case "relevance":
        return (b.matchScore ?? 0) - (a.matchScore ?? 0);
      case "date":
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      case "amount":
        return b.amountSoughtValue - a.amountSoughtValue;
      case "score":
        return b.readinessScore - a.readinessScore;
      default:
        return 0;
    }
  });
}

export type SortOption = "relevance" | "date" | "amount" | "score";

export function generateMatchingNotifications(
  opportunity: Opportunity,
  investorCriteria: InvestorCriteria[]
): Array<{ investorId: string; score: number; isPriority: boolean }> {
  return investorCriteria
    .filter((c) => c.notificationEnabled)
    .map((c) => {
      const result = calculateMatchScore(opportunity, c);
      return { investorId: c.investorId, score: result.score, isPriority: result.isPriority };
    })
    .filter((r) => r.score >= THRESHOLDS.match);
}
