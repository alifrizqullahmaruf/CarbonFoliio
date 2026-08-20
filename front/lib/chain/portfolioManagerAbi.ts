export const portfolioManagerAbi = [
  {
    type: "function",
    name: "getPortfolio",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [
      { name: "tokenIds", type: "uint256[]" },
      { name: "balances", type: "uint256[]" },
    ],
  },
  {
    type: "function",
    name: "allocate",
    stateMutability: "payable",
    inputs: [
      { name: "tokenIds", type: "uint256[]" },
      { name: "amounts", type: "uint256[]" },
    ],
    outputs: [],
  },
] as const;
