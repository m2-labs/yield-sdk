import { TokenAmount } from "@m2-labs/token-amount"
import {
  deposit,
  fetch,
  getDepositedBalance,
  getMaximumDeposit,
  withdraw
} from "../../lib/adapters/apricot"
import { PUBLIC_KEY } from "../support/keypair"
import { expectSupported } from "../support/tokens"

test("fetches the apricot rates", async () => {
  const rates = await fetch()

  expect(rates.protocol).toBe("apricot")
  expect(rates.rates.length).toBeTruthy()

  expect(rates.rates.find(({ token }) => token.symbol === "SOL")).toBeDefined()
  expect(rates.rates.find(({ token }) => token.symbol === "USDC")).toBeDefined()

  await expectSupported(rates.rates)
})

test("fetch() allows filtering tokens", async () => {
  const rates = await fetch({ tokens: ["USDC"] })

  expect(rates.protocol).toBe("apricot")
  expect(rates.rates.length).toBeTruthy()

  expect(
    rates.rates.find(({ token }) => token.symbol === "SOL")
  ).toBeUndefined()

  expect(rates.rates.find(({ token }) => token.symbol === "USDC")).toBeDefined()

  await expectSupported(rates.rates)
})

test("getMaximumDeposit() fetches the maximum available deposit based on utilization", async () => {
  const maximumDeposit = await getMaximumDeposit("USDC")

  expect(maximumDeposit.gt(0)).toBe(true)
})

test("getDepositedBalance() returns the amount a user has deposited", async () => {
  const depositedAmount = await getDepositedBalance("USDC", PUBLIC_KEY)

  console.log("depositedAmount", depositedAmount.toString())

  expect(depositedAmount.eq(0)).toBe(true)
})

test("deposit() builds a deposit transaction", async () => {
  const amount = new TokenAmount(100, "USDC")
  const tx = await deposit(amount, PUBLIC_KEY)

  expect(tx).toBeDefined()
  expect(tx.instructions.length).toBeGreaterThanOrEqual(1)
})

test("withdraw() builds a withdrawal transaction", async () => {
  const amount = new TokenAmount(100, "USDC")
  const tx = await withdraw(amount, PUBLIC_KEY)

  expect(tx).toBeDefined()
  expect(tx.instructions.length).toBeGreaterThanOrEqual(1)
})
