// Node.js Universal FHEVM SDK Example
// This demonstrates the framework-agnostic core in a Node.js environment

const { createFhevm } = require('@fhevm-sdk/universal');
const { ethers } = require('ethers');

async function nodeExample() {
  console.log('🚀 Universal FHEVM SDK - Node.js Example');
  
  try {
    // 1. Setup provider and signer
    const provider = new ethers.JsonRpcProvider('http://localhost:8545');
    const wallet = new ethers.Wallet('0x' + '1'.repeat(64), provider); // Demo private key
    
    console.log('📡 Connecting to FHEVM...');
    
    // 2. Create FHEVM instance with minimal setup
    const fhevm = await createFhevm({
      provider: 'http://localhost:8545',
      signer: wallet,
      mockChains: { 31337: 'http://localhost:8545' },
      onStatusChange: (status) => console.log(`   Status: ${status}`)
    });
    
    console.log('✅ FHEVM Connected!');
    
    // 3. Example contract ABI (FHECounter)
    const contractAbi = [
      {
        "type": "function",
        "name": "increment",
        "inputs": [
          {"type": "bytes32", "internalType": "externalEuint32"},
          {"type": "bytes", "internalType": "bytes"}
        ]
      },
      {
        "type": "function", 
        "name": "getCount",
        "outputs": [{"type": "bytes32"}]
      }
    ];
    
    const contractAddress = '0x1234567890123456789012345678901234567890'; // Replace with actual
    
    // 4. Create contract instance
    console.log('📄 Creating contract instance...');
    const contract = fhevm.createContract(contractAddress, contractAbi);
    
    if (contract && fhevm.encryption) {
      // 5. Encrypt a value
      console.log('🔐 Encrypting value 42...');
      const encrypted = await fhevm.encryption.encryptUint32(42);
      console.log('   Encrypted handles:', encrypted.handles.length);
      
      // 6. Simulate contract call (would need deployed contract)
      console.log('📝 Contract call would be:');
      console.log('   Function: increment');
      console.log('   Encrypted value: 42');
      
      // 7. Simulate decryption (would need actual handle from contract)
      if (fhevm.decryption) {
        console.log('🔓 Decryption ready for handles from contract');
      }
    }
    
    console.log('🎉 Universal SDK working in Node.js!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  nodeExample().catch(console.error);
}

module.exports = { nodeExample };