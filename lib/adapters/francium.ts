import {
  buildTokenInfo,
  findTokenBySymbol,
  TokenAmount
} from "@m2-labs/token-amount"
import Decimal from "decimal.js"
import FranciumSDK from "francium-sdk"
import {
  Deposit,
  Fetch,
  GetDepositedBalance,
  GetMaximumDeposit,
  Withdraw
} from "../types"
import { asPublicKey } from "../utils"
import { defaultConnection } from "../utils/connection"
import { buildAssetRate, buildProtocolRates } from "../utils/rate-fns"

/**
 *
 * @param connection
 * @returns
 */
export const fetch: Fetch = async (
  connection = defaultConnection("francium")
) => {
  const fr = new FranciumSDK({ connection })

  const assets = await fr.getLendingPoolInfo()

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

  return buildProtocolRates("francium", rates)
}

/**
 *
 * @param tokenInfo
 * @param connection
 * @returns
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
 * @param amount
 * @param publicKey
 * @param connection
 * @returns
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

  return [trx]
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

  return [trx]
}
