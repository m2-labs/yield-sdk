import { TokenAmount, TokenInfoLike } from "@m2-labs/token-amount"
import { Connection, Transaction } from "@solana/web3.js"
import type { Protocol, ProtocolRates } from "../types"
import { PublicKeyLike } from "../utils"
import { fetch as zeroOne } from "./01"
import { fetch as apricot } from "./apricot"
import {
  fetch as francium,
  deposit as franciumDeposit,
  withdraw as franciumWithdraw,
  getDepositedBalance as franciumGetDepositedBalance,
  getMaximumDeposit as franciumGetMaximumDeposit
} from "./francium"
import { fetch as jet } from "./jet"
import { fetch as larix } from "./larix"
import { fetch as mango } from "./mango"
import { fetch as port } from "./port"
import {
  fetch as solend,
  deposit as solendDeposit,
  withdraw as solendWithdraw,
  getDepositedBalance as solendGetDepositedBalance,
  getMaximumDeposit as solendGetMaximumDeposit
} from "./solend"
import {
  fetch as solendStable,
  deposit as solendStableDeposit,
  withdraw as solendStableWithdraw,
  getDepositedBalance as solendStableGetDepositedBalance,
  getMaximumDeposit as solendStableGetMaximumDeposit
} from "./solend-stable"
import {
  fetch as solendTurbo,
  deposit as solendTurboDeposit,
  withdraw as solendTurboWithdraw,
  getDepositedBalance as solendTurboGetDepositedBalance,
  getMaximumDeposit as solendTurboGetMaximumDeposit
} from "./solend-turbo"
import { fetch as tulip } from "./tulip"

/**
 *
 * @param protocol
 * @param connection
 * @returns
 */
export const fetch = async (
  protocol: Protocol,
  connection?: Connection
): Promise<ProtocolRates> => {
  try {
    switch (protocol) {
      case "apricot":
        return apricot(connection)
      case "francium":
        return francium(connection)
      case "jet":
        return jet(connection)
      case "larix":
        return larix(connection)
      case "mango":
        return mango(connection)
      case "port":
        return port(connection)
      case "solend":
        return solend(connection)
      case "solend-stable":
        return solendStable(connection)
      case "solend-turbo":
        return solendTurbo(connection)
      case "tulip":
        return tulip(connection)
      case "01":
        return zeroOne(connection)
      default:
        throw new Error(`Unsupported protocol: ${protocol}`)
    }
  } catch (e) {
    console.error(`Error fetching ${protocol} ${connection?.rpcEndpoint}`, e)
    throw e
  }
}

/**
 *
 * @param connection
 * @returns
 */
export const fetchAll = async (
  connection?: Connection
): Promise<ProtocolRates[]> => {
  return Promise.all([
    fetch("apricot", connection),
    fetch("francium", connection),
    fetch("jet", connection),
    fetch("larix", connection),
    fetch("mango", connection),
    fetch("port", connection),
    fetch("solend", connection),
    fetch("solend-stable", connection),
    fetch("solend-turbo", connection),
    fetch("tulip", connection),
    fetch("01", connection)
  ])
}

export const getDepositedBalance = async (
  protocol: Protocol,
  tokenInfo: TokenInfoLike,
  publicKey: PublicKeyLike,
  connection?: Connection
): Promise<TokenAmount> => {
  switch (protocol) {
    case "francium":
      return franciumGetDepositedBalance(tokenInfo, publicKey, connection)
    case "solend":
      return solendGetDepositedBalance(tokenInfo, publicKey, connection)
    case "solend-stable":
      return solendStableGetDepositedBalance(tokenInfo, publicKey, connection)
    case "solend-turbo":
      return solendTurboGetDepositedBalance(tokenInfo, publicKey, connection)
    default:
      throw new Error(`Unsupported protocol: ${protocol}`)
  }
}

export const getMaximumDeposit = async (
  protocol: Protocol,
  tokenInfo: TokenInfoLike,
  connection?: Connection
): Promise<TokenAmount> => {
  switch (protocol) {
    case "francium":
      return franciumGetMaximumDeposit(tokenInfo, connection)
    case "solend":
      return solendGetMaximumDeposit(tokenInfo, connection)
    case "solend-stable":
      return solendStableGetMaximumDeposit(tokenInfo, connection)
    case "solend-turbo":
      return solendTurboGetMaximumDeposit(tokenInfo, connection)
    default:
      throw new Error(`Unsupported protocol: ${protocol}`)
  }
}

export const deposit = async (
  protocol: Protocol,
  amount: TokenAmount,
  publicKey: PublicKeyLike,
  connection?: Connection
): Promise<Transaction[]> => {
  switch (protocol) {
    case "francium":
      return franciumDeposit(amount, publicKey, connection)
    case "solend":
      return solendDeposit(amount, publicKey, connection)
    case "solend-stable":
      return solendStableDeposit(amount, publicKey, connection)
    case "solend-turbo":
      return solendTurboDeposit(amount, publicKey, connection)
    default:
      throw new Error(`Unsupported protocol: ${protocol}`)
  }
}

export const withdraw = async (
  protocol: Protocol,
  amount: TokenAmount,
  publicKey: PublicKeyLike,
  connection?: Connection
): Promise<Transaction[]> => {
  switch (protocol) {
    case "francium":
      return franciumWithdraw(amount, publicKey, connection)
    case "solend":
      return solendWithdraw(amount, publicKey, connection)
    case "solend-stable":
      return solendStableWithdraw(amount, publicKey, connection)
    case "solend-turbo":
      return solendTurboWithdraw(amount, publicKey, connection)
    default:
      throw new Error(`Unsupported protocol: ${protocol}`)
  }
}
