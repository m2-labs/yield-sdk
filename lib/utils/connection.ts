import { IDS } from "@blockworks-foundation/mango-client"
import { Connection } from "@solana/web3.js"

const RPCs = [
  "https://api.mainnet-beta.solana.com",
  "https://solana-api.projectserum.com",
  "https://rpc.ankr.com/solana",
  "https://solana.public-rpc.com"
]

export const defaultConnection = (protocol?: string): Connection => {
  const rpc =
    protocol === "mango"
      ? IDS.cluster_urls.mainnet
      : RPCs[Math.floor(Math.random() * RPCs.length)]

  return new Connection(rpc, "confirmed")
}
