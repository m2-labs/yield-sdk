import { findTokenByMint } from "@m2-labs/token-amount"
import { utils } from "@project-serum/anchor"
import { PublicKey } from "@solana/web3.js"
import { Cluster, createProgram, State } from "@zero_one/client"
import Decimal from "decimal.js"
import { ProtocolRates } from "../types"
import { defaultConnection } from "../utils/connection"
import { buildProvider } from "../utils/provider"
import { buildAssetRate, buildProtocolRates } from "../utils/rate-fns"

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

  const rates = Object.values(state.assets).map((a) => {
    const token = findTokenByMint(a.mint)

    if (!token) {
      return
    }

    return buildAssetRate({
      token,
      deposit: new Decimal(a.supplyApy).div(100),
      borrow: new Decimal(a.borrowsApy).div(100)
    })
  })

  return buildProtocolRates("01", rates)
}
