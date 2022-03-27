import { Connection, PublicKey } from "@solana/web3.js"
import Decimal from "decimal.js"
import FranciumSDK from "francium-sdk"
import { findTokenBySymbol } from "../tokens"
import { AssetRate, ProtocolRates } from "../types"
import { defaultConnection } from "../utils/connection"

export const fetch = async (
  connection: Connection = defaultConnection("francium")
): Promise<ProtocolRates> => {
  const fr = new FranciumSDK({ connection })

  const assets = await fr.getLendingPoolInfo()
  const rates: AssetRate[] = []

  assets.forEach(({ pool, apy }) => {
    const token = findTokenBySymbol(pool)

    if (token) {
      rates.push({
        asset: token.symbol,
        mint: new PublicKey(token.mint),
        deposit: new Decimal(apy).div(100)
      })
    }
  })

  return {
    protocol: "francium",
    rates
  }
}
