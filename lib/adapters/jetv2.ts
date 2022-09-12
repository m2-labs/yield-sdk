import {
  MarginClient,
  MarginTokenConfig,
  MARGIN_CONFIG_URL,
  PoolManager
} from "@jet-lab/margin"
import { findToken, findTokenByMint } from "@m2-labs/token-amount"
import crossFetch from "cross-fetch"
import Decimal from "decimal.js"
import { FetchOptions, ProtocolRates } from "../types"
import { defaultConnection } from "../utils/connection"
import { buildProvider } from "../utils/provider"
import { buildAssetRate, buildProtocolRates } from "../utils/rate-fns"

/**
 * Modified version of the internal config method, but uses
 */
const marginConfig = async () => {
  const response = await crossFetch(MARGIN_CONFIG_URL)
  return (await response.json())["mainnet-beta"]
}

export const fetch = async ({
  connection = defaultConnection("jetv2"),
  tokens
}: FetchOptions = {}): Promise<ProtocolRates> => {
  const provider = buildProvider(connection)
  const desiredTokens = tokens?.length
    ? tokens.map(findToken).filter(Boolean)
    : undefined

  const preloadedConfig = await marginConfig()
  const config = await MarginClient.getConfig(preloadedConfig)

  config.tokens = Object.entries(config.tokens).reduce(
    (acc, [symbol, config]) => {
      if (!desiredTokens || desiredTokens.find((t) => t?.symbol === symbol)) {
        acc[symbol] = config
      }

      return acc
    },

    {} as Record<string, MarginTokenConfig>
  )

  const programs = MarginClient.getPrograms(provider, config)
  const poolManager = new PoolManager(programs, provider)
  const pools = await poolManager.loadAll()

  const rates = Object.entries(pools).map(([, pool]) => {
    const token = findTokenByMint(pool.tokenMint)

    if (!token) {
      return
    }

    return buildAssetRate({
      token,
      deposit: new Decimal(pool.depositApy),
      borrow: new Decimal(pool.borrowApr)
    })
  })

  return buildProtocolRates("jetv2", rates)
}
