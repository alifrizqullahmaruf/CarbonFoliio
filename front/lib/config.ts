import type { Address } from "viem";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getChainConfig(): { rpcUrl: string; contractAddress: Address } {
  return {
    rpcUrl: requireEnv("RPC_URL"),
    contractAddress: requireEnv("MOCK_CARBON_CREDIT_ADDRESS") as Address,
  };
}
