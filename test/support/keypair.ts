import { Connection, Keypair } from "@solana/web3.js"

export const PUBLIC_KEY = "GWrK4sR1bGzpjdvF12zmuuX4arkkku4BLnnuauLSVPLi"
export const TEST_KEYPAIR = Keypair.generate()

export const connection = new Connection("https://api.devnet.solana.com", {
  commitment: "finalized"
})
