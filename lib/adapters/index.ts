import type { FetchOptions, Protocol, ProtocolRates } from "../types"
import { fetch as zeroOne } from "./01"
import { fetch as apricot } from "./apricot"
import { fetch as francium } from "./francium"
import { fetch as jet } from "./jet"
import { fetch as jetv2 } from "./jetv2"
import { fetch as larix } from "./larix"
import { fetch as mango } from "./mango"
import { fetch as port } from "./port"
import { fetch as solend } from "./solend"
import { fetch as solendStable } from "./solend-stable"
import { fetch as solendTurbo } from "./solend-turbo"
import { fetch as tulip } from "./tulip"

export const fetch = async (
  protocol: Protocol,
  opts?: FetchOptions
): Promise<ProtocolRates> => {
  try {
    switch (protocol) {
      case "apricot":
        return apricot(opts)
      case "francium":
        return francium(opts)
      case "jet":
        return jet(opts)
      case "jetv2":
        return jetv2(opts)
      case "larix":
        return larix(opts)
      case "mango":
        return mango(opts)
      case "port":
        return port(opts)
      case "solend":
        return solend(opts)
      case "solend-stable":
        return solendStable(opts)
      case "solend-turbo":
        return solendTurbo(opts)
      case "tulip":
        return tulip(opts)
      case "01":
        return zeroOne(opts)
      default:
        throw new Error(`Unsupported protocol: ${protocol}`)
    }
  } catch (e) {
    console.error(
      `Error fetching ${protocol} ${opts?.connection?.rpcEndpoint}`,
      e
    )
    throw e
  }
}

export const fetchAll = async (
  opts?: FetchOptions
): Promise<ProtocolRates[]> => {
  return Promise.all([
    fetch("apricot", opts),
    fetch("francium", opts),
    fetch("jet", opts),
    fetch("jetv2", opts),
    fetch("larix", opts),
    fetch("mango", opts),
    fetch("port", opts),
    fetch("solend", opts),
    fetch("solend-stable", opts),
    fetch("solend-turbo", opts),
    fetch("tulip", opts),
    fetch("01", opts)
  ])
}
