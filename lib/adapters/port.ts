import { Port, ReserveInfo } from "@port.finance/port-sdk"
import { PublicKey } from "@solana/web3.js"
import { findTokenByMint } from "../tokens"
import { AssetRate, ProtocolRates } from "../types"
import { defaultConnection } from "../utils/connection"

export async function fetch(
  connection = defaultConnection("port")
): Promise<ProtocolRates> {
  const port = Port.forMainNet({ connection })
  const context = await port.getReserveContext()
  const reserves: ReserveInfo[] = context.getAllReserves()

  const rates: AssetRate[] = reserves
    .map((reserve) => {
      const token = findTokenByMint(reserve.getAssetMintId())

      if (!token) {
        return
      }

      return {
        asset: token.symbol,
        mint: new PublicKey(token.mint),
        deposit: reserve.getSupplyApy().getUnchecked().toNumber(),
        borrow: reserve.getBorrowApy().getUnchecked().toNumber()
      }
    })
    .filter(Boolean) as AssetRate[]

  return {
    protocol: "port",
    rates
  }
}
