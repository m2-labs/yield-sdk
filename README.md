<img src="./logo.png" align="right" />

# yield-sdk

> Find the best DeFi yields, in one package.

This package aims to let you easily load all the DeFi lending and borrowing rates, as well as deposit / withdraw tokens to achieve those yields. All in one SDK.

## Installation

```sh
npm i yield-sdk
```

## Roadmap

- [x] Support fetching DeFi rates on Solana.
- [ ] Support for depositing and withdrawing tokens on Solana.
- [ ] Support for fetching DeFi rates on Ethereum, Avalanche, etc.
- [ ] Support for depositing and withdrawing tokens on other chains.

## Supported Protocols

- [01](https://01.xyz)
- [Apricot](https://apricot.one)
- [Francium](https://francium.io)
- [Jet Protocol v1](https://v1.jetprotocol.io/)
- [Jet Protocol v2](https://jetprotocol.io)
- [Larix](https://projectlarix.com)
- [Mango Markets](https://mango.markets)
- [Port Finance](https://port.finance)
- [Solend](https://solend.fi)
- [Solend Turbo Pool](https://solend.fi)
- [Solend Stable Pool](https://solend.fi)
- [Tulip](https://tulip.garden)

This library currently focuses on Solana, with other chains to come.

All data is fetched directly from the Solana blockchain, using the native protocol SDK when available. This project does not use screen-scraping or 3rd party APIs. To prevent rate-limiting, this project attempts to use the officially supported RPCs for each project.

❤️ Inspired by [defi-yield-ts](https://github.com/jet-lab/defi-yield-ts)

## Usage

### Fetching all rates

```ts
import { fetchAll } from "yield-sdk"

const rates = await fetchAll()
```

### Fetching specific rates

```ts
import { fetch } from "yield-sdk"

const apricot = await fetch("apricot")
const francium = await fetch("francium")
const jet = await fetch("jet")
const jetv2 = await fetch("jetv2")
const larix = await fetch("larix")
const mango = await fetch("mango")
const port = await fetch("port")
const solend = await fetch("solend")
const solendStable = await fetch("solend-stable")
const solendTurbo = await fetch("solend-turbo")
const tulip = await fetch("tulip")
const zeroOne = await fetch("01")
```

### Sample Result

```json
  {
    "protocol": "jet",
    "rates": [
      {
        "symbol": "USDC",
        "token": {
          // spl token registry info (address, decimals, etc)...
        },
        "deposit": "0.010327865708725278",
        "borrow": "0.02847159339558806"
      },
      {
        "symbol": "SOL",
        "token": {
          // spl token registry info (address, decimals, etc)...
        },
        "deposit": "0.008159138920000716",
        "borrow": "0.025612643359401145"
      },
      {
        "symbol": "BTC",
        "token": {
          // spl token registry info (address, decimals, etc)...
        },
        "deposit": "0.00017070024848790064",
        "borrow": "0.0066587630608482525"
      },
      {
        "symbol": "soETH",
        "token": {
          // spl token registry info (address, decimals, etc)...
        },
        "deposit": "0.0023310256428142506",
        "borrow": "0.015033198753934605"
      }
    ]
  }
```

## Depositing

```ts
import { deposit } from "yield-sdk"

const depositAmount = new TokenAmount("100", "USDC")
const depositTx = await deposit("francium", depositAmount, publicKey, connection)

// Use traditional wallet methods to send the transaction:
await sendTransaction(connection, depositTx)
```

## Brought to you by M2 Labs

<img src="https://m2.xyz/github.png" alt="M2 Labs" width="427" height="94" />

This project is maintained and funded by [M2 Labs](https://m2.xyz), a Web3
product development studio.
