import { IDS } from "@blockworks-foundation/mango-client"
import { findToken, TokenInfo } from "@m2-labs/token-amount"
import { AnchorProvider, Wallet } from "@project-serum/anchor"
import { Connection, Keypair } from "@solana/web3.js"
import { FetchOptions, Protocol } from "../types"

const RPCs = [
  "https://api.mainnet-beta.solana.com",
  "https://solana-api.projectserum.com",
  "https://rpc.ankr.com/solana",
  "https://solana.public-rpc.com"
]

/**
 *
 */
export const defaultConnection = (protocol?: Protocol): Connection => {
  const rpc =
    protocol === "mango"
      ? IDS.cluster_urls.mainnet
      : RPCs[Math.floor(Math.random() * RPCs.length)]

  return new Connection(rpc, "confirmed")
}

/**
 *
 */
export const buildProvider = (connection: Connection): AnchorProvider => {
  return new AnchorProvider(connection, new Wallet(Keypair.generate()), {})
}

/**
 *
 */
export type DefaultOptions = {
  connection: Connection
  provider: AnchorProvider
  desiredTokens?: TokenInfo[]
}

/**
 *
 */
export const defaultOptions = (
  protocol?: Protocol,
  opts: FetchOptions = {}
): DefaultOptions => {
  const connection = opts.connection ?? defaultConnection(protocol)

  const provider = buildProvider(connection)

  const desiredTokens = opts.tokens?.length
    ? (opts.tokens.map(findToken).filter(Boolean) as TokenInfo[])
    : undefined

  return {
    connection,
    provider,
    desiredTokens
  }
}
