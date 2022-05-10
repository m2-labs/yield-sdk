import { findTokenBySymbol } from "@m2-labs/token-amount"
import { Connection } from "@solana/web3.js"
import Decimal from "decimal.js"
import FranciumSDK from "francium-sdk"
import { ProtocolRates } from "../types"
import { defaultConnection } from "../utils/connection"
import { buildAssetRate, buildProtocolRates } from "../utils/rate-fns"

export const fetch = async (
  connection: Connection = defaultConnection("francium")
): Promise<ProtocolRates> => {
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
