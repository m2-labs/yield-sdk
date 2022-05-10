import { TokenInfo } from "@solana/spl-token-registry"
import Decimal from "decimal.js"
import { AssetRate, Protocol, ProtocolRates } from "../types"
import { compact } from "./array-fns"
import { asPublicKey } from "./public-key"

type BuildAssetRate = (arg0: {
  token: TokenInfo
  deposit?: Decimal
  borrow?: Decimal
}) => AssetRate

export const buildAssetRate: BuildAssetRate = ({ token, deposit, borrow }) => {
  const symbol = token.symbol
  const mint = asPublicKey(token.address)

  return {
    symbol,
    token,
    deposit,
    borrow,

    asset: symbol,
    mint
  }
}

type BuildProtocolRates = (
  protocol: Protocol,
  rates: (AssetRate | undefined | null)[]
) => ProtocolRates

export const buildProtocolRates: BuildProtocolRates = (protocol, rates) => ({
  protocol,
  rates: compact(rates)
})
