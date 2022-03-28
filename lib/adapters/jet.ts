import {
  JetClient,
  JetMarket,
  JetReserve,
  JET_MARKET_ADDRESS
} from "@jet-lab/jet-engine"
import { PublicKey } from "@solana/web3.js"
import Decimal from "decimal.js"
import { findTokenByMint } from "../tokens"
import { AssetRate, ProtocolRates } from "../types"
import { defaultConnection } from "../utils/connection"
import { buildProvider } from "../utils/provider"

export const fetch = async (
  connection = defaultConnection("jet")
): Promise<ProtocolRates> => {
  const provider = buildProvider(connection)
  const client = await JetClient.connect(provider, true)
  const market = await JetMarket.load(client, JET_MARKET_ADDRESS)
  const reserves = await JetReserve.loadMultiple(client, market)

  const rates: AssetRate[] = []

  reserves.forEach((reserve) => {
    const token = findTokenByMint(reserve.data.tokenMint)

    if (!token) {
      return
    }

    rates.push({
      asset: token.symbol,
      mint: new PublicKey(token.mint),
      deposit: new Decimal(reserve.data.depositApy),
      borrow: new Decimal(reserve.data.borrowApr)
    })
  })

  return {
    protocol: "jet",
    rates
  }
}
