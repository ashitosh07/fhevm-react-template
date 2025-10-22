# Universal FHEVM SDK 🚀

A framework-agnostic, developer-friendly SDK for building FHEVM-enabled applications with minimal boilerplate.

## ✨ Features

- **🌐 Framework Agnostic**: Works with React, Vue, Node.js, and any JavaScript environment
- **⚡ Minimal Setup**: Get started with less than 10 lines of code
- **🎣 Wagmi-like API**: Familiar patterns for web3 developers
- **🔐 Complete FHEVM Support**: Encryption, decryption, and contract interactions
- **🧩 Modular Design**: Use only what you need
- **📦 Single Package**: All dependencies bundled, no scattered imports

## 🚀 Quick Start

### Installation

```bash
npm install @fhevm-sdk
# or
pnpm add @fhevm-sdk
```

### Basic Usage (Framework Agnostic)

```typescript
import { createFhevm } from '@fhevm-sdk/universal';

// 1. Setup FHEVM with minimal config
const fhevm = await createFhevm({
  provider: window.ethereum, // or 'http://localhost:8545'
  signer: yourEthersSigner,
});

// 2. Create contract instance
const contract = fhevm.createContract(contractAddress, contractAbi);

// 3. Encrypt and call contract
const encrypted = await fhevm.encryption.encryptUint32(42);
await contract.write({
  functionName: 'increment',
  abi: contractAbi,
  encryptionResult: encrypted,
});

// 4. Decrypt results
const result = await fhevm.decryption.decryptSingle(handle, contractAddress);
```

### React Usage

```tsx
import { useFhevmUniversal } from '@fhevm-sdk/react';

function MyComponent() {
  const fhevm = useFhevmUniversal({
    provider: window.ethereum,
    signer: yourSigner,
  });

  if (fhevm.isLoading) return <div>Loading FHEVM...</div>;
  if (fhevm.hasError) return <div>Error: {fhevm.error?.message}</div>;
  
  return (
    <div>
      <button onClick={() => fhevm.connect()}>
        Connect FHEVM
      </button>
      {fhevm.isReady && <div>FHEVM Ready! 🎉</div>}
    </div>
  );
}
```

### Vue Usage

```vue
<script setup>
import { useFhevmUniversal } from '@fhevm-sdk/vue';

const fhevm = useFhevmUniversal({
  provider: window.ethereum,
  signer: yourSigner,
});
</script>

<template>
  <div>
    <div v-if="fhevm.isLoading.value">Loading FHEVM...</div>
    <div v-else-if="fhevm.hasError.value">Error: {{ fhevm.error.value?.message }}</div>
    <div v-else-if="fhevm.isReady.value">FHEVM Ready! 🎉</div>
  </div>
</template>
```

## 📚 API Reference

### Core Classes

#### `FhevmClient`
Framework-agnostic FHEVM client with state management.

```typescript
const client = new FhevmClient({
  provider: window.ethereum,
  mockChains: { 31337: 'http://localhost:8545' },
  onStatusChange: (status) => console.log(status),
});

await client.connect();
const instance = client.getInstance();
```

#### `FhevmEncryption`
Handles all encryption operations with type-safe methods.

```typescript
const encryption = new FhevmEncryption({ instance, signer, contractAddress });

// Type-specific encryption
await encryption.encryptUint8(255);
await encryption.encryptUint32(1000000);
await encryption.encryptBool(true);
await encryption.encryptAddress('0x...');

// Custom encryption
await encryption.encrypt(builder => {
  builder.add32(42);
  builder.addBool(true);
});
```

#### `FhevmDecryption`
Simplified decryption with automatic signature handling.

```typescript
const decryption = new FhevmDecryption({ instance, signer, storage });

// Decrypt multiple handles
const results = await decryption.decrypt([
  { handle: '0x...', contractAddress: '0x...' },
  { handle: '0x...', contractAddress: '0x...' },
]);

// Decrypt single handle
const value = await decryption.decryptSingle(handle, contractAddress);
```

#### `FhevmContract`
Enhanced contract interaction with automatic encryption support.

```typescript
const contract = new FhevmContract(address, abi, signer, encryption);

// Read operations
const result = await contract.read('getValue');

// Write operations with encryption
await contract.write({
  functionName: 'increment',
  abi: contractAbi,
  encryptionResult: encrypted,
});
```

### React Hooks

#### `useFhevmUniversal(config)`
One hook to rule them all - complete FHEVM setup.

```typescript
const {
  instance,        // FHEVM instance
  status,          // 'idle' | 'loading' | 'ready' | 'error'
  error,           // Error object if any
  encryption,      // Encryption utilities
  decryption,      // Decryption utilities
  createContract,  // Contract factory
  connect,         // Connect function
  disconnect,      // Disconnect function
  isReady,         // Boolean convenience flag
  canEncrypt,      // Boolean convenience flag
  canDecrypt,      // Boolean convenience flag
} = useFhevmUniversal(config);
```

#### `useFhevmClient(config)`
Core client hook for custom setups.

#### `useFhevmEncryption(params)`
Encryption-specific hook.

#### `useFhevmDecryption(params)`
Decryption-specific hook.

#### `useFhevmContract(params)`
Contract-specific hook.

### Vue Composables

All React hooks have Vue equivalents with reactive state:

- `useFhevmUniversal()`
- `useFhevmClient()`

## 🏗️ Architecture

```
@fhevm-sdk/
├── universal     # Framework-agnostic core
├── react         # React hooks and adapters
├── vue           # Vue composables
├── core          # Core utilities and classes
├── storage       # Storage abstractions
└── types         # TypeScript definitions
```

### Framework Agnostic Core

The SDK is built with a framework-agnostic core that can be used in any JavaScript environment:

```typescript
// Works in Node.js, browsers, React, Vue, etc.
import { FhevmClient, FhevmEncryption, FhevmDecryption } from '@fhevm-sdk/universal';
```

### Framework Adapters

Framework-specific adapters provide familiar patterns:

```typescript
// React
import { useFhevmUniversal } from '@fhevm-sdk/react';

// Vue
import { useFhevmUniversal } from '@fhevm-sdk/vue';
```

## 🔧 Configuration

### Mock Chains

Configure local development chains:

```typescript
const mockChains = {
  31337: 'http://localhost:8545',    // Hardhat
  1337: 'http://localhost:7545',     // Ganache
};
```

### Status Callbacks

Monitor FHEVM initialization:

```typescript
const onStatusChange = (status: string) => {
  console.log('FHEVM Status:', status);
  // 'sdk-loading' | 'sdk-loaded' | 'sdk-initializing' | 'sdk-initialized' | 'creating'
};
```

## 🎯 Migration from Legacy SDK

### Before (Legacy)
```typescript
// Multiple imports, complex setup
import { useFhevm, useFHEEncryption, useFHEDecrypt, useInMemoryStorage } from '@fhevm-sdk';

const { instance } = useFhevm({ provider, chainId, enabled: true });
const { storage } = useInMemoryStorage();
const { encryptWith } = useFHEEncryption({ instance, ethersSigner, contractAddress });
const { decrypt } = useFHEDecrypt({ instance, ethersSigner, storage, chainId, requests });

// Manual encryption building
const enc = await encryptWith(builder => builder.add32(value));
```

### After (Universal)
```typescript
// Single import, minimal setup
import { useFhevmUniversal } from '@fhevm-sdk/react';

const fhevm = useFhevmUniversal({ provider, signer });

// Direct encryption methods
const enc = await fhevm.encryption.encryptUint32(value);
```

## 🧪 Examples

Check out the `/examples` directory for complete working examples:

- `basic-usage.ts` - Framework-agnostic usage
- React integration examples
- Vue integration examples
- Node.js server examples

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

BSD-3-Clause-Clear License

---

**Built for the Zama Bounty Program - Universal FHEVM SDK Challenge** 🏆