import {
  JetClient,
  JetMarket,
  JetReserve,
  JET_MARKET_ADDRESS
} from "@jet-lab/jet-engine"
import { Provider } from "@project-serum/anchor"
import { PublicKey, Transaction } from "@solana/web3.js"
import Decimal from "decimal.js"
import { AssetRate, ProtocolRates } from "../types"
import { defaultConnection } from "../utils/connection"

type AnchorWallet = {
  signTransaction(tx: Transaction): Promise<Transaction>
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>
  publicKey: PublicKey
}

class Wallet implements AnchorWallet {
  async signTransaction(tx: Transaction): Promise<Transaction> {
    throw new Error("Not implemented.")
  }

  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    throw new Error("Not implemented.")
  }

  get publicKey(): PublicKey {
    throw new Error("Not implemented.")
  }
}

const isSupportedAsset = (asset: string): boolean => {
  return [
    "Crypto.BTC/USD",
    "Crypto.ETH/USD",
    "Crypto.SOL/USD",
    "Crypto.USDC/USD"
  ].includes(asset)
}

const toAsset = (asset: string): string => {
  switch (asset) {
    case "Crypto.BTC/USD":
      return "BTC"
    case "Crypto.ETH/USD":
      return "ETH"
    case "Crypto.SOL/USD":
      return "SOL"
    case "Crypto.USDC/USD":
      return "USDC"
    default:
      throw new Error(`Unsupported asset: ${asset}`)
  }
}
export const fetch = async (
  connection = defaultConnection("jet")
): Promise<ProtocolRates> => {
  const wallet = new Wallet()
  const provider = new Provider(connection, wallet, Provider.defaultOptions())
  const client = await JetClient.connect(provider, true)
  const market = await JetMarket.load(client, JET_MARKET_ADDRESS)
  const reserves = await JetReserve.loadMultiple(client, market)

  const rates: AssetRate[] = reserves
    .filter((reserve) => {
      return isSupportedAsset(reserve.data.productData.product.symbol)
    })
    .map((reserve) => {
      return {
        asset: toAsset(reserve.data.productData.product.symbol),
        mint: reserve.data.tokenMint,
        deposit: new Decimal(reserve.data.depositApy),
        borrow: new Decimal(reserve.data.borrowApr)
      } as AssetRate
    })

  return {
    protocol: "jet",
    rates
  }
}
