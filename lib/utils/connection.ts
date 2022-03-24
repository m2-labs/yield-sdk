import { getConnection } from "@apricot-lend/sdk-ts"
import { IDS } from "@blockworks-foundation/mango-client"
import { Connection } from "@solana/web3.js"

export const defaultConnection = (protocol?: string): Connection => {
  switch (protocol) {
    case "apricot":
      return getConnection()
    // case "francium":
    case "jet":
      return new Connection("https://jetprotocol.genesysgo.net", "confirmed")
    case "mango":
      return new Connection(IDS.cluster_urls.mainnet, "confirmed")
    default:
      return new Connection("https://api.mainnet-beta.solana.com", "confirmed")
  }
}
