import { PublicKey } from "@solana/web3.js"
import Decimal from "decimal.js"

export type Protocol =
  | "01"
  | "apricot"
  | "francium"
  | "jet"
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
  asset: string
  mint: PublicKey
  deposit?: Decimal
  borrow?: Decimal
}
