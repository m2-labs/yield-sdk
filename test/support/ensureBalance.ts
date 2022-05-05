import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { connection, TEST_KEYPAIR } from "./keypair"

export const ensureBalance = async () => {
  const startingBalanceLamports = await connection.getBalance(
    TEST_KEYPAIR.publicKey
  )

  if (startingBalanceLamports > 0) {
    return
  }

  /**
   * Get an airdrop
   */
  const airdropSignature = await connection.requestAirdrop(
    TEST_KEYPAIR.publicKey,
    LAMPORTS_PER_SOL
  )

  await connection.confirmTransaction(airdropSignature)
}
