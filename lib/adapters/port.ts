import { Port, ReserveInfo } from "@port.finance/port-sdk"
import { PublicKey } from "@solana/web3.js"
import { ProtocolRates } from "../types"
import { asyncMap, compact } from "../utils/array-fns"
import { defaultConnection } from "../utils/connection"
import { findTokenByMint } from "../utils/tokens"

export async function fetch(
  connection = defaultConnection("port")
): Promise<ProtocolRates> {
  const port = Port.forMainNet({ connection })
  const context = await port.getReserveContext()
  const reserves: ReserveInfo[] = context.getAllReserves()

  const rates = await asyncMap(reserves, async (reserve) => {
    const token = await findTokenByMint(reserve.getAssetMintId())

    if (!token) {
      return
    }

    return {
      asset: token.symbol,
      mint: new PublicKey(token.address),
      deposit: reserve.getSupplyApy().getUnchecked().toNumber(),
      borrow: reserve.getBorrowApy().getUnchecked().toNumber()
    }
  })

  return {
    protocol: "port",
    rates: compact(rates)
  }
}
