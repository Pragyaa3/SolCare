import React, { useState } from "react";

export default function VendorDashboard() {
    const [loanAmount, setLoanAmount] = useState(0);

    const requestLoan = async () => {
        // Call SolCare smart contract request_loan function
        alert(`Requesting loan of ${loanAmount} SOL (simulate for demo)`);
    };

    const postEmergency = async () => {
        // Call post_emergency smart contract function
        alert("Posting emergency with zk proof (simulate for demo)");
    };

    return (
        <div>
            <h2>Vendor Dashboard</h2>
            <div>
                <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="Loan Amount"
                />
                <button onClick={requestLoan}>Request Loan</button>
            </div>
            <div>
                <button onClick={postEmergency}>Post Emergency</button>
            </div>
        </div>
    );
}
