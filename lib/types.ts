import { TokenAmount, TokenInfo, TokenInfoLike } from "@m2-labs/token-amount"
import { Connection, PublicKey, Transaction } from "@solana/web3.js"
import Decimal from "decimal.js"
import { PublicKeyLike } from "./utils"
import { DefaultOptions } from "./utils/connection"

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

export type FetchOptions = {
  connection?: Connection
  tokens?: TokenInfoLike[]
}

// TODO: Do we need this?
export type Fetch<T = void> = (
  opts: DefaultOptions,
  adapterOpts?: T
) => Promise<(AssetRate | undefined | null)[]>

export type GetMaximumDeposit = (
  tokenInfo: TokenInfoLike,
  connection?: Connection,
  opts?: Record<string, unknown>
) => Promise<TokenAmount>

export type GetDepositedBalance = (
  tokenInfo: TokenInfoLike,
  publicKey: PublicKeyLike,
  connection?: Connection,
  opts?: Record<string, unknown>
) => Promise<TokenAmount>

export type Deposit = (
  amount: TokenAmount,
  publicKey: PublicKeyLike,
  connection?: Connection,
  opts?: Record<string, unknown>
) => Promise<Transaction[]>

export type Withdraw = (
  amount: TokenAmount,
  publicKey: PublicKeyLike,
  connection?: Connection,
  opts?: Record<string, unknown>
) => Promise<Transaction[]>
