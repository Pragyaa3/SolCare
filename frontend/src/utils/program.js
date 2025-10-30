import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';

export const PROGRAM_ID = new PublicKey('ExXRXq98DzqwjMRedc4h9WUxs8EcxvKYeky3pHosvfDj');

export const IDL = {
  "version": "0.1.0",
  "name": "solcare",
  "instructions": [
    {
      "name": "initializePlatform",
      "accounts": [
        { "name": "platform", "isMut": true, "isSigner": false },
        { "name": "authority", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": []
    },
    {
      "name": "requestLoan",
      "accounts": [
        { "name": "loan", "isMut": true, "isSigner": true },
        { "name": "platform", "isMut": true, "isSigner": false },
        { "name": "borrower", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "amount", "type": "u64" },
        { "name": "purpose", "type": "string" }
      ]
    },
    {
      "name": "postEmergency",
      "accounts": [
        { "name": "emergency", "isMut": true, "isSigner": true },
        { "name": "platform", "isMut": true, "isSigner": false },
        { "name": "patient", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "requestedAmount", "type": "u64" },
        { "name": "description", "type": "string" },
        { "name": "documentHash", "type": "string" }
      ]
    },
    {
      "name": "fundEmergency",
      "accounts": [
        { "name": "emergency", "isMut": true, "isSigner": false },
        { "name": "donor", "isMut": true, "isSigner": true },
        { "name": "platform", "isMut": true, "isSigner": false },
        { "name": "platformData", "isMut": false, "isSigner": false },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "amount", "type": "u64" }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Platform",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "authority", "type": "publicKey" },
          { "name": "totalLoans", "type": "u64" },
          { "name": "totalEmergencies", "type": "u64" },
          { "name": "totalFunded", "type": "u64" }
        ]
      }
    },
    {
      "name": "Loan",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "borrower", "type": "publicKey" },
          { "name": "amount", "type": "u64" },
          { "name": "repaid", "type": "u64" },
          { "name": "creditScore", "type": "u64" },
          { "name": "purpose", "type": "string" },
          { "name": "requestedAt", "type": "i64" },
          { "name": "isActive", "type": "bool" },
          { "name": "defaultCount", "type": "u8" }
        ]
      }
    },
    {
      "name": "Emergency",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "patient", "type": "publicKey" },
          { "name": "hospital", "type": "publicKey" },
          { "name": "amount", "type": "u64" },
          { "name": "fundedAmount", "type": "u64" },
          { "name": "description", "type": "string" },
          { "name": "documentHash", "type": "string" },
          { "name": "verified", "type": "bool" },
          { "name": "funded", "type": "bool" },
          { "name": "createdAt", "type": "i64" },
          { "name": "donors", "type": { "vec": "publicKey" } }
        ]
      }
    }
  ]
};

export function getPlatformPDA() {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from('platform')],
    PROGRAM_ID
  );
  return pda;
}

export function getProgram(wallet, connection) {
  const provider = new AnchorProvider(
    connection,
    wallet,
    { commitment: 'confirmed' }
  );
  return new Program(IDL, PROGRAM_ID, provider);
}

// 🔥 NEW: Auto-initialize platform if needed
export async function ensurePlatformInitialized(wallet, connection) {
  const program = getProgram(wallet, connection);
  const platformPDA = getPlatformPDA();

  try {
    await program.account.platform.fetch(platformPDA);
    return true; // Already initialized
  } catch (error) {
    console.log("📝 Platform not initialized, creating...");
    try {
      const tx = await program.methods
        .initializePlatform()
        .accounts({
          platform: platformPDA,
          authority: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      console.log("✅ Platform initialized! Tx:", tx);
      return true;
    } catch (initError) {
      console.error("❌ Failed to initialize platform:", initError);
      throw new Error("Could not initialize platform. Please try again.");
    }
  }
}

// 🔥 UPDATED: Request loan with auto-init
export async function requestLoan(wallet, connection, amount, purpose) {
  await ensurePlatformInitialized(wallet, connection);
  
  const program = getProgram(wallet, connection);
  const platformPDA = getPlatformPDA();
  const loanKeypair = web3.Keypair.generate();

  const tx = await program.methods
    .requestLoan(new BN(amount), purpose)
    .accounts({
      loan: loanKeypair.publicKey,
      platform: platformPDA,
      borrower: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([loanKeypair])
    .rpc();

  return { signature: tx, loanAccount: loanKeypair.publicKey };
}

// 🔥 UPDATED: Post emergency with auto-init
export async function postEmergency(wallet, connection, amount, description, documentHash) {
  await ensurePlatformInitialized(wallet, connection);
  
  const program = getProgram(wallet, connection);
  const platformPDA = getPlatformPDA();
  const emergencyKeypair = web3.Keypair.generate();

  const tx = await program.methods
    .postEmergency(new BN(amount), description, documentHash)
    .accounts({
      emergency: emergencyKeypair.publicKey,
      platform: platformPDA,
      patient: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([emergencyKeypair])
    .rpc();

  return { signature: tx, emergencyAccount: emergencyKeypair.publicKey };
}

// Fund emergency
export async function fundEmergency(wallet, connection, emergencyAccount, amount) {
  const program = getProgram(wallet, connection);
  const platformPDA = getPlatformPDA();

  const tx = await program.methods
    .fundEmergency(new BN(amount))
    .accounts({
      emergency: new PublicKey(emergencyAccount),
      donor: wallet.publicKey,
      platform: platformPDA,
      platformData: platformPDA,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return tx;
}

// Fetch loan data
export async function getLoan(connection, loanAccount) {
  const program = getProgram(null, connection);
  return await program.account.loan.fetch(new PublicKey(loanAccount));
}

// Fetch emergency data
export async function getEmergency(connection, emergencyAccount) {
  const program = getProgram(null, connection);
  return await program.account.emergency.fetch(new PublicKey(emergencyAccount));
}
