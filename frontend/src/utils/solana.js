import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

export const connection = new Connection(clusterApiUrl("devnet"));

export const programID = new PublicKey("ExXRXq98DzqwjMRedc4h9WUxs8EcxvKYeky3pHosvfDj ");

export const getProvider = (wallet) => {
    return {
        connection,
        wallet,
        opts: { preflightCommitment: "processed" },
    };
};
