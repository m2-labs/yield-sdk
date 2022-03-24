import { Connection, PublicKey } from "@solana/web3.js"
import FranciumSDK from "francium-sdk"
import { TOKENS } from "../tokens"
import { AssetRate, ProtocolRates } from "../types"

export async function fetch(connection?: Connection): Promise<ProtocolRates> {
  connection =
    connection ??
    new Connection("https://api.mainnet-beta.solana.com", "processed")

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
        deposit: apy,
        borrow: undefined
      })
    }
  })

  return {
    protocol: "francium",
    rates
  } as ProtocolRates
}
