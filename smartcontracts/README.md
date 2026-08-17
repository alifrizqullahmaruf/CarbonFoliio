## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy to X Layer Testnet

1. Copy `.env.example` to `.env` and fill in `PRIVATE_KEY` (a funded X Layer Testnet account — get test OKB from the X Layer faucet).
2. Load the env file and run:

```shell
$ source .env
$ forge script script/Deploy.s.sol:DeployScript \
    --rpc-url $XLAYER_TESTNET_RPC_URL \
    --broadcast \
    --chain-id 1952
```

3. Record the two logged contract addresses (`MockCarbonCredit`, `PortfolioManager`) — the frontend needs both.

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
