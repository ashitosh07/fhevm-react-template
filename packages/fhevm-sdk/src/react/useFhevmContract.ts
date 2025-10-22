import { useMemo } from "react";
import { FhevmContract } from "../core/contract.js";
import { FhevmEncryption } from "../core/encryption.js";
import { FhevmInstance } from "../fhevmTypes.js";
import { ethers } from "ethers";

export function useFhevmContract(params: {
  address: string | null;
  abi: any[] | null;
  instance: FhevmInstance | null;
  signer?: ethers.JsonRpcSigner | null;
  provider?: ethers.Provider | null;
}) {
  const { address, abi, instance, signer, provider } = params;

  const contract = useMemo(() => {
    if (!address || !abi) return null;
    
    const signerOrProvider = signer || provider;
    if (!signerOrProvider) return null;

    const encryption = instance && signer ? new FhevmEncryption({
      instance,
      signer,
      contractAddress: address as `0x${string}`,
    }) : undefined;

    return new FhevmContract(address, abi, signerOrProvider, encryption);
  }, [address, abi, instance, signer, provider]);

  const canRead = Boolean(contract);
  const canWrite = Boolean(contract && signer);

  return {
    contract,
    canRead,
    canWrite,
  };
}