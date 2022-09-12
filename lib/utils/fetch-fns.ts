import { AssetRate, FetchOptions, Protocol } from "../types"
import { defaultOptions, DefaultOptions } from "./connection"
import { buildProtocolRates } from "./rate-fns"

export const fetchHandler = (
  protocol: Protocol,
  handler: (opts: DefaultOptions) => Promise<(AssetRate | undefined | null)[]>
) => {
  return async (opts?: FetchOptions) => {
    const defaults = defaultOptions(protocol, opts)

    const rates = await handler(defaults)

    return buildProtocolRates(protocol, rates)
  }
}
