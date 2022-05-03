import { Connection } from "@solana/web3.js"
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

export const fetch = async (
  protocol: Protocol,
  connection?: Connection
): Promise<ProtocolRates> => {
  try {
    switch (protocol) {
      case "apricot":
        return apricot(connection)
      case "francium":
        return francium(connection)
      case "jet":
        return jet(connection)
      case "larix":
        return larix(connection)
      case "mango":
        return mango(connection)
      case "port":
        return port(connection)
      case "solend":
        return solend(connection)
      case "solend-stable":
        return solendStable(connection)
      case "solend-turbo":
        return solendTurbo(connection)
      case "tulip":
        return tulip(connection)
      case "01":
        return zeroOne(connection)
      default:
        throw new Error(`Unsupported protocol: ${protocol}`)
    }
  } catch (e) {
    console.error(`Error fetching ${protocol} ${connection?.rpcEndpoint}`, e)
    throw e
  }
}

export const fetchAll = async (
  connection?: Connection
): Promise<ProtocolRates[]> => {
  return Promise.all([
    fetch("apricot", connection),
    fetch("francium", connection),
    fetch("jet", connection),
    fetch("larix", connection),
    fetch("mango", connection),
    fetch("port", connection),
    fetch("solend", connection),
    fetch("solend-stable", connection),
    fetch("solend-turbo", connection),
    fetch("tulip", connection),
    fetch("01", connection)
  ])
}
