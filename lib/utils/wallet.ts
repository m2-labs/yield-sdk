import { Transaction, PublicKey } from "@solana/web3.js"

export type AnchorWallet = {
  signTransaction(tx: Transaction): Promise<Transaction>
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>
  publicKey: PublicKey
}

export class Wallet implements AnchorWallet {
  async signTransaction(): Promise<Transaction> {
    throw new Error("Not implemented.")
  }

  async signAllTransactions(): Promise<Transaction[]> {
    throw new Error("Not implemented.")
  }

  get publicKey(): PublicKey {
    throw new Error("Not implemented.")
  }
}
