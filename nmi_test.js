// OmniRails API Sandbox Test -> NMI Direct Post Integration
// Objective: Validate Handshake & Level 3 Data Injection

const NMI_API_KEY = "tTTP5V8dS54hQgC6n6Jf9E7GTY92z3g5"; 
const NMI_ENDPOINT = "https://secure.networkmerchants.com/api/transact.php";

async function runOmniRailsL3Test() {
    console.log("🟢 [OmniRails] Booting Sandbox Engine...");
    console.log("📦 [OmniRails] Formatting B2B Payload with Level 3 Data...");

    // 1. Construct the NMI Payload (URL Encoded Format)
    const payload = new URLSearchParams({
        'security_key': NMI_API_KEY,
        'type': 'sale',
        'amount': '1045.00',
        'ccnumber': '4111111111111111', // Standard Visa Test Card
        'ccexp': '1228',                // MMYY expiration
        
        // --- LEVEL 3 B2B INJECTION DATA ---
        'ponumber': 'PO-OMNI-99824',
        'tax': '45.00',
        'freight': '100.00',
        'duty': '0.00',
        'shipping_postal_code': '60201' // Evanston IL
    });

    try {
        console.log("🚀 [OmniRails] Firing payload to NMI Gateway...");
        
        // 2. The Handshake (Send to NMI)
        const response = await fetch(NMI_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: payload.toString()
        });

        // 3. The Response Capture
        const responseText = await response.text();
        
        console.log("\n========================================");
        console.log("📡 NMI GATEWAY RESPONSE CAPTURED");
        console.log("========================================");
        
        const responseData = new URLSearchParams(responseText);
        const resultObject = Object.fromEntries(responseData.entries());
        
        console.log(resultObject);
        console.log("========================================\n");

        if (resultObject.response === '1') {
            console.log(`✅ [SUCCESS] Transaction Approved! Auth Code: ${resultObject.authcode}`);
            console.log(`✅ [SUCCESS] OmniRails successfully injected L3 Data for PO: PO-OMNI-99824`);
        } else {
            console.log(`❌ [DECLINE] Gateway responded with: ${resultObject.responsetext}`);
        }

    } catch (error) {
        console.error("🚨 [ERROR] OmniRails failed to reach NMI Gateway:", error);
    }
}

// Execute the test
runOmniRailsL3Test();
