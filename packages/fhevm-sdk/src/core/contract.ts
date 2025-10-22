import { ethers } from "ethers";
import { FhevmEncryption, EncryptionResult } from "./encryption.js";

export type ContractCallParams = {
  functionName: string;
  abi: any[];
  args?: any[];
  encryptionResult?: EncryptionResult;
};

export class FhevmContract {
  private contract: ethers.Contract;
  private encryption?: FhevmEncryption;

  constructor(
    address: string,
    abi: any[],
    signerOrProvider: ethers.Signer | ethers.Provider,
    encryption?: FhevmEncryption
  ) {
    this.contract = new ethers.Contract(address, abi, signerOrProvider);
    this.encryption = encryption;
  }

  // Read methods
  async read(functionName: string, ...args: any[]): Promise<any> {
    return await this.contract[functionName](...args);
  }

  // Write methods with automatic encryption support
  async write(params: ContractCallParams): Promise<ethers.ContractTransactionResponse> {
    const { functionName, abi, args = [], encryptionResult } = params;

    let finalArgs = args;

    if (encryptionResult) {
      // Build parameters from encryption result and ABI
      const contractArgs = this.buildParamsFromAbi(encryptionResult, abi, functionName);
      finalArgs = [...args, ...contractArgs];
    }

    return await this.contract[functionName](...finalArgs);
  }

  // Utility to build contract parameters from encryption result
  private buildParamsFromAbi(enc: EncryptionResult, abi: any[], functionName: string): any[] {
    const fn = abi.find((item: any) => item.type === "function" && item.name === functionName);
    if (!fn) throw new Error(`Function ABI not found for ${functionName}`);

    return fn.inputs.map((input: any, index: number) => {
      const raw = index === 0 ? enc.handles[0] : enc.inputProof;
      return this.convertToAbiType(raw, input.type);
    });
  }

  private convertToAbiType(raw: Uint8Array, type: string): any {
    const hex = "0x" + Buffer.from(raw).toString("hex");
    
    switch (type) {
      case "bytes32":
      case "bytes":
        return hex;
      case "uint256":
        return BigInt(hex);
      case "address":
      case "string":
        return hex;
      case "bool":
        return Boolean(raw);
      default:
        return hex;
    }
  }

  // Get the underlying ethers contract for advanced usage
  getContract(): ethers.Contract {
    return this.contract;
  }

  // Get contract address
  get address(): string {
    return this.contract.target as string;
  }

  // Get contract interface
  get interface(): ethers.Interface {
    return this.contract.interface;
  }
}