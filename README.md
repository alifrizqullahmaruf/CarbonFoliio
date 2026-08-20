# Strata

![Strata — AI-managed carbon credit portfolios, scored, diversified, and explained, built on X Layer](PASTE_HOSTED_IMAGE_URL_HERE)

**AI-managed carbon credit portfolios — scored, diversified, and explained, on X Layer.**

Built for the [X Layer AI Season](https://www.okx.com/xlayer) hackathon (track: AI-RWA).

## What it is

Strata is an AI agent that scores, recommends, and executes tokenized carbon credit portfolios. It doesn't reinvent carbon credit tokenization (that's what [Toucan Protocol](https://toucan.earth/) / TCO2 already do) — it adds the decision-making intelligence layer that's currently missing from the on-chain carbon market:

1. **Score** — every credit is scored on rule-based fundamentals (certification standard, vintage, project type) *and* reasoned over by an LLM for context rules alone can't catch.
2. **Build** — set a target offset (tons of CO2) and a risk profile (Conservative / Balanced / Aggressive); the engine assembles a diversified allocation across scored credits.
3. **Execute** — one signed transaction, straight to `PortfolioManager` on X Layer. Self-custodial — Strata never holds your funds.
4. **Explain** — every score and every allocation ships with the reasoning shown, not hidden.

Full product scope and rationale: [`PRD.md`](PRD.md).

## Repo layout

```
front/           Next.js 16 / React 19 frontend — dashboard, scoring engine, wallet flow
smartcontracts/  Foundry project — MockCarbonCredit (ERC1155) + PortfolioManager
PRD.md           Product requirements document
```

## How it works

```
Connect wallet
     ↓
Set target offset + risk profile
     ↓
Engine scores every available credit (rule-based + AI-reasoned)
     ↓
Engine assembles a diversified recommendation, with reasoning shown
     ↓
Review → Approve → one on-chain transaction (PortfolioManager.allocate)
     ↓
Track holdings live from the chain
```

## Tech stack

**Frontend** (`front/`): Next.js 16, React 19, Tailwind v4, wagmi + viem + RainbowKit for wallet/chain, `motion` for UI animation, an OpenRouter-routed LLM (`anthropic/claude-opus-5`) with structured outputs for scoring and explanation generation.

**Smart contracts** (`smartcontracts/`): Foundry (Forge), OpenZeppelin. `MockCarbonCredit` is an ERC1155 representing tokenized carbon credit types (1 unit = 1 ton CO2); `PortfolioManager` handles allocation (buy) and retirement (burn) against it.

## Deployed contracts — X Layer Testnet (chain ID 1952)

| Contract | Address |
|---|---|
| `MockCarbonCredit` | `0x255779bFEB55568EB0Efa3Ae0a7f6669f078a2D2` |
| `PortfolioManager` | `0x6186BffC6200DEF438eE3df443F4B1DA9BA3Cd06` |

RPC: `https://testrpc.xlayer.tech` · Native token: OKB

## Getting started

### Frontend

```bash
cd front
npm install
cp .env.example .env.local   # fill in RPC/contract addresses, OPENROUTER_API_KEY, WalletConnect project ID
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Smart contracts

```bash
cd smartcontracts
forge build
forge test
```

To deploy to X Layer Testnet, see [`smartcontracts/README.md`](smartcontracts/README.md).

## License

Unlicensed — hackathon submission.
