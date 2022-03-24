# 📈 defi-yield

All Solana DeFi yields in one package.

Currently supported protocols:

* [Apricot](https://apricot.one)
* [Francium](https://francium.io)
* [Jet Protocol](https://jetprotocol.io)
* [Mango Markets](https://mango.markets)
* [Port Finance](https://port.finance)
* [Solend](https://solend.fi)
* [Tulip](https://tulip.garden)

All data is fetched directly from the Solana blockchain, using the native protocol SDK when available.

❤️ Inspired by [defi-yield-ts](https://github.com/jet-lab/defi-yield-ts)

## Installation

```sh
npm i defi-yield
```

## Usage

```ts
import { fetchAll } from 'defi-yield';

const rates = await fetchAll()
```

## Getting started

```
npm run dev
```

## Building

```
npm run build
```
