import { getConnection } from "@apricot-lend/sdk-ts"
import { Connection } from "@solana/web3.js"

export const defaultConnection = (protocol?: string): Connection => {
  switch (protocol) {
    case "apricot":
      return getConnection()
    // case "francium":
    case "jet":
      return new Connection("https://jetprotocol.genesysgo.net", "confirmed")
    default:
      return new Connection("https://api.mainnet-beta.solana.com", "confirmed")
  }
}
