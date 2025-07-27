import React, { useState } from "react";
import {
  AppConfig,
  UserSession,
  showConnect,
} from "@stacks/connect";
import {
  STACKS_TESTNET,
  StacksNetworks,
} from "@stacks/network";
import {
  AnchorMode,
  PostConditionMode,
  stringAsciiCV,
  uintCV,
  makeContractCall,
  broadcastTransaction,
} from "@stacks/transactions";

const appConfig = new AppConfig(["store_write"]);
const userSession = new UserSession({ appConfig });
const network = StacksNetworks[STACKS_TESTNET]; // ✅ FIXED

const contractAddress = "ST1V6J4PX4MRNCWE4RSJX3R9N79FVV9KFN6DYZ7WA";
const contractName = "nft-project";
const functionName = "mint-student-nft";

function App() {
  const [status, setStatus] = useState("");
  const [studentName, setStudentName] = useState("");
  const [score, setScore] = useState("");

  const connectWallet = () => {
    showConnect({
      userSession,
      appDetails: {
        name: "Student Progress NFTs",
        icon: window.location.origin + "/logo192.png",
      },
      onFinish: () => window.location.reload(),
    });
  };

  const mintNFT = async () => {
    if (!userSession.isUserSignedIn()) {
      alert("Please connect your wallet.");
      return;
    }

    const txOptions = {
      contractAddress,
      contractName,
      functionName,
      functionArgs: [
        stringAsciiCV(studentName),
        uintCV(Number(score)), // ⚠️ score as uintCV, change if needed
      ],
      senderKey: userSession.loadUserData().appPrivateKey,
      network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
    };

    try {
      setStatus("⏳ Sending transaction...");
      const tx = await makeContractCall(txOptions);
      const result = await broadcastTransaction(tx, network);
      setStatus(`✅ Transaction sent! TxID: ${result.txid}`);
    } catch (err) {
      console.error(err);
      setStatus("❌ Transaction failed");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>🎓 Student Progress NFTs</h1>
      {!userSession.isUserSignedIn() ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p><strong>Wallet Connected</strong></p>
          <input
            type="text"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          /><br /><br />
          <input
            type="number"
            placeholder="Score"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          /><br /><br />
          <button onClick={mintNFT}>Mint NFT</button>
          <p>{status}</p>
        </>
      )}
    </div>
  );
}

export default App;
