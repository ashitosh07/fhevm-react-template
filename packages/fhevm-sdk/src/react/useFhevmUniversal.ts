import { useMemo } from "react";
import { useFhevmClient } from "./useFhevmClient.js";
import { useFhevmEncryption } from "./useFhevmEncryption.js";
import { useFhevmDecryption } from "./useFhevmDecryption.js";
import { useInMemoryStorage } from "./useInMemoryStorage.js";
import { FhevmEncryption } from "../core/encryption.js";
import { FhevmContract } from "../core/contract.js";
import { ethers } from "ethers";

export type UseFhevmUniversalParams = {
  provider: ethers.Eip1193Provider | string;
  signer?: ethers.JsonRpcSigner | null;
  mockChains?: Record<number, string>;
  onStatusChange?: (status: string) => void;
};

/**
 * Universal FHEVM hook - One hook to rule them all
 * 
 * This hook provides a complete FHEVM setup with minimal configuration.
 * Perfect for getting started quickly with FHEVM in React applications.
 */
export function useFhevmUniversal(params: UseFhevmUniversalParams) {
  const { provider, signer, mockChains, onStatusChange } = params;
  
  // Storage for decryption signatures
  const { storage } = useInMemoryStorage();
  
  // Core FHEVM client
  const client = useFhevmClient({
    provider,
    mockChains,
    onStatusChange,
  });

  // Encryption utilities
  const encryption = useFhevmEncryption({
    instance: client.instance,
    signer: signer || null,
    contractAddress: null, // Will be set per contract
  });

  // Decryption utilities
  const decryption = useFhevmDecryption({
    instance: client.instance,
    signer: signer || null,
    storage,
  });

  // Helper to create contract instances
  const createContract = useMemo(() => {
    return (address: string, abi: any[], contractSigner?: ethers.JsonRpcSigner) => {
      const finalSigner = contractSigner || signer;
      if (!client.instance || !finalSigner) return null;
      
      const contractEncryption = new FhevmEncryption({
        instance: client.instance,
        signer: finalSigner,
        contractAddress: address as `0x${string}`,
      });
      
      return new FhevmContract(address, abi, finalSigner, contractEncryption);
    };
  }, [client.instance, signer]);

  // Helper to create encryption for specific contract
  const createEncryption = useMemo(() => {
    return (contractAddress: `0x${string}`) => {
      if (!client.instance || !signer) return { encryption: null, canEncrypt: false };
      
      const encryption = new FhevmEncryption({
        instance: client.instance,
        signer,
        contractAddress,
      });
      
      return { encryption, canEncrypt: true };
    };
  }, [client.instance, signer]);

  return {
    // Client state
    ...client,
    
    // Utilities
    encryption,
    decryption,
    storage,
    
    // Helpers
    createContract,
    createEncryption,
    
    // Convenience flags
    isReady: client.status === 'ready',
    isLoading: client.status === 'loading',
    hasError: client.status === 'error',
    canEncrypt: Boolean(client.instance && signer),
    canDecrypt: Boolean(client.instance && signer),
  };
}