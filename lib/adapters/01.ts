import { utils } from "@project-serum/anchor"
import { PublicKey } from "@solana/web3.js"
import { Cluster, createProgram, State } from "@zero_one/client"
import Decimal from "decimal.js"
import { findTokenByMint } from "../tokens"
import { AssetRate, ProtocolRates } from "../types"
import { defaultConnection } from "../utils/connection"
import { buildProvider } from "../utils/provider"

export async function fetch(
  connection = defaultConnection("01")
): Promise<ProtocolRates> {
  const provider = buildProvider(connection)
  const program = createProgram(provider, Cluster.Mainnet)

  const [globalStateKey] = await PublicKey.findProgramAddress(
    [utils.bytes.utf8.encode("statev1")],
    program.programId
  )
  const globalState = await program.account.globalState.fetch(globalStateKey)
  const state: State = await State.load(program, globalState.state)

  const rates: AssetRate[] = []

  Object.values(state.assets).forEach((a) => {
    const token = findTokenByMint(a.mint)

    if (!token) {
      return
    }

    rates.push({
      asset: token.symbol,
      mint: new PublicKey(token.mint),
      deposit: new Decimal(a.supplyApy),
      borrow: new Decimal(a.borrowsApy)
    })
  })

  return {
    protocol: "01",
    rates
  }
}
