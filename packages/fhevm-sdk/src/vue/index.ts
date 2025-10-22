// Vue 3 Composition API adapter for FHEVM SDK
// Note: Vue must be installed as a peer dependency to use this module
type VueRef<T> = { value: T };
type VueComputed<T> = { value: T };

// These will be properly typed when Vue is available
const ref: any = (value: any) => ({ value });
const computed: any = (fn: any) => ({ value: fn() });
const onUnmounted: any = (fn: any) => {};
import { FhevmClient, FhevmClientConfig } from '../core/client.js';
import { FhevmEncryption } from '../core/encryption.js';
import { FhevmDecryption, DecryptionRequest } from '../core/decryption.js';
import { FhevmContract } from '../core/contract.js';
import { createInMemoryStorage } from '../storage/index.js';
import { ethers } from 'ethers';

export function useFhevmClient(config: FhevmClientConfig) {
  const client = new FhevmClient(config);
  const state = ref(client.getState());
  
  const unsubscribe = client.subscribe((newState) => {
    state.value = newState;
  });

  onUnmounted(() => {
    unsubscribe();
    client.disconnect();
  });

  const connect = async () => {
    return await client.connect();
  };

  const disconnect = () => {
    client.disconnect();
  };

  return {
    state: computed(() => state.value),
    instance: computed(() => state.value.instance),
    status: computed(() => state.value.status),
    error: computed(() => state.value.error),
    client,
    connect,
    disconnect,
  };
}

export function useFhevmUniversal(params: {
  provider: ethers.Eip1193Provider | string;
  signer?: any;
  mockChains?: Record<number, string>;
  onStatusChange?: (status: string) => void;
}) {
  const { provider, signer, mockChains, onStatusChange } = params;
  
  const client = useFhevmClient({
    provider,
    mockChains,
    onStatusChange,
  });

  const createContract = (address: string, abi: any[]) => {
    return computed(() => {
      if (!client.instance.value || !signer) return null;
      
      const contractEncryption = new FhevmEncryption({
        instance: client.instance.value,
        signer,
        contractAddress: address as `0x${string}`,
      });
      
      return new FhevmContract(address, abi, signer, contractEncryption);
    });
  };

  return {
    ...client,
    createContract,
    isReady: computed(() => client.status.value === 'ready'),
    isLoading: computed(() => client.status.value === 'loading'),
    hasError: computed(() => client.status.value === 'error'),
    canEncrypt: computed(() => Boolean(client.instance.value && signer)),
    canDecrypt: computed(() => Boolean(client.instance.value && signer)),
  };
}