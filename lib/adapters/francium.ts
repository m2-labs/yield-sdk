import { Connection, PublicKey } from "@solana/web3.js"
import Decimal from "decimal.js"
import FranciumSDK from "francium-sdk"
import { ProtocolRates } from "../types"
import { asyncMap, compact } from "../utils/array-fns"
import { defaultConnection } from "../utils/connection"
import { findTokenBySymbol } from "../utils/tokens"

export const fetch = async (
  connection: Connection = defaultConnection("francium")
): Promise<ProtocolRates> => {
  const fr = new FranciumSDK({ connection })

  const assets = await fr.getLendingPoolInfo()

  const rates = await asyncMap(assets, async ({ pool, apy }) => {
    const token = await findTokenBySymbol(pool)

    if (!token) {
      return
    }

    return {
      asset: token.symbol,
      mint: new PublicKey(token.address),
      deposit: new Decimal(apy).div(100)
    }
  })

  return {
    protocol: "francium",
    rates: compact(rates)
  }
}
