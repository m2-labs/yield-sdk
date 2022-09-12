import { findTokenByMint } from "@m2-labs/token-amount"
import { utils } from "@project-serum/anchor"
import { PublicKey } from "@solana/web3.js"
import { Cluster, createProgram, State } from "@zero_one/client"
import Decimal from "decimal.js"
import { fetchHandler } from "../utils/fetch-fns"
import { buildAssetRate } from "../utils/rate-fns"

export const fetch = fetchHandler(
  "01",
  async ({ provider, isDesiredToken }) => {
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

      if (isDesiredToken(token)) {
        return buildAssetRate({
          token,
          deposit: new Decimal(a.supplyApy).div(100),
          borrow: new Decimal(a.borrowsApy).div(100)
        })
      }
    })

    return rates
  }
)
