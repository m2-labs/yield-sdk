import { Connection, PublicKey } from "@solana/web3.js"
import Decimal from "decimal.js"
import FranciumSDK from "francium-sdk"
import { TOKENS } from "../tokens"
import { AssetRate, ProtocolRates } from "../types"
import { defaultConnection } from "../utils/connection"

export async function fetch(
  connection: Connection = defaultConnection()
): Promise<ProtocolRates> {
  const fr = new FranciumSDK({
    connection
  })

  const res = await fr.getLendingPoolInfo()
  const rates: AssetRate[] = []

  res.forEach(({ pool, apy }) => {
    const token = TOKENS.find((token) => {
      return token.symbol === pool
    })

    if (token) {
      rates.push({
        asset: token.symbol,
        mint: new PublicKey(token.mint),
        deposit: new Decimal(apy)
      })
    }
  })

  return {
    protocol: "francium",
    rates
  } as ProtocolRates
}
