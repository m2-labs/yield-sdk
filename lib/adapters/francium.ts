import { findToken, findTokenBySymbol } from "@m2-labs/token-amount"
import Decimal from "decimal.js"
import { lendingPoolList } from "francium-sdk/dist/constants/lend/pools"
import { getLendingPoolInfo } from "francium-sdk/dist/model"
import { FetchOptions, ProtocolRates } from "../types"
import { defaultConnection } from "../utils/connection"
import { buildAssetRate, buildProtocolRates } from "../utils/rate-fns"

export const fetch = async ({
  connection = defaultConnection("francium"),
  tokens
}: FetchOptions = {}): Promise<ProtocolRates> => {
  const desiredTokens = tokens?.length
    ? tokens.map(findToken).filter(Boolean)
    : undefined

  const pools = desiredTokens
    ? lendingPoolList.filter((p) =>
        desiredTokens?.find((t) => t?.symbol === p.pool)
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

  return buildProtocolRates("francium", rates)
}
