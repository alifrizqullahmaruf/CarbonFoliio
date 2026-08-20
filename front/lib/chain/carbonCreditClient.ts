import { createPublicClient, http, type Address } from "viem";
import type { CreditRecord } from "../scoring/types";

const mockCarbonCreditAbi = [
  {
    type: "function",
    name: "nextTokenId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "creditMetadata",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [
      { name: "projectType", type: "string" },
      { name: "certificationStandard", type: "string" },
      { name: "vintageYear", type: "uint16" },
      { name: "location", type: "string" },
      { name: "qualityScore", type: "uint8" },
      { name: "exists", type: "bool" },
    ],
  },
  {
    type: "function",
    name: "priceWei",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "availableSupply",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

/** The public X Layer testnet RPC is rate-limited and occasionally drops a request; retry before surfacing an error. */
async function withRetry<T>(fn: () => Promise<T>, attempts = 3, delayMs = 400): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
      }
    }
  }
  throw lastError;
}

export function createCarbonCreditReader(rpcUrl: string, contractAddress: Address) {
  const publicClient = createPublicClient({ transport: http(rpcUrl) });

  async function listAvailableCredits(): Promise<CreditRecord[]> {
    const nextTokenId = await withRetry(() =>
      publicClient.readContract({
        address: contractAddress,
        abi: mockCarbonCreditAbi,
        functionName: "nextTokenId",
      }),
    );

    const tokenIds = Array.from({ length: Number(nextTokenId) }, (_, i) => BigInt(i));

    const records = await Promise.all(
      tokenIds.map(async (tokenId): Promise<CreditRecord> => {
        const [metadata, priceWei, availableSupply] = await Promise.all([
          withRetry(() =>
            publicClient.readContract({
              address: contractAddress,
              abi: mockCarbonCreditAbi,
              functionName: "creditMetadata",
              args: [tokenId],
            }),
          ),
          withRetry(() =>
            publicClient.readContract({
              address: contractAddress,
              abi: mockCarbonCreditAbi,
              functionName: "priceWei",
              args: [tokenId],
            }),
          ),
          withRetry(() =>
            publicClient.readContract({
              address: contractAddress,
              abi: mockCarbonCreditAbi,
              functionName: "availableSupply",
              args: [tokenId],
            }),
          ),
        ]);

        const [projectType, certificationStandard, vintageYear, location, qualityScore] =
          metadata;

        return {
          tokenId: Number(tokenId),
          projectType,
          certificationStandard,
          vintageYear,
          location,
          qualityScoreOnChain: qualityScore,
          priceWei,
          availableSupply,
        };
      }),
    );

    return records.filter((r) => r.availableSupply > 0n);
  }

  return { listAvailableCredits };
}
