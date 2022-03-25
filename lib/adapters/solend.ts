import { PublicKey } from "@solana/web3.js"
import { SolendMarket } from "@solendprotocol/solend-sdk"
import Decimal from "decimal.js"
import { AssetRate, ProtocolRates } from "../types"
import { defaultConnection } from "../utils/connection"

export async function fetch(
  connection = defaultConnection("solend")
): Promise<ProtocolRates> {
  const market = await SolendMarket.initialize(connection)
  await market.loadReserves()

  const rates: AssetRate[] = market.reserves
    .map((reserve) => {
      if (!reserve?.stats) {
        return
      }

      return {
        asset: toAsset(reserve.config.name),
        mint: new PublicKey(reserve.config.mintAddress),
        deposit: new Decimal(reserve.stats.supplyInterestAPY),
        borrow: new Decimal(reserve.stats.borrowInterestAPY)
      } as AssetRate
    })
    .filter(Boolean) as AssetRate[]

  return {
    protocol: "solend",
    rates
  }
}

function toAsset(asset: string): string {
  switch (asset) {
    case "Marinade staked SOL (mSOL)":
      return "mSOL"
    case "Mercurial":
      return "MER"
    case "Orca":
      return "ORCA"
    case "Raydium":
      return "RAY"
    case "Serum":
      return "SRM"
    case "USD Coin":
      return "USDC"
    case "Wrapped SOL":
      return "SOL"
    default:
      return asset
  }
}
