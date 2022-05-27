import {
  ApiAssetPool,
  createAssetPoolLoader,
  TokenID
} from "@apricot-lend/sdk-ts"
import {
  buildTokenInfo,
  findTokenByMint,
  TokenAmount
} from "@m2-labs/token-amount"
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

export const fetch: Fetch = async (
  connection = defaultConnection("apricot")
) => {
  const assetPoolLoader = await createAssetPoolLoader(connection)

  const assetPools = (
    await Promise.all([
      assetPoolLoader.getAssetPool(TokenID.BTC),
      assetPoolLoader.getAssetPool(TokenID.ETH),
      assetPoolLoader.getAssetPool(TokenID.mSOL),
      assetPoolLoader.getAssetPool(TokenID.SOL),
      assetPoolLoader.getAssetPool(TokenID.USDC),
      assetPoolLoader.getAssetPool(TokenID.USDT)
    ])
  ).filter(Boolean) as ApiAssetPool[]

  const rates = assetPools.map(({ mintKey, depositRate, borrowRate }) => {
    const token = findTokenByMint(mintKey)

    if (!token) {
      return
    }

    return buildAssetRate({
      token,
      deposit: depositRate,
      borrow: borrowRate
    })
  })

  return buildProtocolRates("apricot", rates)
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
