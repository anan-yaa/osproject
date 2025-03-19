import React, { useState } from 'react';
import { Shield, Lock, Key, Cpu, RefreshCcw, CodepenIcon } from 'lucide-react';

const EncryptionAlgorithmSelector = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');

  const algorithms = {
    rsa: {
      name: 'RSA',
      color: 'bg-gradient-to-r from-purple-600 to-indigo-500',
      icon: <Lock className="h-10 w-10 text-white" />,
      difficulty: 'Beginner',
      description: `RSA (Rivest–Shamir–Adleman) is an asymmetric encryption algorithm that uses a pair of keys: a public key for encryption and a private key for decryption. 

Key features:
• Security is based on the mathematical difficulty of factoring the product of two large prime numbers
• Widely used for secure data transmission, digital signatures, and key exchange
• Standard key sizes range from 2048 to 4096 bits for adequate security
• Slower than symmetric algorithms, so often used to encrypt symmetric keys rather than bulk data
• Provides both confidentiality (via encryption) and authentication (via digital signatures)`,
      implementation: `from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes

# Generate RSA key pair
private_key = rsa.generate_private_key(
    public_exponent=65537,  # Standard public exponent
    key_size=2048,          # Key size (2048 or 4096 bits)
)
public_key = private_key.public_key()

# Encrypt with public key
plaintext = b"Sensitive data"
ciphertext = public_key.encrypt(
    plaintext,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)`
    },
    ecc: {
      name: 'ECC',
      color: 'bg-gradient-to-r from-pink-500 to-rose-500',
      icon: <Shield className="h-10 w-10 text-white" />,
      difficulty: 'Intermediate',
      description: `Elliptic Curve Cryptography (ECC) is an advanced asymmetric encryption approach based on the algebraic structure of elliptic curves over finite fields.

Key features:
• Provides the same security level as RSA but with significantly smaller key sizes (256-bit ECC ≈ 3072-bit RSA)
• More efficient in terms of computational overhead and bandwidth requirements
• Ideal for resource-constrained environments like IoT devices, smart cards, and mobile applications
• Used for key agreement (ECDH - Elliptic Curve Diffie-Hellman) and digital signatures (ECDSA)`,
      implementation: `from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import serialization

# Generate ECC key pair
private_key = ec.generate_private_key(ec.SECP256R1())  # NIST P-256 curve
public_key = private_key.public_key()

# Serialize public key
public_pem = public_key.public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)`
    },
    aes: {
      name: 'AES',
      color: 'bg-gradient-to-r from-amber-500 to-yellow-400',
      icon: <Key className="h-10 w-10 text-white" />,
      difficulty: 'Intermediate',
      description: `Advanced Encryption Standard (AES) is a symmetric block cipher adopted as an encryption standard by the U.S. government and widely used worldwide.

Key features:
• Symmetric algorithm that uses the same key for both encryption and decryption
• Operates on fixed block sizes of 128 bits with key lengths of 128, 192, or 256 bits
• Offers excellent performance in both software and hardware implementations
• Resistant to all known practical cryptanalytic attacks when properly implemented
• Used in various modes of operation: CBC, GCM, CTR, etc.`,
      implementation: `import os
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

def generate_key():
    """Generate a random 256-bit (32-byte) AES key"""
    return os.urandom(32)  # 256 bits = 32 bytes

def generate_iv():
    """Generate a random 96-bit (12-byte) IV for GCM mode"""
    return os.urandom(12)  # 96 bits = 12 bytes

def encrypt_aes_gcm(plaintext, key):
    """
    Encrypt data using AES in GCM mode
    Returns (iv, ciphertext, tag) tuple
    """
    if isinstance(plaintext, str):
        plaintext = plaintext.encode('utf-8')
    
    # Generate a random IV (nonce)
    iv = generate_iv()
    
    # Create an encryptor object
    encryptor = Cipher(
        algorithms.AES(key),
        modes.GCM(iv)
    ).encryptor()
    
    # Encrypt the plaintext
    ciphertext = encryptor.update(plaintext) + encryptor.finalize()
    
    # Return the IV, ciphertext, and authentication tag
    return (iv, ciphertext, encryptor.tag)`
    },
    chacha20: {
      name: 'ChaCha20',
      color: 'bg-gradient-to-r from-emerald-500 to-teal-400',
      icon: <RefreshCcw className="h-10 w-10 text-white" />,
      difficulty: 'Advanced',
      description: `ChaCha20 is a modern symmetric stream cipher designed by Daniel J. Bernstein as an alternative to AES. It's often paired with the Poly1305 authenticator to provide authenticated encryption.

Key features:
• High-speed software implementation on modern processors
• Designed to be resistant to timing attacks
• Uses a 256-bit key and a 96-bit nonce (number used once)
• Particularly efficient on platforms without AES hardware acceleration
• Adopted in TLS 1.3, SSH, and widely used in mobile and IoT applications
• Offers excellent performance on devices with limited processing power`,
      implementation: `import os
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

def generate_key():
    """Generate a random 256-bit (32-byte) ChaCha20 key"""
    return os.urandom(32)

def generate_nonce():
    """Generate a random 96-bit (12-byte) nonce for ChaCha20"""
    return os.urandom(12)

def encrypt_chacha20(plaintext, key, nonce=None):
    """
    Encrypt data using ChaCha20
    Returns (nonce, ciphertext) tuple
    """
    if isinstance(plaintext, str):
        plaintext = plaintext.encode('utf-8')
    
    # Generate a random nonce if not provided
    if nonce is None:
        nonce = generate_nonce()
    
    # Create ChaCha20 cipher object
    cipher = Cipher(
        algorithms.ChaCha20(key, nonce),
        mode=None
    )
    
    # Encrypt the plaintext
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(plaintext) + encryptor.finalize()
    
    return (nonce, ciphertext)

def decrypt_chacha20(ciphertext, key, nonce):
    """Decrypt ChaCha20 encrypted data"""
    # Create ChaCha20 cipher object
    cipher = Cipher(
        algorithms.ChaCha20(key, nonce),
        mode=None
    )
    
    # Decrypt the ciphertext
    decryptor = cipher.decryptor()
    return decryptor.update(ciphertext) + decryptor.finalize()`
    }
  };

  // Binary code background effect
  const BinaryBackground = () => {
    return (
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="h-full w-full flex flex-wrap content-start">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="text-xs font-mono text-emerald-500">
              {Math.random() > 0.5 ? '1' : '0'}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-indigo-800 via-violet-600 to-fuchsia-500 p-0 m-0 overflow-x-hidden">
      <BinaryBackground />
      
      <div className="w-full h-full">
        <div className="w-full bg-white/90 backdrop-blur-md shadow-2xl overflow-hidden">
          <div className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6 text-white text-center">
            <div>
              <CodepenIcon className="inline-block mr-2 text-emerald-300" />
              <h1 className="text-3xl font-extrabold text-white inline-block">CryptoVault</h1>
              <CodepenIcon className="inline-block ml-2 text-emerald-300" />
              <p className="text-white/80 mt-2">Master the art of modern encryption</p>
            </div>
          </div>
          
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4 text-center text-indigo-800">Choose Your Encryption Algorithm</h2>
            <p className="text-center mb-6 text-fuchsia-700">Select from industry-standard algorithms to secure your data</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Object.keys(algorithms).map((key) => (
                <div key={key} className="relative">
                  <button
                    onClick={() => setSelectedAlgorithm(key)}
                    className={`w-full h-36 rounded-xl shadow-lg transition-all duration-300 ${
                      selectedAlgorithm === key 
                        ? 'transform scale-105 ring-4 ring-fuchsia-300' 
                        : 'hover:shadow-xl hover:transform hover:scale-105'
                    } ${algorithms[key].color}`}
                  >
                    <div className="flex flex-col items-center justify-center text-white p-4 h-full">
                      <div className="mb-2">
                        {algorithms[key].icon}
                      </div>
                      <h3 className="text-xl font-bold">{algorithms[key].name}</h3>
                      <div className="text-xs mt-1 px-2 py-1 bg-white/30 rounded-full">
                        {algorithms[key].difficulty}
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>

            {selectedAlgorithm ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border-2 border-indigo-400">
                <div className={`rounded-lg p-4 text-white mb-6 ${algorithms[selectedAlgorithm].color}`}>
                  <div className="flex items-center">
                    <div className="mr-4">
                      {algorithms[selectedAlgorithm].icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{algorithms[selectedAlgorithm].name}</h2>
                      <div className="flex items-center">
                        <span className="mr-2">Difficulty: {algorithms[selectedAlgorithm].difficulty}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center text-indigo-800">
                    <span className="mr-2">🔍</span>
                    <span>Algorithm Details</span>
                  </h3>
                  <div className="bg-gradient-to-r from-indigo-100 to-fuchsia-100 p-4 rounded-lg border border-indigo-300">
                    <div className="text-indigo-800 whitespace-pre-line text-sm">
                      {algorithms[selectedAlgorithm].description}
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center text-indigo-800">
                    <span className="mr-2">💻</span>
                    <span>Implementation Code</span>
                  </h3>
                  <div className="bg-gray-900 text-emerald-400 p-4 rounded-lg shadow-inner overflow-auto max-h-96">
                    <pre className="text-sm font-mono whitespace-pre-wrap">
                      {algorithms[selectedAlgorithm].implementation}
                    </pre>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-100 to-fuchsia-100 p-4 rounded-lg border border-indigo-300">
                  <h3 className="text-lg font-semibold mb-2 flex items-center text-indigo-800">
                    <span className="mr-2">💡</span>
                    <span>Pro Tips</span>
                  </h3>
                  <ul className="list-disc pl-5 text-sm text-indigo-800">
                    <li className="mb-1">Requires the <code className="bg-white/70 px-1 rounded">cryptography</code> Python package</li>
                    <li className="mb-1">Compatible with Python 3.6+</li>
                    <li className="mb-1">For production use, ensure proper key management</li>
                    {selectedAlgorithm === 'rsa' && (
                      <li className="mb-1">Use strong key sizes (2048 bits minimum) for adequate security</li>
                    )}
                    {selectedAlgorithm === 'ecc' && (
                      <li className="mb-1">SECP256R1 (NIST P-256) provides approximately 128 bits of security</li>
                    )}
                    {selectedAlgorithm === 'aes' && (
                      <li className="mb-1">Uses GCM (Galois/Counter Mode) which provides authenticated encryption</li>
                    )}
                    {selectedAlgorithm === 'chacha20' && (
                      <li className="mb-1">Consider using ChaCha20-Poly1305 for authenticated encryption</li>
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center p-10 bg-white/60 backdrop-blur-md rounded-lg border-2 border-dashed border-indigo-500">
                <div className="text-4xl mb-3">🔐</div>
                <p className="text-indigo-800">Select an encryption algorithm to explore its details</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 m-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-fuchsia-400 hover:scale-105 transition-transform">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center mr-2">1</div>
              <h3 className="font-bold text-indigo-800">Select Algorithm</h3>
            </div>
            <p className="text-sm text-fuchsia-700">Choose an encryption method based on your security needs</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-fuchsia-400 hover:scale-105 transition-transform">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-fuchsia-600 text-white flex items-center justify-center mr-2">2</div>
              <h3 className="font-bold text-indigo-800">Learn Details</h3>
            </div>
            <p className="text-sm text-fuchsia-700">Understand how the algorithm works and its key features</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-fuchsia-400 hover:scale-105 transition-transform">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mr-2">3</div>
              <h3 className="font-bold text-indigo-800">Implement</h3>
            </div>
            <p className="text-sm text-fuchsia-700">Copy the code to implement the encryption in your project</p>
          </div>
        </div>
        
        <div className="text-center text-white/90 text-sm backdrop-blur-sm bg-violet-800/50 p-3 rounded-lg border border-fuchsia-400/50 mx-4 mb-4">
          Explore all encryption algorithms to find the best solution for your security requirements
        </div>
      </div>
    </div>
  );
};

export default EncryptionAlgorithmSelector;