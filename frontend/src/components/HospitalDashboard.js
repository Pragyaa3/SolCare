import React from "react";

export default function HospitalDashboard() {
    const verifyEmergency = (id) => {
        alert(`Verifying emergency request ${id} (simulate)`);
    };

    return (
        <div>
            <h2>Hospital Dashboard</h2>
            <div>
                <button onClick={() => verifyEmergency(1)}>Verify Emergency #1</button>
            </div>
        </div>
    );
}
