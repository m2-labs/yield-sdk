import { findToken, findTokenByMint, TokenInfo } from "@m2-labs/token-amount"
import { BN } from "@project-serum/anchor"
import { publicKey, u8, u64, u128, struct } from "@project-serum/borsh"
import { PublicKey } from "@solana/web3.js"
import * as BufferLayout from "buffer-layout"
import Decimal from "decimal.js"
import { FetchOptions, ProtocolRates } from "../types"
import { defaultConnection } from "../utils/connection"
import { buildAssetRate, buildProtocolRates } from "../utils/rate-fns"

const LARIX_RESERVE_IDS: Record<string, PublicKey> = {
  USDT: new PublicKey("DC832AzxQMGDaVLGiRQfRCkyXi6PUPjQyQfMbVRRjtKA"), // USDT
  USDC: new PublicKey("Emq1qT9MyyB5eHfftF5thYme84hoEwh4TCjm31K2Xxif"), // USDC
  BTC: new PublicKey("9oxCAYbaien8bqjhsGpfVGEV32GJyQ8fSRMsPzczHTEb"), // BTC
  soETH: new PublicKey("Egw1PCmsm3kAWnFtKFCJkTwi2EMfBi5P4Zfz6iURonFh"), // soETH
  SOL: new PublicKey("2RcrbkGNcfy9mbarLCCRYdW3hxph7pSbP38x35MR2Bjt"), // SOL
  mSOL: new PublicKey("GaX5diaQz7imMTeNYs5LPAHX6Hq1vKtxjBYzLkjXipMh"), // mSOL
  soFTT: new PublicKey("AwL4nHEPDKL7GW91czV4dUAp72kAwMBq1kBvexUYDBMm"), // soFTT
  SRM: new PublicKey("9xdoHwJr4tD2zj3QVpWrzafBKgLZUQWZ2UYPkqyAhQf6"), // SRM
  RAY: new PublicKey("7PwLriJiW2hRdviqnCEAHwvL21kptG1gs4jrZPqr3uMf"), // RAY
  ETH: new PublicKey("3GixAiDQgnCkMG6JDA1mxnDPHGjYkrNhWSYjLPzzN3Bs"), // ETH
  stSOL: new PublicKey("FStv7oj29DghUcCRDRJN9sEkB4uuh4SqWBY9pvSQ4Rch"), // stSOL
  FTT: new PublicKey("ErwYs9UCVik6oLKTZgM5TYLMYU2JTVARVawwJKxMEqbp") // FTT
}

const RESERVE_LAYOUT = struct([
  u8("version"),

  struct([u64("slot"), u8("stale")], "lastUpdate"),

  publicKey("lendingMarket"),

  struct(
    [
      publicKey("mintPubkey"),
      u8("mintDecimals"),
      publicKey("supplyPubkey"),
      publicKey("feeReceiver"),
      u8("usePythOracle"),
      publicKey("params_1"),
      publicKey("params_2"),
      u64("availableAmount"),
      u128("borrowedAmountWads"),
      u128("cumulativeBorrowRateWads"),
      u128("marketPrice"),
      u128("ownerUnclaimed")
    ],
    "liquidity"
  ),

  struct(
    [
      publicKey("mintPubkey"),
      u64("mintTotalSupply"),
      publicKey("supplyPubkey")
    ],
    "collateral"
  ),

  struct(
    [
      u8("optimalUtilizationRate"),
      u8("loanToValueRatio"),
      u8("liquidationBonus"),
      u8("liquidationThreshold"),
      u8("minBorrowRate"),
      u8("optimalBorrowRate"),
      u8("maxBorrowRate"),
      struct(
        [
          u64("borrowFeeWad"),
          u64("borrowInterestFeeWad"),
          u64("flashLoanFeeWad"),
          u8("hostFeePercentage"),
          u8("hostFeeReceiverCount"),
          BufferLayout.blob(32 * 5, "hostFeeReceivers")
        ],
        "fees"
      ),
      u8("depositPaused"),
      u8("borrowPaused"),
      u8("liquidationPaused")
    ],
    "config"
  ),
  struct(
    [
      publicKey("unCollSupply"),
      u128("lTokenMiningIndex"),
      u128("borrowMiningIndex"),
      u64("totalMiningSpeed"),
      u64("kinkUtilRate")
    ],
    "bonus"
  ),
  u8("reentry"),
  u64("depositLimit"),
  u8("isLP"),
  BufferLayout.blob(239, "padding")
])

type Reserve = {
  config: {
    optimalUtilizationRate: number
    optimalBorrowRate: number
    minBorrowRate: number
    maxBorrowRate: number
  }
  liquidity: {
    mintPubkey: PublicKey
    borrowedAmountWads: BN
    availableAmount: BN
    ownerUnclaimed: BN
  }
  isLP: boolean
}

const WAD = new Decimal(10).pow(18)
export const SLOTS_PER_YEAR = (1000 / 400) * 60 * 60 * 24 * 365
export const REAL_SLOTS_TIME = 500
export const REAL_SLOTS_PER_YEAR = (1000 / REAL_SLOTS_TIME) * 60 * 60 * 24 * 365

const eX = (value: string, x: string | number) => {
  if (value === "0") {
    return new Decimal(0)
  }
  return new Decimal(`${value}e${x}`)
}

const getUtilizationRate = (reserve: Reserve) => {
  const borrowedAmount = new Decimal(
    reserve.liquidity.borrowedAmountWads.toString()
  ).div(WAD)

  const totalSupply = new Decimal(reserve.liquidity.availableAmount.toString())
    .plus(borrowedAmount)
    .minus(eX(reserve.liquidity.ownerUnclaimed.toString(), -18))

  if (totalSupply.eq(0)) {
    return new Decimal(0)
  }

  if (WAD.gte(reserve.liquidity.borrowedAmountWads.toString())) {
    return new Decimal(0)
  }

  if (borrowedAmount.gt(totalSupply)) {
    return new Decimal(0)
  }

  return borrowedAmount.div(totalSupply)
}

const getCurrentBorrowRate = (
  reserve: Reserve,
  utilizationRate: Decimal
): Decimal => {
  const optimalUtilizationRate = new Decimal(
    reserve.config.optimalUtilizationRate
  ).div(100)
  const lowUtilization = utilizationRate.lt(optimalUtilizationRate)

  if (lowUtilization || optimalUtilizationRate.eq(1)) {
    const normalizedRate = utilizationRate.div(optimalUtilizationRate)
    const minRate = new Decimal(reserve.config.minBorrowRate).div(100)
    const rateRange = new Decimal(reserve.config.optimalBorrowRate)
      .minus(reserve.config.minBorrowRate)
      .div(100)

    return normalizedRate.times(rateRange).plus(minRate)
  }

  const normalizedRate = utilizationRate
    .minus(optimalUtilizationRate)
    .div(new Decimal(1).minus(optimalUtilizationRate))
  const minRate = new Decimal(reserve.config.optimalBorrowRate).div(100)
  const rateRange = new Decimal(reserve.config.maxBorrowRate)
    .minus(reserve.config.optimalBorrowRate)
    .div(100)

  return normalizedRate.times(rateRange).plus(minRate)
}

const calculateInterest = (
  reserve: Reserve
): { deposit: Decimal; borrow: Decimal } | undefined => {
  const utilizationRate = getUtilizationRate(reserve)
  const currentBorrowRate = getCurrentBorrowRate(reserve, utilizationRate)
  const slotInterestRate = currentBorrowRate.div(SLOTS_PER_YEAR)

  if (reserve.isLP) {
    return
  }

  const borrow = new Decimal(slotInterestRate)
    .plus(1)
    .pow(REAL_SLOTS_PER_YEAR)
    .minus(1)
  const deposit = borrow.times(0.8).times(utilizationRate)

  return {
    deposit,
    borrow
  }
}

export async function fetch({
  connection = defaultConnection("larix"),
  tokens
}: FetchOptions = {}): Promise<ProtocolRates> {
  const desiredTokens = tokens?.length
    ? (tokens.map(findToken).filter(Boolean) as TokenInfo[])
    : undefined

  const reserveIds = desiredTokens
    ? desiredTokens.map((t) => LARIX_RESERVE_IDS[t.symbol]).filter(Boolean)
    : Object.values(LARIX_RESERVE_IDS)

  const infos = await connection.getMultipleAccountsInfo(reserveIds)

  const rates = infos.map((info) => {
    if (!info) {
      return
    }

    const reserve: Reserve = RESERVE_LAYOUT.decode(info.data)
    const token = findTokenByMint(reserve.liquidity.mintPubkey)
    const interestData = calculateInterest(reserve)

    if (!token || !interestData) {
      return
    }

    return buildAssetRate({
      token,
      deposit: interestData.deposit,
      borrow: interestData.borrow
    })
  })

  return buildProtocolRates("larix", rates)
}
