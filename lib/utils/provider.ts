import { Provider } from "@project-serum/anchor"
import { Connection } from "@solana/web3.js"
import { Wallet } from "./wallet"

export const buildProvider = (onnection: Connection): Provider => {
  return new Provider(onnection, new Wallet(), Provider.defaultOptions())
}
