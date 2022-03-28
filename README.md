<img src="./logo.png" align="right" />

# yield-sdk

> Achieve the best DeFi yields, in one package.

This package aims to let you easily load all the DeFi lending and borrowing rates, as well as deposit / withdraw tokens to achieve those yields.  All in one SDK.

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
- [Jet Protocol](https://jetprotocol.io)
- [Mango Markets](https://mango.markets)
- [Port Finance](https://port.finance)
- [Solend](https://solend.fi)
- [Tulip](https://tulip.garden)

This library currently focuses on Solana, with other chains to come.

All data is fetched directly from the Solana blockchain, using the native protocol SDK when available. This project does not use screen-scraping or 3rd party APIs.  To prevent rate-limiting, this project attempts to use the officially supported RPCs for each project.

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
const mango = await fetch("mango")
const port = await fetch("port")
const solend = await fetch("solend")
const tulip = await fetch("tulip")
const zeroOne = await fetch("01")
```

### Sample Result

```json
{
 "protocol": "apricot",
 "rates": [
  {
   "asset": "BTC",
   "mint": "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E",
   "deposit": "0.0002670346198465918",
   "borrow": "0.023064671242142846"
  },
  {
   "asset": "ETH",
   "mint": "2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk",
   "deposit": "0.0018352224425736245",
   "borrow": "0.034203185244413"
  },
  {
   "asset": "mSOL",
   "mint": "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
   "deposit": "0.0019126422121402238",
   "borrow": "0.03462290893436556"
  },
  {
   "asset": "SOL",
   "mint": "So11111111111111111111111111111111111111112",
   "deposit": "0.03149277251349529",
   "borrow": "0.10184945365066264"
  },
  {
   "asset": "USDC",
   "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
   "deposit": "0.0188790356315921",
   "borrow": "0.049366993796585386"
  },
  {
   "asset": "USDT",
   "mint": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
   "deposit": "0.039240853955982063",
   "borrow": "0.06875342870731997"
  },
  {
   "asset": "UST (Wormhole)",
   "mint": "9vMJfxuKxXBoEa7rM12mYLMwTacLMLDJqHozw96WQL8i",
   "deposit": "0.040417810344719064",
   "borrow": "0.06969665329250418"
  }
 ]
}
```

## Brought to you by M2 Labs

<img src="https://m2.xyz/github.png" alt="M2 Labs" width="427" height="94" />

This project is maintained and funded by [M2 Labs](https://m2.xyz), a Web3
product development studio.
