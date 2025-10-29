const anchor = require("@coral-xyz/anchor");

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Solcare;
  
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
