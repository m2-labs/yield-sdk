import { Provider } from "@project-serum/anchor"
import { Connection } from "@solana/web3.js"
import { Wallet } from "./wallet"

export const buildProvider = (connection: Connection): Provider => {
  return new Provider(connection, new Wallet(), Provider.defaultOptions())
}
