import { utils } from "@project-serum/anchor"
import { PublicKey } from "@solana/web3.js"
import { Cluster, createProgram, State } from "@zero_one/client"
import Decimal from "decimal.js"
import { ProtocolRates } from "../types"
import { asyncMap, compact } from "../utils/array-fns"
import { defaultConnection } from "../utils/connection"
import { buildProvider } from "../utils/provider"
import { findTokenByMint } from "../utils/tokens"

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

  const rates = await asyncMap(Object.values(state.assets), async (a) => {
    const token = await findTokenByMint(a.mint)

    if (!token) {
      return
    }

    return {
      asset: token.symbol,
      mint: new PublicKey(token.address),
      deposit: new Decimal(a.supplyApy).div(100),
      borrow: new Decimal(a.borrowsApy).div(100)
    }
  })

  return {
    protocol: "01",
    rates: compact(rates)
  }
}
