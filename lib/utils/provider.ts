import { AnchorProvider, Wallet } from "@project-serum/anchor"
import { Connection, Keypair } from "@solana/web3.js"

export const buildProvider = (connection: Connection): AnchorProvider => {
  return new AnchorProvider(connection, new Wallet(Keypair.generate()), {})
}
