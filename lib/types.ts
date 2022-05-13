import { TokenAmount, TokenInfo, TokenInfoLike } from "@m2-labs/token-amount"
import { Connection, PublicKey, Transaction } from "@solana/web3.js"
import Decimal from "decimal.js"
import { PublicKeyLike } from "./utils"

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
  symbol: string
  token: TokenInfo
  deposit?: Decimal
  borrow?: Decimal

  /** @deprecated */
  asset: string
  /** @deprecated */
  mint: PublicKey
}

export type ProtocolFeature =
  | "fetch"
  | "deposit"
  | "withdraw"
  | "getDepositedBalance"
  | "getMaximumDeposit"

export type Fetch = (
  connection?: Connection,
  opts?: Record<string, unknown>
) => Promise<ProtocolRates>

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
