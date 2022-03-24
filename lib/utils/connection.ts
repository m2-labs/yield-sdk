import { Connection } from "@solana/web3.js"

export const defaultConnection = (): Connection => {
  return new Connection("https://api.mainnet-beta.solana.com", "processed")
}
