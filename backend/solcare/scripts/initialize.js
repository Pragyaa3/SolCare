const anchor = require("@coral-xyz/anchor");
const { Connection, Keypair } = require("@solana/web3.js");
const fs = require("fs");

async function main() {
  // Setup connection
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  
  // Load wallet
  const walletFile = fs.readFileSync(
    process.env.HOME + "/.config/solana/id.json",
    "utf-8"
  );
  const walletKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(walletFile))
  );

  const wallet = new anchor.Wallet(walletKeypair);
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  const program = anchor.workspace.Solcare;
  anchor.setProvider(provider);

  const [platformPDA] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from("platform")],
    program.programId
  );

  try {
    await program.methods
      .initializePlatform()
      .accounts({
        platform: platformPDA,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Platform initialized!");
    console.log("Platform PDA:", platformPDA.toString());
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
