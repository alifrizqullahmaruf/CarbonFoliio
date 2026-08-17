import { NextResponse } from "next/server";
import { scoreAllCredits } from "@/lib/scoring/scoreAllCredits";
import { getChainConfig } from "@/lib/config";

export async function GET() {
  try {
    const { rpcUrl, contractAddress } = getChainConfig();
    const scored = await scoreAllCredits(rpcUrl, contractAddress);
    return NextResponse.json(
      scored.map((c) => ({
        ...c,
        priceWei: c.priceWei.toString(),
        availableSupply: c.availableSupply.toString(),
      })),
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
