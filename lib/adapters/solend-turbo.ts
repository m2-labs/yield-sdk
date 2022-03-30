import { PublicKey } from "@solana/web3.js"
import { SolendMarket } from "@solendprotocol/solend-sdk"
import Decimal from "decimal.js"
import { findTokenByMint } from "../tokens"
import { AssetRate, ProtocolRates } from "../types"
import { defaultConnection } from "../utils/connection"

export async function fetch(
  connection = defaultConnection("solend")
): Promise<ProtocolRates> {
  const market = await SolendMarket.initialize(
    connection,
    "production",
    "7RCz8wb6WXxUhAigok9ttgrVgDFFFbibcirECzWSBauM"
  )
  await market.loadReserves()

  const rates: AssetRate[] = []

  market.reserves.forEach((reserve) => {
    const token = findTokenByMint(reserve.config.mintAddress)

    if (!token || !reserve.stats) {
      return
    }

    rates.push({
      asset: token.symbol,
      mint: new PublicKey(token.mint),
      deposit: new Decimal(reserve.stats.supplyInterestAPY),
      borrow: new Decimal(reserve.stats.borrowInterestAPY)
    })
  })

  return {
    protocol: "solend-turbo",
    rates
  }
}
