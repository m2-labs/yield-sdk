import type { Protocol, ProtocolRates } from "../types"
import { fetch as zeroOne } from "./01"
import { fetch as apricot } from "./apricot"
import { fetch as francium } from "./francium"
import { fetch as jet } from "./jet"
import { fetch as larix } from "./larix"
import { fetch as mango } from "./mango"
import { fetch as port } from "./port"
import { fetch as solend } from "./solend"
import { fetch as solendStable } from "./solend-stable"
import { fetch as solendTurbo } from "./solend-turbo"
import { fetch as tulip } from "./tulip"

export const fetch = async (protocol: Protocol): Promise<ProtocolRates> => {
  switch (protocol) {
    case "apricot":
      return apricot()
    case "francium":
      return francium()
    case "jet":
      return jet()
    case "larix":
      return larix()
    case "mango":
      return mango()
    case "port":
      return port()
    case "solend":
      return solend()
    case "solend-stable":
      return solendStable()
    case "solend-turbo":
      return solendTurbo()
    case "tulip":
      return tulip()
    case "01":
      return zeroOne()
    default:
      throw new Error(`Unsupported protocol: ${protocol}`)
  }
}

export const fetchAll = async (): Promise<ProtocolRates[]> => {
  return Promise.all([
    apricot(),
    francium(),
    jet(),
    larix(),
    mango(),
    port(),
    solend(),
    solendStable(),
    solendTurbo(),
    tulip(),
    zeroOne()
  ])
}

export {
  apricot,
  francium,
  jet,
  larix,
  mango,
  port,
  solend,
  solendStable,
  solendTurbo,
  tulip,
  zeroOne
}
