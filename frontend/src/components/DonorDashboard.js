import React from "react";

export default function DonorDashboard() {
    const fundEmergency = (amount) => {
        alert(`Donating ${amount} SOL to emergency (simulate)`);
    };

    return (
        <div>
            <h2>Donor Dashboard</h2>
            <div>
                <button onClick={() => fundEmergency(1)}>Donate 1 SOL</button>
                <button onClick={() => fundEmergency(5)}>Donate 5 SOL</button>
            </div>
        </div>
    );
}
