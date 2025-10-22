import { useMemo } from "react";
import { FhevmEncryption, EncryptionConfig } from "../core/encryption.js";
import { FhevmInstance } from "../fhevmTypes.js";
import { ethers } from "ethers";

export function useFhevmEncryption(params: {
  instance: FhevmInstance | null;
  signer: ethers.JsonRpcSigner | null;
  contractAddress: `0x${string}` | null;
}) {
  const { instance, signer, contractAddress } = params;

  const encryption = useMemo(() => {
    if (!instance || !signer || !contractAddress) return null;
    
    return new FhevmEncryption({
      instance,
      signer,
      contractAddress,
    });
  }, [instance, signer, contractAddress]);

  const canEncrypt = Boolean(encryption);

  return {
    encryption,
    canEncrypt,
  };
}