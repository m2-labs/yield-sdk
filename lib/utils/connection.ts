import { getConnection } from "@apricot-lend/sdk-ts"
import { IDS } from "@blockworks-foundation/mango-client"
import { Connection } from "@solana/web3.js"

export const defaultConnection = (protocol?: string): Connection => {
  switch (protocol) {
    case "apricot":
      return getConnection()
    case "francium":
      return new Connection("https://francium.rpcpool.com", "confirmed")
    case "jet":
      return new Connection("https://jetprotocol.genesysgo.net", "confirmed")
    case "mango":
      return new Connection(IDS.cluster_urls.mainnet, "confirmed")
    case "port":
    case "tulip":
      return new Connection("https://solana-api.projectserum.com", "confirmed")
    case "01":
    default:
      return new Connection("https://api.mainnet-beta.solana.com", "confirmed")
  }
}
