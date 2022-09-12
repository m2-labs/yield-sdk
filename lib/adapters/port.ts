import { findTokenByMint } from "@m2-labs/token-amount"
import { Port, ReserveInfo } from "@port.finance/port-sdk"
import { FetchOptions, ProtocolRates } from "../types"
import { defaultConnection } from "../utils/connection"
import { buildAssetRate, buildProtocolRates } from "../utils/rate-fns"

export async function fetch({
  connection = defaultConnection("port"),
  tokens
}: FetchOptions = {}): Promise<ProtocolRates> {
  const port = Port.forMainNet({ connection })
  const context = await port.getReserveContext()
  const reserves: ReserveInfo[] = context.getAllReserves()

  const rates = reserves.map((reserve) => {
    const token = findTokenByMint(reserve.getAssetMintId())

    if (!token) {
      return
    }

    return buildAssetRate({
      token,
      deposit: reserve.getSupplyApy().getUnchecked().toNumber(),
      borrow: reserve.getBorrowApy().getUnchecked().toNumber()
    })
  })

  return buildProtocolRates("port", rates)
}
