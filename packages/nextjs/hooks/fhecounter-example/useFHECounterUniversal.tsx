"use client";

import { useCallback, useState, useMemo } from "react";
import { useFhevmUniversal } from "@fhevm-sdk";
import { useWagmiEthers } from "../wagmi/useWagmiEthers";
import { useDeployedContractInfo } from "../helper";
import { ethers } from "ethers";
import type { AllowedChainIds } from "~~/utils/helper/networks";
import { useReadContract } from "wagmi";

/**
 * Universal FHEVM Counter Hook - Simplified with new SDK
 * 
 * Demonstrates the new universal SDK in action with minimal boilerplate
 */
export const useFHECounterUniversal = (initialMockChains?: Record<number, string>) => {
  const [message, setMessage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Wagmi + ethers interop
  const { chainId, isConnected, ethersSigner } = useWagmiEthers(initialMockChains);

  // Universal FHEVM setup - one hook to rule them all!
  const fhevm = useFhevmUniversal({
    provider: (typeof window !== 'undefined' ? window.ethereum : null) || "http://localhost:8545",
    signer: ethersSigner || null,
    mockChains: initialMockChains,
    onStatusChange: (status) => setMessage(`FHEVM Status: ${status}`),
  });

  // Contract info
  const allowedChainId = typeof chainId === "number" ? (chainId as AllowedChainIds) : undefined;
  const { data: fheCounter } = useDeployedContractInfo({ 
    contractName: "FHECounter", 
    chainId: allowedChainId 
  });

  // Contract instance using universal SDK
  const contract = useMemo(() => {
    if (!fheCounter?.address || !fheCounter?.abi || !fhevm.isReady || !ethersSigner) return null;
    
    return fhevm.createContract(fheCounter.address, [...fheCounter.abi] as any[], ethersSigner);
  }, [fheCounter, fhevm.isReady, fhevm.createContract, ethersSigner]);

  // Read count handle via wagmi
  const readResult = useReadContract({
    address: fheCounter?.address as `0x${string}` | undefined,
    abi: fheCounter?.abi as any,
    functionName: "getCount",
    query: {
      enabled: Boolean(fheCounter && fhevm.isReady),
      refetchOnWindowFocus: false,
    },
  });

  const countHandle = readResult.data as string | undefined;

  // Decrypt count using universal SDK
  const decryptCount = useCallback(async () => {
    if (!countHandle || !fheCounter?.address || !fhevm.decryption) return;
    
    if (countHandle === ethers.ZeroHash) {
      setMessage("Count is 0 (zero hash)");
      return BigInt(0);
    }

    try {
      setMessage("Decrypting count...");
      const result = await fhevm.decryption.decryptSingle(
        countHandle,
        fheCounter.address as `0x${string}`
      );
      setMessage("Count decrypted successfully!");
      return result;
    } catch (error) {
      setMessage(`Decryption failed: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }, [countHandle, fheCounter?.address, fhevm.decryption]);

  // Update counter using universal SDK
  const updateCounter = useCallback(
    async (value: number) => {
      if (!contract || !fhevm.encryption || isProcessing || value === 0) return;

      const op = value > 0 ? "increment" : "decrement";
      const valueAbs = Math.abs(value);
      
      setIsProcessing(true);
      setMessage(`Starting ${op}(${valueAbs})...`);

      try {
        // Create encryption for this specific contract
        const contractEncryption = fhevm.createEncryption(fheCounter!.address as `0x${string}`);
        
        if (!contractEncryption.encryption) {
          throw new Error("Encryption not available");
        }

        // Encrypt the value
        setMessage(`Encrypting ${valueAbs}...`);
        const encrypted = await contractEncryption.encryption.encryptUint32(valueAbs);

        // Call contract with encrypted value
        setMessage("Sending transaction...");
        const tx = await contract.write({
          functionName: op,
          abi: [...fheCounter!.abi] as any[],
          encryptionResult: encrypted,
        });

        setMessage("Waiting for confirmation...");
        await tx.wait();
        
        setMessage(`${op}(${valueAbs}) completed!`);
        
        // Refresh the count
        await readResult.refetch();
        
      } catch (error) {
        setMessage(`${op} failed: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsProcessing(false);
      }
    },
    [contract, fhevm.encryption, fhevm.createEncryption, fheCounter, isProcessing, readResult]
  );

  return {
    // FHEVM state
    ...fhevm,
    
    // Contract data
    contractAddress: fheCounter?.address,
    countHandle,
    
    // Actions
    decryptCount,
    updateCounter,
    refreshCount: readResult.refetch,
    
    // State
    message,
    isProcessing,
    
    // Computed flags
    canDecrypt: Boolean(countHandle && fhevm.canDecrypt && !fhevm.decryption?.isDecrypting),
    canUpdate: Boolean(contract && fhevm.canEncrypt && !isProcessing),
    hasCount: Boolean(countHandle && countHandle !== ethers.ZeroHash),
    
    // Wagmi state
    chainId,
    isConnected,
  };
};