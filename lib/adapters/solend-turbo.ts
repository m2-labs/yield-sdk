import {
  Deposit,
  GetDepositedBalance,
  GetMaximumDeposit,
  Withdraw
} from "../types"
import { defaultConnection } from "../utils/connection"
import { fetchHandler } from "../utils/fetch-fns"
import {
  solendFetch,
  getMaximumDeposit as solendGetMaximumDeposit,
  getDepositedBalance as solendGetDepositedBalance,
  deposit as solendDeposit,
  withdraw as solendWithdraw
} from "./solend"

const MARKET_ADDRESS = "7RCz8wb6WXxUhAigok9ttgrVgDFFFbibcirECzWSBauM"

/**
 * Fetch the latest rates
 */
export const fetch = fetchHandler("solend-turbo", async (opts) => {
  const rates = await solendFetch(opts, { marketAddress: MARKET_ADDRESS })

  return rates
})

/**
 *
 */
export const getMaximumDeposit: GetMaximumDeposit = async (
  tokenInfo,
  connection = defaultConnection("solend-turbo")
) => {
  return solendGetMaximumDeposit(tokenInfo, connection, {
    marketAddress: MARKET_ADDRESS
  })
}

/**
 *
 */
export const getDepositedBalance: GetDepositedBalance = async (
  tokenInfo,
  publicKey,
  connection = defaultConnection("solend-turbo")
) => {
  return solendGetDepositedBalance(tokenInfo, publicKey, connection, {
    marketAddress: MARKET_ADDRESS
  })
}

/**
 *
 */
export const deposit: Deposit = async (
  amount,
  publicKey,
  connection = defaultConnection("solend-turbo")
) => {
  return solendDeposit(amount, publicKey, connection, {
    marketAddress: MARKET_ADDRESS
  })
}

/**
 *
 */
export const withdraw: Withdraw = async (
  amount,
  publicKey,
  connection = defaultConnection("solend-turbo")
) => {
  return solendWithdraw(amount, publicKey, connection, {
    marketAddress: MARKET_ADDRESS
  })
}
