import { TokenAmount, TokenInfoLike } from "@m2-labs/token-amount"
import { Connection, Transaction } from "@solana/web3.js"
import type {
  FetchOptions,
  Protocol,
  ProtocolFeature,
  ProtocolRates
} from "../types"
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
import { fetch as jetv2 } from "./jetv2"
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
  opts?: FetchOptions
): Promise<ProtocolRates> => {
  try {
    switch (protocol) {
      case "apricot":
        return apricot(opts)
      case "francium":
        return francium(opts)
      case "jet":
        return jet(opts)
      case "jetv2":
        return jetv2(opts)
      case "larix":
        return larix(opts)
      case "mango":
        return mango(opts)
      case "port":
        return port(opts)
      case "solend":
        return solend(opts)
      case "solend-stable":
        return solendStable(opts)
      case "solend-turbo":
        return solendTurbo(opts)
      case "tulip":
        return tulip(opts)
      case "01":
        return zeroOne(opts)
      default:
        throw new Error(`Unsupported protocol: ${protocol}`)
    }
  } catch (e) {
    console.error(
      `Error fetching ${protocol} ${opts?.connection?.rpcEndpoint}`,
      e
    )
    throw e
  }
}

/**
 *
 * @param connection
 * @returns
 */
export const fetchAll = async (
  opts?: FetchOptions
): Promise<ProtocolRates[]> => {
  return Promise.all([
    fetch("apricot", opts),
    fetch("francium", opts),
    fetch("jet", opts),
    fetch("jetv2", opts),
    fetch("larix", opts),
    fetch("mango", opts),
    fetch("port", opts),
    fetch("solend", opts),
    fetch("solend-stable", opts),
    fetch("solend-turbo", opts),
    fetch("tulip", opts),
    fetch("01", opts)
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

export const supportedFeatures = (protocol: Protocol): ProtocolFeature[] => {
  switch (protocol) {
    case "francium":
    case "solend":
    case "solend-stable":
    case "solend-turbo":
      return [
        "fetch",
        "deposit",
        "withdraw",
        "getDepositedBalance",
        "getMaximumDeposit"
      ]
    default:
      return ["fetch"]
  }
}
