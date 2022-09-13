import {
  buildTokenInfo,
  findTokenBySymbol,
  TokenAmount
} from "@m2-labs/token-amount"
import Decimal from "decimal.js"
import FranciumSDK from "francium-sdk"
import { lendingPoolList } from "francium-sdk/dist/constants/lend/pools"
import { getLendingPoolInfo } from "francium-sdk/dist/model"
import {
  Deposit,
  GetDepositedBalance,
  GetMaximumDeposit,
  Withdraw
} from "../types"
import { asPublicKey } from "../utils"
import { defaultConnection } from "../utils/connection"
import { fetchHandler } from "../utils/fetch-fns"
import { buildAssetRate } from "../utils/rate-fns"

/**
 * Fetch the latest rates
 */
export const fetch = fetchHandler(
  "francium",
  async ({ connection, desiredTokens }) => {
    const pools = desiredTokens
      ? lendingPoolList.filter((p) =>
          desiredTokens?.find((t) => t.symbol === p.pool)
        )
      : lendingPoolList

    const assets = await getLendingPoolInfo(connection, pools)

    const rates = assets.map(({ pool, apy }) => {
      const token = findTokenBySymbol(pool)

      if (!token) {
        return
      }

      return buildAssetRate({
        token,
        deposit: new Decimal(apy).div(100)
      })
    })

    return rates
  }
)

/**
 * Get the maximum deposit amount available for a given token
 */
export const getMaximumDeposit: GetMaximumDeposit = async (
  tokenInfo,
  connection = defaultConnection("francium")
) => {
  const fr = new FranciumSDK({ connection })
  const info = buildTokenInfo(tokenInfo)
  const pools = await fr.getLendingPoolInfo()
  const pool = pools.find((p) => p.pool === info.symbol)

  return TokenAmount.fromSubunits(pool?.avaliableAmount ?? 0, tokenInfo)
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
  connection = defaultConnection("francium")
) => {
  const fr = new FranciumSDK({ connection })
  const info = buildTokenInfo(tokenInfo)
  const positions = await fr.getUserLendingPosition(asPublicKey(publicKey))
  const position = positions.find((p) => p.pool === info.symbol)

  return TokenAmount.fromSubunits(position?.totalAmount ?? 0, tokenInfo)
}

/**
 *
 */
export const deposit: Deposit = async (
  amount,
  publicKey,
  connection = defaultConnection("francium")
) => {
  const fr = new FranciumSDK({ connection })
  const { trx } = await fr.getLendingDepositTransaction(
    amount.symbol,
    amount.toBN(),
    asPublicKey(publicKey),
    {}
  )

  return trx
}

/**
 *
 */
export const withdraw: Withdraw = async (
  amount,
  publicKey,
  connection = defaultConnection("francium")
) => {
  const fr = new FranciumSDK({ connection })
  const { trx } = await fr.getLendWithdrawTransaction(
    amount.symbol,
    0,
    amount.toNumber(),
    asPublicKey(publicKey),
    {}
  )

  return trx
}
