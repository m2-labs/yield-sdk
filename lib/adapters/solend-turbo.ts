import { PublicKey } from "@solana/web3.js"
import { SolendMarket } from "@solendprotocol/solend-sdk"
import Decimal from "decimal.js"
import { ProtocolRates } from "../types"
import { asyncMap, compact } from "../utils/array-fns"
import { defaultConnection } from "../utils/connection"
import { findTokenByMint } from "../utils/tokens"

export async function fetch(
  connection = defaultConnection("solend-turbo")
): Promise<ProtocolRates> {
  const market = await SolendMarket.initialize(
    connection,
    "production",
    "7RCz8wb6WXxUhAigok9ttgrVgDFFFbibcirECzWSBauM"
  )
  await market.loadReserves()

  const rates = await asyncMap(market.reserves, async (reserve) => {
    const token = await findTokenByMint(reserve.config.mintAddress)

    if (!token || !reserve.stats) {
      return
    }

    return {
      asset: token.symbol,
      mint: new PublicKey(token.address),
      deposit: new Decimal(reserve.stats.supplyInterestAPY),
      borrow: new Decimal(reserve.stats.borrowInterestAPY)
    }
  })

  return {
    protocol: "solend-turbo",
    rates: compact(rates)
  }
}
