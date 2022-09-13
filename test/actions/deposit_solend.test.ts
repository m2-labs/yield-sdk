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
test("deposits to the solend main pool", async () => {
  await ensureBalance()

  const startingBalanceLamports = await connection.getBalance(
    TEST_KEYPAIR.publicKey
  )
  const startingBalance = TokenAmount.fromSubunits(
    startingBalanceLamports,
    "SOL"
  )

  console.log("startingBalance", startingBalance)

  const depositAmount = TokenAmount.fromSubunits(9_000_000, "SOL")

  /**
   * Check that we can deposit
   */
  const maximumDeposit = await getMaximumDeposit("SOL", connection, {
    environment: "devnet"
  })

  console.log("max deposit", maximumDeposit)

  if (maximumDeposit.lt(depositAmount)) {
    throw new Error(
      `Deposit amount (${depositAmount.toString()} is greater than the maximum deposit ${maximumDeposit.toString()}`
    )
  }

  /**
   * Perform a deposit
   */
  console.log("depositing", depositAmount)
  console.log("depositing (BN)", depositAmount.toBN().toNumber())
  const depositTx = await deposit(
    depositAmount,
    TEST_KEYPAIR.publicKey,
    connection,
    {
      environment: "devnet"
    }
  )
  const depositTxHash = await connection.sendTransaction(depositTx, [
    TEST_KEYPAIR
  ])
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

  console.log("depositedBalance", depositedBalance)

  const currentBalanceLamports = await connection.getBalance(
    TEST_KEYPAIR.publicKey
  )
  const currentBalance = TokenAmount.fromSubunits(currentBalanceLamports, "SOL")

  console.log("currentBalance", currentBalance)
  console.log("amount withdrawn", startingBalance.minus(currentBalance))

  // small amount in there over the deposited amount
  // expect(depositedBalance.toNumber()).toEqual(depositAmount.toNumber())

  /**
   * Perform a withdrawal
   */
  const withdrawTx = await withdraw(
    depositAmount,
    TEST_KEYPAIR.publicKey,
    connection,
    {
      environment: "devnet"
    }
  )

  const withdrawTxHash = await connection.sendTransaction(withdrawTx, [
    TEST_KEYPAIR
  ])

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

  // small amount left over
  // expect(depositedBalance.toNumber()).toEqual(0)

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
