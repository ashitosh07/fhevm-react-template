// Universal FHEVM SDK - Framework Agnostic Core
export { FhevmClient } from "./core/client.js";
export { FhevmEncryption } from "./core/encryption.js";
export { FhevmDecryption } from "./core/decryption.js";
export { FhevmContract } from "./core/contract.js";

export type {
  FhevmClientConfig,
  FhevmClientState,
} from "./core/client.js";

export type {
  EncryptionResult,
  EncryptionConfig,
} from "./core/encryption.js";

export type {
  DecryptionRequest,
  DecryptionResult,
  DecryptionConfig,
} from "./core/decryption.js";

export type {
  ContractCallParams,
} from "./core/contract.js";

// Re-export core types and utilities
export * from "./fhevmTypes.js";
export * from "./storage/index.js";
export { FhevmDecryptionSignature } from "./FhevmDecryptionSignature.js";

// Convenience function to create a complete FHEVM setup
import { FhevmClient, FhevmEncryption, FhevmDecryption, FhevmContract } from "./core/index.js";
import { createInMemoryStorage } from "./storage/index.js";
import { ethers } from "ethers";

export type CreateFhevmOptions = {
  provider: ethers.Eip1193Provider | string;
  signer?: ethers.JsonRpcSigner;
  mockChains?: Record<number, string>;
  onStatusChange?: (status: string) => void;
};

export async function createFhevm(options: CreateFhevmOptions) {
  const { provider, signer, mockChains, onStatusChange } = options;
  
  // Create client
  const client = new FhevmClient({
    provider,
    mockChains,
    onStatusChange,
  });

  // Connect to get instance
  const instance = await client.connect();
  
  // Create storage
  const storage = createInMemoryStorage();

  // Create utilities (only if signer is provided)
  const encryption = signer ? new FhevmEncryption({ instance, signer, contractAddress: "0x" as `0x${string}` }) : null;
  const decryption = signer ? new FhevmDecryption({ instance, signer, storage }) : null;

  // Helper to create contract instances
  const createContract = (address: string, abi: any[], signerOrProvider?: ethers.Signer | ethers.Provider) => {
    const contractSigner = signerOrProvider || signer;
    if (!contractSigner) throw new Error("Signer or provider required for contract creation");
    
    const contractEncryption = signer ? new FhevmEncryption({ 
      instance, 
      signer, 
      contractAddress: address as `0x${string}` 
    }) : undefined;
    
    return new FhevmContract(address, abi, contractSigner, contractEncryption);
  };

  return {
    client,
    instance,
    encryption,
    decryption,
    storage,
    createContract,
  };
}