import { useMemo, useState, useCallback } from "react";
import { FhevmDecryption, DecryptionRequest, DecryptionResult } from "../core/decryption.js";
import { FhevmInstance } from "../fhevmTypes.js";
import { GenericStringStorage } from "../storage/GenericStringStorage.js";
import { ethers } from "ethers";

export function useFhevmDecryption(params: {
  instance: FhevmInstance | null;
  signer: ethers.JsonRpcSigner | null;
  storage: GenericStringStorage;
}) {
  const { instance, signer, storage } = params;
  
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [results, setResults] = useState<DecryptionResult>({});
  const [error, setError] = useState<string | null>(null);

  const decryption = useMemo(() => {
    if (!instance || !signer) return null;
    
    return new FhevmDecryption({
      instance,
      signer,
      storage,
    });
  }, [instance, signer, storage]);

  const decrypt = useCallback(async (requests: DecryptionRequest[]) => {
    if (!decryption || isDecrypting) return;

    setIsDecrypting(true);
    setError(null);

    try {
      const result = await decryption.decrypt(requests);
      setResults(prev => ({ ...prev, ...result }));
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Decryption failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsDecrypting(false);
    }
  }, [decryption, isDecrypting]);

  const decryptSingle = useCallback(async (handle: string, contractAddress: `0x${string}`) => {
    const result = await decrypt([{ handle, contractAddress }]);
    return result?.[handle];
  }, [decrypt]);

  const canDecrypt = Boolean(decryption && !isDecrypting);

  return {
    decryption,
    decrypt,
    decryptSingle,
    canDecrypt,
    isDecrypting,
    results,
    error,
  };
}