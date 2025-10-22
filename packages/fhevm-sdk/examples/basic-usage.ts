// Basic Universal FHEVM SDK Usage Example
import { createFhevm } from '@fhevm-sdk/universal';
import { ethers } from 'ethers';

async function basicExample() {
  // 1. Setup with minimal configuration
  const fhevm = await createFhevm({
    provider: 'http://localhost:8545', // or window.ethereum
    signer: new ethers.JsonRpcSigner(new ethers.JsonRpcProvider('http://localhost:8545'), '0x...'),
  });

  // 2. Create a contract instance
  const contract = fhevm.createContract(
    '0x1234567890123456789012345678901234567890',
    [
      {
        "type": "function",
        "name": "increment",
        "inputs": [{"type": "bytes32", "internalType": "externalEuint32"}],
      }
    ]
  );

  // 3. Encrypt and call contract
  if (fhevm.encryption) {
    const encrypted = await fhevm.encryption.encryptUint32(42);
    
    await contract.write({
      functionName: 'increment',
      abi: contract.getContract().interface.fragments,
      encryptionResult: encrypted,
    });
  }

  // 4. Decrypt results
  if (fhevm.decryption) {
    const result = await fhevm.decryption.decryptSingle(
      '0xabcd...', // handle from contract
      '0x1234567890123456789012345678901234567890' // contract address
    );
    console.log('Decrypted value:', result);
  }
}

// React usage example
import { useFhevmUniversal } from '@fhevm-sdk/react';

function MyReactComponent() {
  const fhevm = useFhevmUniversal({
    provider: window.ethereum,
    signer: null, // Will be set when user connects wallet
  });

  if (fhevm.isLoading) return <div>Loading FHEVM...</div>;
  if (fhevm.hasError) return <div>Error: {fhevm.error?.message}</div>;
  if (!fhevm.isReady) return <div>Connect wallet to continue</div>;

  return <div>FHEVM Ready! Instance: {fhevm.instance ? 'Connected' : 'Not connected'}</div>;
}

// Vue usage example
import { useFhevmUniversal } from '@fhevm-sdk/vue';

function useMyVueComponent() {
  const fhevm = useFhevmUniversal({
    provider: window.ethereum,
    signer: null,
  });

  return {
    fhevm,
    isReady: fhevm.isReady,
    isLoading: fhevm.isLoading,
  };
}