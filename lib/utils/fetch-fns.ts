import { Fetch, FetchOptions, Protocol } from "../types"
import { defaultOptions } from "./connection"
import { buildProtocolRates } from "./rate-fns"

/**
 * Wrapper method to build a fetch method with consistent inputs and outputs.
 */
export const fetchHandler = <T = void>(
  protocol: Protocol,
  handler: Fetch<T>
) => {
  return async (opts?: FetchOptions, adapterOpts?: T) => {
    const defaults = defaultOptions(protocol, opts)

    const rates = await handler(defaults, adapterOpts)

    return buildProtocolRates(protocol, rates)
  }
}
