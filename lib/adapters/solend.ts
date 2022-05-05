import {
  buildTokenInfo,
  findTokenByMint,
  TokenAmount
} from "@m2-labs/token-amount"
import { Transaction } from "@solana/web3.js"
import { SolendAction, SolendMarket } from "@solendprotocol/solend-sdk"
import Decimal from "decimal.js"
import {
  Deposit,
  Fetch,
  GetDepositedBalance,
  GetMaximumDeposit,
  Withdraw
} from "../types"
import { asPublicKey, PublicKeyLike } from "../utils"
import { defaultConnection } from "../utils/connection"
import { convertWadsToLamports } from "../utils/decimal-fns"
import { buildAssetRate, buildProtocolRates } from "../utils/rate-fns"

type Opts = {
  environment?: "production" | "devnet"
  marketAddress?: PublicKeyLike
}

export const fetch: Fetch = async (
  connection = defaultConnection("solend"),
  opts: Opts = {}
) => {
  const market = await SolendMarket.initialize(
    connection,
    opts.environment,
    opts.marketAddress ? asPublicKey(opts.marketAddress).toBase58() : undefined
  )
  await market.loadReserves()

  const rates = market.reserves.map((reserve) => {
    const token = findTokenByMint(reserve.config.mintAddress)

    if (!token || !reserve.stats) {
      return
    }

    return buildAssetRate({
      token,
      deposit: new Decimal(reserve.stats.supplyInterestAPY),
      borrow: new Decimal(reserve.stats.borrowInterestAPY)
    })
  })

  return buildProtocolRates("solend", rates)
}

/**
 *
 * @param tokenInfo
 * @param connection
 * @param opts
 * @returns
 */
export const getMaximumDeposit: GetMaximumDeposit = async (
  tokenInfo,
  connection = defaultConnection("solend"),
  opts: Opts = {}
) => {
  const info = buildTokenInfo(tokenInfo)
  const market = await SolendMarket.initialize(
    /* connection */ connection,
    /* environment */ opts.environment,
    /* lending market address */ opts.marketAddress
      ? asPublicKey(opts.marketAddress).toString()
      : undefined
  )
  await market.loadReserves()

  const reserve = market.reserves.find((r) => r.config.symbol === info.symbol)

  if (!reserve || !reserve.stats) {
    throw new Error(`Reserve not found for symbol: ${info.symbol}`)
  }

  const depositLimit = TokenAmount.fromSubunits(
    reserve.stats.depositLimit,
    info
  )

  const totalDeposits = TokenAmount.fromSubunits(
    convertWadsToLamports(reserve.stats.totalDepositsWads),
    info
  )

  return depositLimit.minus(totalDeposits)
}

/**
 *
 * @param tokenInfo
 * @param publicKey
 * @param connection
 * @returns
 */
export const getDepositedBalance: GetDepositedBalance = async (
  tokenInfo,
  publicKey,
  connection = defaultConnection("solend"),
  opts: Opts = {}
) => {
  const info = buildTokenInfo(tokenInfo)
  const market = await SolendMarket.initialize(
    /* connection */ connection,
    /* environment */ opts.environment,
    /* lending market address */ opts.marketAddress
      ? asPublicKey(opts.marketAddress).toBase58()
      : undefined
  )

  const obligation = await market.fetchObligationByWallet(
    asPublicKey(publicKey)
  )

  return TokenAmount.fromSubunits(obligation?.deposits?.[0]?.amount ?? 0, info)
}

/**
 *
 * @param amount
 * @param publicKey
 * @param connection
 * @returns
 */
export const deposit: Deposit = async (
  amount,
  publicKey,
  connection = defaultConnection("solend"),
  opts: Opts = {}
) => {
  const action = await SolendAction.buildDepositTxns(
    /* connection*/ connection ?? defaultConnection("solend"),
    /* amount */ amount.toBN(),
    /* symbol */ amount.symbol,
    /* publicKey */ asPublicKey(publicKey),
    /* environment */ opts.environment,
    /* lending market address */ opts.marketAddress
      ? asPublicKey(opts.marketAddress)
      : undefined
  )

  const transactions = await action.getTransactions()

  return [
    transactions.preLendingTxn,
    transactions.lendingTxn,
    transactions.postLendingTxn
  ].filter(Boolean) as Transaction[]
}

/**
 *
 * @param amount
 * @param publicKey
 * @param connection
 * @returns
 */
export const withdraw: Withdraw = async (
  amount,
  publicKey,
  connection = defaultConnection("solend"),
  opts: Opts = {}
) => {
  const action = await SolendAction.buildWithdrawTxns(
    /* connection*/ connection ?? defaultConnection("solend"),
    /* amount */ amount.toBN(),
    /* symbol */ amount.symbol,
    /* publicKey */ asPublicKey(publicKey),
    /* environment */ opts.environment,
    /* lending market address */ opts.marketAddress
      ? asPublicKey(opts.marketAddress)
      : undefined
  )

  const transactions = await action.getTransactions()

  return [
    transactions.preLendingTxn,
    transactions.lendingTxn,
    transactions.postLendingTxn
  ].filter(Boolean) as Transaction[]
}
