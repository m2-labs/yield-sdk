import { TokenAmount } from "@m2-labs/token-amount"
import {
  deposit,
  getDepositedBalance,
  getMaximumDeposit,
  withdraw
} from "../../lib/adapters/solend"
import { ensureBalance } from "../support/ensureBalance"
import { connection, TEST_KEYPAIR } from "../support/keypair"

jest.setTimeout(100_000)
test.skip("deposits to the solend main pool", async () => {
  await ensureBalance()

  const startingBalanceLamports = await connection.getBalance(
    TEST_KEYPAIR.publicKey
  )
  const startingBalance = TokenAmount.fromSubunits(
    startingBalanceLamports,
    "SOL"
  )

  const depositAmount = TokenAmount.fromSubunits(9_000_000, "SOL")

  /**
   * Check that we can deposit
   */
  const maximumDeposit = await getMaximumDeposit("SOL", connection, {
    environment: "devnet"
  })

  if (maximumDeposit.lt(depositAmount)) {
    throw new Error(
      `Deposit amount (${depositAmount.toString()} is greater than the maximum deposit ${maximumDeposit.toString()}`
    )
  }

  /**
   * Perform a deposit
   */
  const depositAction = await deposit(
    depositAmount,
    TEST_KEYPAIR.publicKey,
    connection,
    {
      environment: "devnet"
    }
  )
  const depositTxHash = await depositAction.sendTransactions(
    (tx, connection) => {
      return connection.sendTransaction(tx, [TEST_KEYPAIR])
    }
  )
  await connection.confirmTransaction(depositTxHash, "finalized")

  /**
   * Verify the deposit
   */
  let depositedBalance = await getDepositedBalance(
    depositAmount.tokenInfo,
    TEST_KEYPAIR.publicKey,
    connection,
    {
      environment: "devnet"
    }
  )

  expect(depositedBalance.toNumber()).toEqual(
    depositAmount.subunits.minus(1).toNumber()
  )

  /**
   * Perform a withdrawal
   */
  const withdrawAction = await withdraw(
    depositAmount,
    TEST_KEYPAIR.publicKey,
    connection,
    {
      environment: "devnet"
    }
  )
  const withdrawTxHash = await withdrawAction.sendTransactions(
    (tx, connection) => {
      return connection.sendTransaction(tx, [TEST_KEYPAIR])
    }
  )
  await connection.confirmTransaction(withdrawTxHash, "finalized")

  /**
   * Verify the withdrawal
   */
  depositedBalance = await getDepositedBalance(
    depositAmount.tokenInfo,
    TEST_KEYPAIR.publicKey,
    connection,
    {
      environment: "devnet"
    }
  )

  expect(depositedBalance.toNumber()).toEqual(0)

  /**
   * Verify the returns locally
   */
  const endingBalanceLamports = await connection.getBalance(
    TEST_KEYPAIR.publicKey
  )
  const endingBalance = TokenAmount.fromSubunits(endingBalanceLamports, "SOL")

  // rent and tx fees
  expect(endingBalance.toNumber()).toBeLessThanOrEqual(
    startingBalance.toNumber()
  )
})
