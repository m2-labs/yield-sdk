import {
  Deposit,
  Fetch,
  GetDepositedBalance,
  GetMaximumDeposit,
  Withdraw
} from "../types"
import { defaultConnection } from "../utils/connection"
import { buildProtocolRates } from "../utils/rate-fns"
import {
  fetch as solendFetch,
  getMaximumDeposit as solendGetMaximumDeposit,
  getDepositedBalance as solendGetDepositedBalance,
  deposit as solendDeposit,
  withdraw as solendWithdraw
} from "./solend"

const MARKET_ADDRESS = "7RCz8wb6WXxUhAigok9ttgrVgDFFFbibcirECzWSBauM"

export const fetch: Fetch = async (
  connection = defaultConnection("solend-turbo")
) => {
  const { rates } = await solendFetch(connection, {
    marketAddress: MARKET_ADDRESS
  })

  return buildProtocolRates("solend-turbo", rates)
}

export const getMaximumDeposit: GetMaximumDeposit = async (
  tokenInfo,
  connection = defaultConnection("solend-turbo")
) => {
  return solendGetMaximumDeposit(tokenInfo, connection, {
    marketAddress: MARKET_ADDRESS
  })
}

export const getDepositedBalance: GetDepositedBalance = async (
  tokenInfo,
  publicKey,
  connection = defaultConnection("solend-turbo")
) => {
  return solendGetDepositedBalance(tokenInfo, publicKey, connection, {
    marketAddress: MARKET_ADDRESS
  })
}

export const deposit: Deposit = async (
  amount,
  publicKey,
  connection = defaultConnection("solend-turbo")
) => {
  return solendDeposit(amount, publicKey, connection, {
    marketAddress: MARKET_ADDRESS
  })
}

export const withdraw: Withdraw = async (
  amount,
  publicKey,
  connection = defaultConnection("solend-turbo")
) => {
  return solendWithdraw(amount, publicKey, connection, {
    marketAddress: MARKET_ADDRESS
  })
}
