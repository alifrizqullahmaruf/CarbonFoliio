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

export function createCarbonCreditReader(rpcUrl: string, contractAddress: Address) {
  const publicClient = createPublicClient({ transport: http(rpcUrl) });

  async function listAvailableCredits(): Promise<CreditRecord[]> {
    const nextTokenId = await publicClient.readContract({
      address: contractAddress,
      abi: mockCarbonCreditAbi,
      functionName: "nextTokenId",
    });

    const tokenIds = Array.from({ length: Number(nextTokenId) }, (_, i) => BigInt(i));

    const records = await Promise.all(
      tokenIds.map(async (tokenId): Promise<CreditRecord> => {
        const [metadata, priceWei, availableSupply] = await Promise.all([
          publicClient.readContract({
            address: contractAddress,
            abi: mockCarbonCreditAbi,
            functionName: "creditMetadata",
            args: [tokenId],
          }),
          publicClient.readContract({
            address: contractAddress,
            abi: mockCarbonCreditAbi,
            functionName: "priceWei",
            args: [tokenId],
          }),
          publicClient.readContract({
            address: contractAddress,
            abi: mockCarbonCreditAbi,
            functionName: "availableSupply",
            args: [tokenId],
          }),
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
