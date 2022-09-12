import {
  JetClient,
  JetMarket,
  JetReserve,
  JET_MARKET_ADDRESS
} from "@jet-lab/jet-engine"
import { findToken, findTokenByMint } from "@m2-labs/token-amount"
import Decimal from "decimal.js"
import { FetchOptions, ProtocolRates } from "../types"
import { defaultConnection } from "../utils/connection"
import { buildProvider } from "../utils/provider"
import { buildAssetRate, buildProtocolRates } from "../utils/rate-fns"

export const fetch = async ({
  connection = defaultConnection("jet"),
  tokens
}: FetchOptions = {}): Promise<ProtocolRates> => {
  const provider = buildProvider(connection)
  const desiredTokens = tokens?.length
    ? tokens.map(findToken).filter(Boolean)
    : undefined

  const client = await JetClient.connect(provider, false)
  const market = await JetMarket.load(client, JET_MARKET_ADDRESS)
  const reserves = await JetReserve.loadMultiple(client, market)

  const rates = reserves.map((reserve) => {
    const token = findTokenByMint(reserve.data.tokenMint)

    if (!token) {
      return
    }

    if (!desiredTokens || desiredTokens.includes(token)) {
      return buildAssetRate({
        token,
        deposit: new Decimal(reserve.data.depositApy),
        borrow: new Decimal(reserve.data.borrowApr)
      })
    }
  })

  return buildProtocolRates("jet", rates)
}
