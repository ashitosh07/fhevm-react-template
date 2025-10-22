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
      <div className="card bg-gradient-to-br from-warning/10 to-warning/5 shadow-2xl border border-warning/30">
        <div className="card-body text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-warning to-warning/70 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 8A6 6 0 006.025.25 6.006 6.006 0 000 6v2c0 .894.106 1.76.305 2.584.182.756.453 1.48.801 2.142C1.677 14.04 2.053 15.5 2.053 17h15.894c0-1.5.376-2.96.947-4.274.348-.662.619-1.386.801-2.142A6.967 6.967 0 0020 8z" clipRule="evenodd"/>
            </svg>
          </div>
          <h2 className="card-title text-2xl justify-center mb-2">Wallet Connection Required</h2>
          <p className="text-warning/70 mb-4">Please connect your wallet to experience the Universal FHEVM SDK.</p>
          <div className="badge badge-warning badge-outline">MetaMask Recommended</div>
        </div>
      </div>
    );
  }

  if (fhevm.isLoading) {
    return (
      <div className="card bg-gradient-to-br from-info/10 to-info/5 shadow-2xl border border-info/30">
        <div className="card-body text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-info to-info/70 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="loading loading-spinner loading-lg text-white"></div>
          </div>
          <h2 className="card-title text-2xl justify-center mb-2">Initializing FHEVM</h2>
          <p className="text-info/70 mb-4">Setting up your Universal FHEVM SDK instance...</p>
          <div className="flex justify-center gap-2">
            <div className="badge badge-info badge-outline">Loading SDK</div>
            <div className="badge badge-info badge-outline">Connecting</div>
          </div>
        </div>
      </div>
    );
  }

  if (fhevm.hasError) {
    return (
      <div className="card bg-gradient-to-br from-error/10 to-error/5 shadow-2xl border border-error/30">
        <div className="card-body text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-error to-error/70 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
          </div>
          <h2 className="card-title text-2xl justify-center mb-2 text-error">Connection Error</h2>
          <p className="text-error/70 mb-4">Failed to initialize FHEVM: {fhevm.error?.message}</p>
          <button className="btn btn-error bg-gradient-to-r from-error to-error/80 shadow-lg" onClick={fhevm.refresh}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
            </svg>
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-gradient-to-br from-primary/5 to-secondary/5 shadow-2xl border border-primary/20">
      <div className="card-body">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <span className="text-2xl">🚀</span>
          </div>
          <div>
            <h2 className="card-title text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Universal FHEVM Counter
            </h2>
            <p className="text-sm opacity-70">
              Powered by the new Universal FHEVM SDK - framework-agnostic, minimal boilerplate!
            </p>
          </div>
        </div>
        
        <div className="divider"></div>
        
        {/* Contract Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="stat bg-gradient-to-br from-info/10 to-info/5 border border-info/20 rounded-xl p-4">
            <div className="stat-figure text-info">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className="stat-title text-info/70">Contract</div>
            <div className="stat-value text-sm text-info font-mono">
              {fhevm.contractAddress ? `${fhevm.contractAddress.slice(0, 6)}...${fhevm.contractAddress.slice(-4)}` : "Not found"}
            </div>
          </div>
          <div className="stat bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 rounded-xl p-4">
            <div className="stat-figure text-warning">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
            </div>
            <div className="stat-title text-warning/70">Chain ID</div>
            <div className="stat-value text-lg text-warning">{fhevm.chainId}</div>
          </div>
          <div className="stat bg-gradient-to-br from-success/10 to-success/5 border border-success/20 rounded-xl p-4">
            <div className="stat-figure text-success">
              <div className={`w-3 h-3 rounded-full ${fhevm.isReady ? 'bg-success animate-pulse' : 'bg-warning'}`}></div>
            </div>
            <div className="stat-title text-success/70">Status</div>
            <div className="stat-value text-lg text-success">
              {fhevm.isReady ? "✅ Ready" : "⏳ Loading"}
            </div>
          </div>
        </div>

        {/* Counter Actions */}
        <div className="card bg-gradient-to-br from-base-200/50 to-base-300/30 border border-base-300/50">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/70 rounded-lg flex items-center justify-center">
                <span className="text-lg">🔐</span>
              </div>
              <h3 className="card-title text-xl">Encrypted Counter Operations</h3>
            </div>
            
            {fhevm.hasCount && (
              <div className="alert alert-info bg-info/10 border-info/30 mb-4">
                <svg className="w-6 h-6 text-info" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                <span className="font-mono text-sm">Encrypted Handle: {fhevm.countHandle?.slice(0, 10)}...</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <button
                className="btn btn-success bg-gradient-to-r from-success to-success/80 border-success/50 hover:from-success/90 hover:to-success/70 shadow-lg"
                onClick={handleIncrement}
                disabled={!fhevm.canUpdate}
              >
                {fhevm.isProcessing ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                  </svg>
                )}
                Increment
              </button>
              
              <button
                className="btn btn-warning bg-gradient-to-r from-warning to-warning/80 border-warning/50 hover:from-warning/90 hover:to-warning/70 shadow-lg"
                onClick={handleDecrement}
                disabled={!fhevm.canUpdate}
              >
                {fhevm.isProcessing ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                  </svg>
                )}
                Decrement
              </button>
              
              <button
                className="btn btn-primary bg-gradient-to-r from-primary to-primary/80 border-primary/50 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                onClick={handleDecrypt}
                disabled={!fhevm.canDecrypt}
              >
                {fhevm.decryption?.isDecrypting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L3 9l7 7 7-7-7-7zM10 4.83L15.17 10 10 15.17 4.83 10 10 4.83z"/>
                  </svg>
                )}
                Decrypt
              </button>
            </div>

            {decryptedValue !== null && (
              <div className="alert alert-success bg-success/10 border-success/30 shadow-lg">
                <svg className="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <div>
                  <span className="font-semibold">Decryption Successful!</span>
                  <div className="text-2xl font-bold text-success mt-1">{String(decryptedValue)}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {fhevm.message && (
          <div className="alert bg-base-200/50 border-base-300/50 shadow-sm">
            <svg className="w-5 h-5 text-info" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <span className="font-medium">{fhevm.message}</span>
          </div>
        )}

        {/* SDK Info */}
        <div className="divider opacity-30"></div>
        <div className="card bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20">
          <div className="card-body p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🎯</span>
              <h4 className="font-bold text-accent">Universal SDK Features Demonstrated</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                <span>Single hook setup with <code className="bg-accent/20 px-1 rounded text-accent">useFhevmUniversal()</code></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                <span>Automatic encryption/decryption handling</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                <span>Framework-agnostic core (React, Vue, Node.js)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                <span>Wagmi-like patterns for web3 developers</span>
              </div>
              <div className="flex items-center gap-2 md:col-span-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                <span>Minimal boilerplate (&lt;10 lines to get started)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};