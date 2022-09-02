import { findTokenByMint } from "@m2-labs/token-amount"
import { publicKey, u8, u64, u128, struct, bool } from "@project-serum/borsh"
import { PublicKey } from "@solana/web3.js"
import TULIP_TOKENS from "@tulip-protocol/platform-sdk/src/constants/lending_info.json"
import Decimal from "decimal.js"
import { ProtocolRates } from "../types"
import { asPublicKey } from "../utils"
import { compact } from "../utils/array-fns"
import { defaultConnection } from "../utils/connection"
import { buildAssetRate, buildProtocolRates } from "../utils/rate-fns"

const LENDING_RESERVES = TULIP_TOKENS.lending.reserves
const DURATION = { DAILY: 144, WEEKLY: 1008, YEARLY: 52560 }
const WEI_TO_UNITS = 1_000_000_000_000_000_000

export const LENDING_RESERVE_LAYOUT = struct([
  u8("version"),
  struct([u64("slot"), bool("stale")], "lastUpdateSlot"),

  publicKey("lendingMarket"),
  publicKey("borrowAuthorizer"),

  struct(
    [
      publicKey("mintPubKey"),
      u8("mintDecimals"),
      publicKey("supplyPubKey"),
      publicKey("feeReceiver"),
      publicKey("oraclePubKey"),
      u64("availableAmount"),
      u128("borrowedAmount"),
      u128("cumulativeBorrowRate"),
      u128("marketPrice"),
      u128("platformAmountWads"),

      u8("platformFees")
    ],
    "liquidity"
  )
])

const calculateBorrowAPR = (
  utilization: Decimal,
  isRaydium: boolean,
  isOther: boolean
) => {
  const rate = utilization.times(100)
  const i = isRaydium ? 35 : 25

  if (rate.lte(50)) {
    return rate.div(50).times(15)
  }

  if (rate.gt(50) && rate.lte(90)) {
    return rate
      .minus(50)
      .div(40)
      .times(i - 15)
      .plus(15)
  }

  if (rate.gt(90)) {
    return rate
      .minus(90)
      .div(10)
      .times((isOther ? 150 : 100) - i)
      .plus(i)
  }
}

const compound = (amount: Decimal, timeframe: number) => {
  const a = amount.div(DURATION.DAILY)
  return a.div(100).plus(1).pow(timeframe).minus(1).times(100)
}

export async function fetch(
  connection = defaultConnection("tulip")
): Promise<ProtocolRates> {
  const reserves = LENDING_RESERVES.map((reserve) => {
    const token = findTokenByMint(reserve.liquidity_supply_token_mint)

    if (!token) {
      return
    }

    return new PublicKey(reserve.account)
  })

  const infos = await connection.getMultipleAccountsInfo(compact(reserves))

  const rates = infos.map((info, i) => {
    const reservePubKey = reserves[i]

    if (!info || !reservePubKey) {
      return
    }

    const reserve = LENDING_RESERVES.find((r) =>
      asPublicKey(r.account).equals(reservePubKey)
    )

    const token = findTokenByMint(reserve?.liquidity_supply_token_mint)

    if (!token || !reserve) {
      return
    }

    const data = LENDING_RESERVE_LAYOUT.decode(info.data)
    const decimals = new Decimal(10).pow(token.decimals)

    const availableAmount = new Decimal(
      data.liquidity.availableAmount.toString()
    ).div(decimals)

    const platformAmountWads = new Decimal(
      data.liquidity.platformAmountWads.toString()
    )
      .div(WEI_TO_UNITS)
      .div(decimals)

    const borrowedAmount = new Decimal(data.liquidity.borrowedAmount.toString())
      .div(WEI_TO_UNITS)
      .div(decimals)

    const remainingAmount = availableAmount
      .plus(borrowedAmount)
      .minus(platformAmountWads)

    const utilizedAmount = borrowedAmount.gt(remainingAmount)
      ? remainingAmount
      : borrowedAmount

    const utilization = utilizedAmount.div(remainingAmount)

    const borrowAPR = calculateBorrowAPR(
      utilization,
      "RAY" === reserve.name,
      "ORCA" === reserve.name ||
        "whETH" === reserve.name ||
        "mSOL" === reserve.name ||
        "BTC" === reserve.name ||
        "GENE" === reserve.name ||
        "SAMO" === reserve.name ||
        "DFL" === reserve.name ||
        "CAVE" === reserve.name ||
        "REAL" === reserve.name ||
        "wbWBNB" === reserve.name ||
        "MBS" === reserve.name ||
        "SHDW" === reserve.name ||
        "BASIS" === reserve.name
    )

    if (!borrowAPR) {
      return
    }

    const dailyBorrowRate = borrowAPR.div(365)
    const dailyLendingRate = utilization.times(dailyBorrowRate)
    const borrowAPY = compound(dailyBorrowRate, DURATION.YEARLY).div(100)
    const lendAPY = compound(dailyLendingRate, DURATION.YEARLY).div(100)

    return buildAssetRate({
      token,
      deposit: lendAPY,
      borrow: borrowAPY
    })
  })

  return buildProtocolRates("tulip", rates)
}
