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

const MARKET_ADDRESS = "GktVYgkstojYd8nVXGXKJHi7SstvgZ6pkQqQhUPD7y7Q"

export const fetch: Fetch = async (
  connection = defaultConnection("solend-stable")
) => {
  const { rates } = await solendFetch(connection, {
    marketAddress: MARKET_ADDRESS
  })

  return buildProtocolRates("solend-stable", rates)
}

export const getMaximumDeposit: GetMaximumDeposit = async (
  tokenInfo,
  connection = defaultConnection("solend-stable")
) => {
  return solendGetMaximumDeposit(tokenInfo, connection, {
    marketAddress: MARKET_ADDRESS
  })
}

export const getDepositedBalance: GetDepositedBalance = async (
  tokenInfo,
  publicKey,
  connection = defaultConnection("solend-stable")
) => {
  return solendGetDepositedBalance(tokenInfo, publicKey, connection, {
    marketAddress: MARKET_ADDRESS
  })
}

export const deposit: Deposit = async (
  amount,
  publicKey,
  connection = defaultConnection("solend-stable")
) => {
  return solendDeposit(amount, publicKey, connection, {
    marketAddress: MARKET_ADDRESS
  })
}

export const withdraw: Withdraw = async (
  amount,
  publicKey,
  connection = defaultConnection("solend-stable")
) => {
  return solendWithdraw(amount, publicKey, connection, {
    marketAddress: MARKET_ADDRESS
  })
}
