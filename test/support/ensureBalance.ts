import { TokenAmount } from "@m2-labs/token-amount"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { connection, TEST_KEYPAIR } from "./keypair"

export const ensureBalance = async () => {
  const balanceLamports = await connection.getBalance(TEST_KEYPAIR.publicKey)
  const balance = TokenAmount.fromSubunits(balanceLamports, "SOL")

  if (balance.gt(0)) {
    // We're ok, continue
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
