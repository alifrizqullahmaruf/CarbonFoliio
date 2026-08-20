/**
 * Client-side shapes for the JSON the API routes actually return — bigint
 * fields are serialized to strings over the wire, so these are distinct
 * from the server-side types in ./types.ts, not aliases of them.
 */

export interface ScoredCreditDTO {
  tokenId: number;
  projectType: string;
  certificationStandard: string;
  vintageYear: number;
  location: string;
  qualityScoreOnChain: number;
  priceWei: string;
  availableSupply: string;
  ruleScore: number;
  llmScore: number;
  llmRationale: string;
  finalScore: number;
  confidence: "Low" | "Medium" | "High";
}

export interface AllocationDTO {
  tokenId: number;
  amount: number;
  costWei: string;
  projectType?: string;
  certificationStandard?: string;
  ruleScore?: number;
  llmScore?: number;
  llmRationale?: string;
  finalScore?: number;
  confidence?: string;
}

export interface RecommendResponseDTO {
  allocations: AllocationDTO[];
  totalCostWei: string;
  totalTons: number;
  shortfall: number;
  explanation: string;
}
