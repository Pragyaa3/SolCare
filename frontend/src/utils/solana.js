import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

export const connection = new Connection(clusterApiUrl("devnet"));

export const programID = new PublicKey("ReplaceWithYourDeployedProgramID");

export const getProvider = (wallet) => {
    return {
        connection,
        wallet,
        opts: { preflightCommitment: "processed" },
    };
};
