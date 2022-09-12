import {
  MarginClient,
  MarginTokenConfig,
  MARGIN_CONFIG_URL,
  PoolManager
} from "@jet-lab/margin"
import { findTokenByMint } from "@m2-labs/token-amount"
import crossFetch from "cross-fetch"
import Decimal from "decimal.js"
import { fetchHandler } from "../utils/fetch-fns"
import { buildAssetRate } from "../utils/rate-fns"

/**
 * Modified version of the internal config method, but uses cross-fetch to
 * make the connection for portability.
 */
const marginConfig = async () => {
  const response = await crossFetch(MARGIN_CONFIG_URL)
  return (await response.json())["mainnet-beta"]
}

export const fetch = fetchHandler(
  "jetv2",
  async ({ provider, desiredTokens }) => {
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

    return rates
  }
)
