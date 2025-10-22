<template>
  <div class="fhevm-demo">
    <h2>Universal FHEVM SDK - Vue Example</h2>
    
    <div v-if="fhevm.isLoading.value" class="loading">
      Loading FHEVM... {{ fhevm.status.value }}
    </div>
    
    <div v-else-if="fhevm.hasError.value" class="error">
      Error: {{ fhevm.error.value?.message }}
      <button @click="fhevm.connect">Retry</button>
    </div>
    
    <div v-else-if="fhevm.isReady.value" class="ready">
      <p>✅ FHEVM Ready!</p>
      
      <div class="actions">
        <button @click="encryptValue" :disabled="!fhevm.canEncrypt.value">
          🔐 Encrypt Value
        </button>
        
        <button @click="decryptValue" :disabled="!fhevm.canDecrypt.value">
          🔓 Decrypt Value
        </button>
      </div>
      
      <div v-if="encryptedResult" class="result">
        <h3>Encrypted Result:</h3>
        <p>Handles: {{ encryptedResult.handles.length }}</p>
      </div>
    </div>
    
    <div class="info">
      <h3>🎯 Universal SDK Features:</h3>
      <ul>
        <li>✅ Framework-agnostic core</li>
        <li>✅ Vue 3 Composition API</li>
        <li>✅ Reactive state management</li>
        <li>✅ Minimal boilerplate</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useFhevmUniversal } from '@fhevm-sdk/vue';

// Universal FHEVM setup - works the same as React!
const fhevm = useFhevmUniversal({
  provider: 'http://localhost:8545',
  signer: null, // Would be set when wallet connects
  mockChains: { 31337: 'http://localhost:8545' },
  onStatusChange: (status) => console.log('FHEVM Status:', status)
});

const encryptedResult = ref(null);

const encryptValue = async () => {
  if (!fhevm.canEncrypt.value) return;
  
  try {
    // This would work if signer was available
    console.log('Would encrypt value 42');
    // const result = await fhevm.encryption.encryptUint32(42);
    // encryptedResult.value = result;
  } catch (error) {
    console.error('Encryption failed:', error);
  }
};

const decryptValue = async () => {
  if (!fhevm.canDecrypt.value) return;
  
  try {
    console.log('Would decrypt handle from contract');
    // const result = await fhevm.decryption.decryptSingle(handle, contractAddress);
  } catch (error) {
    console.error('Decryption failed:', error);
  }
};
</script>

<style scoped>
.fhevm-demo {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.loading, .error, .ready {
  padding: 20px;
  margin: 20px 0;
  border-radius: 8px;
}

.loading {
  background: #e3f2fd;
  border: 1px solid #2196f3;
}

.error {
  background: #ffebee;
  border: 1px solid #f44336;
}

.ready {
  background: #e8f5e8;
  border: 1px solid #4caf50;
}

.actions {
  margin: 20px 0;
}

.actions button {
  margin: 0 10px 10px 0;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background: #2196f3;
  color: white;
  cursor: pointer;
}

.actions button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.result {
  margin: 20px 0;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 4px;
}

.info {
  margin-top: 30px;
  padding: 20px;
  background: #fff3e0;
  border-radius: 8px;
}

.info ul {
  list-style: none;
  padding: 0;
}

.info li {
  margin: 8px 0;
}
</style>