import {
  JetClient,
  JetMarket,
  JetReserve,
  JET_MARKET_ADDRESS
} from "@jet-lab/jet-engine"
import { PublicKey } from "@solana/web3.js"
import Decimal from "decimal.js"
import { ProtocolRates } from "../types"
import { asyncMap, compact } from "../utils/array-fns"
import { defaultConnection } from "../utils/connection"
import { buildProvider } from "../utils/provider"
import { findTokenByMint } from "../utils/tokens"

export const fetch = async (
  connection = defaultConnection("jet")
): Promise<ProtocolRates> => {
  const provider = buildProvider(connection)
  const client = await JetClient.connect(provider, true)
  const market = await JetMarket.load(client, JET_MARKET_ADDRESS)
  const reserves = await JetReserve.loadMultiple(client, market)

  const rates = await asyncMap(reserves, async (reserve) => {
    const token = await findTokenByMint(reserve.data.tokenMint)

    if (!token) {
      return
    }

    return {
      asset: token.symbol,
      mint: new PublicKey(token.address),
      deposit: new Decimal(reserve.data.depositApy),
      borrow: new Decimal(reserve.data.borrowApr)
    }
  })

  return {
    protocol: "jet",
    rates: compact(rates)
  }
}
