import { IDS } from "@blockworks-foundation/mango-client"
import { findToken, TokenInfo } from "@m2-labs/token-amount"
import { AnchorProvider, Wallet } from "@project-serum/anchor"
import { Connection, Keypair } from "@solana/web3.js"
import nodeDebug from "debug"
import { FetchOptions, Protocol } from "../types"

const debug = nodeDebug("yield-sdk:connection")

const RPCs = [
  "https://api.mainnet-beta.solana.com",
  "https://solana-api.projectserum.com",
  "https://rpc.ankr.com/solana",
  "https://solana.public-rpc.com"
]

/**
 * Build a `Connection` object for the given protocol
 */
export const defaultConnection = (protocol?: Protocol): Connection => {
  const rpc =
    protocol === "mango"
      ? IDS.cluster_urls.mainnet
      : protocol === "port"
      ? "https://solana-api.projectserum.com"
      : RPCs[Math.floor(Math.random() * RPCs.length)]

  debug("rpc", rpc)
  return new Connection(rpc, "confirmed")
}

/**
 *
 */
const buildProvider = (connection: Connection): AnchorProvider => {
  return new AnchorProvider(connection, new Wallet(Keypair.generate()), {})
}

/**
 *
 */
export type DefaultOptions = {
  connection: Connection
  provider: AnchorProvider
  desiredTokens?: TokenInfo[]
  isDesiredToken: (token?: TokenInfo) => boolean
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

  const isDesiredToken = (token?: TokenInfo) => {
    if (!token) {
      return false
    }

    return !desiredTokens || desiredTokens.includes(token)
  }

  return {
    connection,
    provider,
    desiredTokens,
    isDesiredToken
  }
}
