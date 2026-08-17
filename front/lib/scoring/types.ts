export interface CreditRecord {
  tokenId: number;
  projectType: string;
  certificationStandard: string;
  vintageYear: number;
  location: string;
  qualityScoreOnChain: number;
  priceWei: bigint;
  availableSupply: bigint;
}

export interface ScoredCredit extends CreditRecord {
  ruleScore: number;
  llmScore: number;
  llmRationale: string;
  finalScore: number;
  confidence: "Low" | "Medium" | "High";
}

export type RiskProfile = "Conservative" | "Balanced" | "Aggressive";

export interface PortfolioAllocation {
  tokenId: number;
  amount: number;
  costWei: bigint;
}

export interface PortfolioRecommendation {
  allocations: PortfolioAllocation[];
  totalCostWei: bigint;
  totalTons: number;
  explanation: string;
}
