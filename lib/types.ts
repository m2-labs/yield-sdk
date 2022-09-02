import { TokenInfo } from "@m2-labs/token-amount"
import { PublicKey } from "@solana/web3.js"
import Decimal from "decimal.js"

export type Protocol =
  | "01"
  | "apricot"
  | "francium"
  | "jet"
  | "jetv2"
  | "larix"
  | "mango"
  | "port"
  | "solend"
  | "solend-stable"
  | "solend-turbo"
  | "tulip"

export type ProtocolRates = {
  protocol: Protocol
  rates: AssetRate[]
}

export type AssetRate = {
  symbol: string
  token: TokenInfo
  deposit?: Decimal
  borrow?: Decimal

  /** @deprecated */
  asset: string
  /** @deprecated */
  mint: PublicKey
}
