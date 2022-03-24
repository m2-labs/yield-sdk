import { PublicKey } from "@solana/web3.js"
import Decimal from "decimal.js"

export type Protocol =
  | "apricot"
  | "francium"
  | "jet"
  | "mango"
  | "port"
  | "solend"
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