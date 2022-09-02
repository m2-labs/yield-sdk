import {
  asDecimal,
  DecimalLike
} from "@m2-labs/token-amount/dist/utils/decimal-fns"
import { TokenInfo } from "@solana/spl-token-registry"
import { AssetRate, Protocol, ProtocolRates } from "../types"
import { compact } from "./array-fns"
import { asPublicKey } from "./public-key"

type BuildAssetRate = (arg0: {
  token: TokenInfo
  deposit?: DecimalLike
  borrow?: DecimalLike
}) => AssetRate

export const buildAssetRate: BuildAssetRate = ({ token, deposit, borrow }) => {
  const symbol = token.symbol
  const mint = asPublicKey(token.address)

  return {
    symbol,
    token,
    deposit: deposit !== undefined ? asDecimal(deposit) : undefined,
    borrow: borrow !== undefined ? asDecimal(borrow) : undefined,
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
