"use client";

import { useState } from "react";
import { useFHECounterUniversal } from "~~/hooks/fhecounter-example/useFHECounterUniversal";

/**
 * Universal FHEVM Counter Demo
 * 
 * Showcases the new universal SDK with minimal boilerplate.
 * Compare this to the original FHECounterDemo to see the improvement!
 */
export const FHECounterUniversalDemo = () => {
  const [decryptedValue, setDecryptedValue] = useState<string | bigint | boolean | null>(null);
  
  // One hook, minimal setup - that's it!
  const fhevm = useFHECounterUniversal({
    31337: "http://localhost:8545", // Hardhat local
  });

  const handleDecrypt = async () => {
    try {
      const result = await fhevm.decryptCount();
      setDecryptedValue(result || null);
    } catch (error) {
      console.error("Decryption failed:", error);
    }
  };

  const handleIncrement = () => fhevm.updateCounter(1);
  const handleDecrement = () => fhevm.updateCounter(-1);

  if (!fhevm.isConnected) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Universal FHEVM Counter</h2>
          <p>Please connect your wallet to continue.</p>
        </div>
      </div>
    );
  }

  if (fhevm.isLoading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Universal FHEVM Counter</h2>
          <p>Loading FHEVM instance...</p>
          <div className="loading loading-spinner loading-md"></div>
        </div>
      </div>
    );
  }

  if (fhevm.hasError) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-error">Universal FHEVM Counter</h2>
          <p className="text-error">Error: {fhevm.error?.message}</p>
          <button className="btn btn-primary" onClick={fhevm.refresh}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Universal FHEVM Counter 🚀</h2>
        <p className="text-sm opacity-70">
          Powered by the new Universal FHEVM SDK - framework-agnostic, minimal boilerplate!
        </p>
        
        <div className="divider"></div>
        
        {/* Contract Info */}
        <div className="stats stats-vertical lg:stats-horizontal shadow">
          <div className="stat">
            <div className="stat-title">Contract</div>
            <div className="stat-value text-sm">
              {fhevm.contractAddress ? `${fhevm.contractAddress.slice(0, 6)}...${fhevm.contractAddress.slice(-4)}` : "Not found"}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Chain ID</div>
            <div className="stat-value text-lg">{fhevm.chainId}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Status</div>
            <div className="stat-value text-lg">
              {fhevm.isReady ? "✅ Ready" : "⏳ Loading"}
            </div>
          </div>
        </div>

        {/* Counter Actions */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="card-title text-lg">Encrypted Counter</h3>
            
            {fhevm.hasCount && (
              <div className="alert alert-info">
                <span>Encrypted Handle: {fhevm.countHandle?.slice(0, 10)}...</span>
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              <button
                className="btn btn-success"
                onClick={handleIncrement}
                disabled={!fhevm.canUpdate}
              >
                {fhevm.isProcessing ? <span className="loading loading-spinner loading-sm"></span> : "+"} 
                Increment
              </button>
              
              <button
                className="btn btn-warning"
                onClick={handleDecrement}
                disabled={!fhevm.canUpdate}
              >
                {fhevm.isProcessing ? <span className="loading loading-spinner loading-sm"></span> : "-"} 
                Decrement
              </button>
              
              <button
                className="btn btn-primary"
                onClick={handleDecrypt}
                disabled={!fhevm.canDecrypt}
              >
                {fhevm.decryption?.isDecrypting ? <span className="loading loading-spinner loading-sm"></span> : "🔓"} 
                Decrypt
              </button>
            </div>

            {decryptedValue !== null && (
              <div className="alert alert-success">
                <span>Decrypted Value: <strong>{String(decryptedValue)}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {fhevm.message && (
          <div className="alert alert-info">
            <span>{fhevm.message}</span>
          </div>
        )}

        {/* SDK Info */}
        <div className="divider"></div>
        <div className="text-xs opacity-50">
          <p>🎯 <strong>Universal SDK Features Demonstrated:</strong></p>
          <ul className="list-disc list-inside ml-4">
            <li>Single hook setup with <code>useFhevmUniversal()</code></li>
            <li>Automatic encryption/decryption handling</li>
            <li>Framework-agnostic core (works with React, Vue, Node.js)</li>
            <li>Wagmi-like patterns for web3 developers</li>
            <li>Minimal boilerplate (&lt;10 lines to get started)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};