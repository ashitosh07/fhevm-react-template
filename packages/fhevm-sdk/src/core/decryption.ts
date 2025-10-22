import { FhevmInstance } from "../fhevmTypes.js";
import { FhevmDecryptionSignature } from "../FhevmDecryptionSignature.js";
import { GenericStringStorage } from "../storage/GenericStringStorage.js";
import { ethers } from "ethers";

export type DecryptionRequest = {
  handle: string;
  contractAddress: `0x${string}`;
};

export type DecryptionResult = Record<string, string | bigint | boolean>;

export type DecryptionConfig = {
  instance: FhevmInstance;
  signer: ethers.JsonRpcSigner;
  storage: GenericStringStorage;
};

export class FhevmDecryption {
  private config: DecryptionConfig;

  constructor(config: DecryptionConfig) {
    this.config = config;
  }

  async decrypt(requests: DecryptionRequest[]): Promise<DecryptionResult> {
    const { instance, signer, storage } = this.config;

    if (!requests.length) {
      return {};
    }

    // Get unique contract addresses for signature
    const uniqueAddresses = Array.from(
      new Set(requests.map(r => r.contractAddress))
    ) as `0x${string}`[];

    // Load or create decryption signature
    const signature = await FhevmDecryptionSignature.loadOrSign(
      instance,
      uniqueAddresses,
      signer,
      storage
    );

    if (!signature) {
      throw new Error("Failed to create decryption signature");
    }

    // Perform decryption
    const mutableRequests = requests.map(r => ({
      handle: r.handle,
      contractAddress: r.contractAddress,
    }));

    return await instance.userDecrypt(
      mutableRequests,
      signature.privateKey,
      signature.publicKey,
      signature.signature,
      signature.contractAddresses,
      signature.userAddress,
      signature.startTimestamp,
      signature.durationDays
    );
  }

  async decryptSingle(handle: string, contractAddress: `0x${string}`): Promise<string | bigint | boolean | undefined> {
    const result = await this.decrypt([{ handle, contractAddress }]);
    return result[handle];
  }
}