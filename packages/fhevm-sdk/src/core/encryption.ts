import { FhevmInstance } from "../fhevmTypes.js";
import { RelayerEncryptedInput } from "@zama-fhe/relayer-sdk/web";
import { ethers } from "ethers";

export type EncryptionResult = {
  handles: Uint8Array[];
  inputProof: Uint8Array;
};

export type EncryptionConfig = {
  instance: FhevmInstance;
  signer: ethers.JsonRpcSigner;
  contractAddress: `0x${string}`;
};

export class FhevmEncryption {
  private config: EncryptionConfig;

  constructor(config: EncryptionConfig) {
    this.config = config;
  }

  async encrypt(buildFn: (builder: RelayerEncryptedInput) => void): Promise<EncryptionResult> {
    const { instance, signer, contractAddress } = this.config;
    
    const userAddress = await signer.getAddress();
    const input = instance.createEncryptedInput(contractAddress, userAddress) as RelayerEncryptedInput;
    
    buildFn(input);
    
    return await input.encrypt();
  }

  // Utility methods for common encryption patterns
  encryptUint8(value: number): Promise<EncryptionResult> {
    return this.encrypt(builder => builder.add8(value));
  }

  encryptUint16(value: number): Promise<EncryptionResult> {
    return this.encrypt(builder => builder.add16(value));
  }

  encryptUint32(value: number): Promise<EncryptionResult> {
    return this.encrypt(builder => builder.add32(value));
  }

  encryptUint64(value: bigint | number): Promise<EncryptionResult> {
    return this.encrypt(builder => builder.add64(value));
  }

  encryptBool(value: boolean): Promise<EncryptionResult> {
    return this.encrypt(builder => builder.addBool(value));
  }

  encryptAddress(value: string): Promise<EncryptionResult> {
    return this.encrypt(builder => builder.addAddress(value));
  }
}