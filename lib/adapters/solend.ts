import { findTokenByMint } from "@m2-labs/token-amount"
import { SolendMarket } from "@solendprotocol/solend-sdk"
import Decimal from "decimal.js"
import { ProtocolRates } from "../types"
import { defaultConnection } from "../utils/connection"
import { buildAssetRate, buildProtocolRates } from "../utils/rate-fns"

export async function fetch(
  connection = defaultConnection("solend")
): Promise<ProtocolRates> {
  const market = await SolendMarket.initialize(connection)
  await market.loadReserves()

  const rates = market.reserves.map((reserve) => {
    const token = findTokenByMint(reserve.config.mintAddress)

    if (!token || !reserve.stats) {
      return
    }

    return buildAssetRate({
      token,
      deposit: new Decimal(reserve.stats.supplyInterestAPY),
      borrow: new Decimal(reserve.stats.borrowInterestAPY)
    })
  })

  return buildProtocolRates("solend", rates)
}
