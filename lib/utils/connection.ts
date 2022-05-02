import { getConnection } from "@apricot-lend/sdk-ts"
import { IDS } from "@blockworks-foundation/mango-client"
import { Connection } from "@solana/web3.js"

const RPCs = [
  "https://api.mainnet-beta.solana.com",
  "https://solana-api.projectserum.com",
  "https://rpc.ankr.com/solana",
  "https://solana.public-rpc.com",
  "https://api.rpcpool.com"
]

export const defaultConnection = (protocol?: string): Connection => {
  switch (protocol) {
    case "apricot":
      return getConnection()
    case "mango":
      return new Connection(IDS.cluster_urls.mainnet, "confirmed")
    default:
      return new Connection(
        RPCs[Math.floor(Math.random() * RPCs.length)],
        "confirmed"
      )
  }
}
