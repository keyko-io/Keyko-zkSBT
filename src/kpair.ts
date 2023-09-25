import { secp256k1 } from '@noble/curves/secp256k1';
// import { encryptWithPublicKey } from './crypto'
// Convert a byte array to a hex string

function bytesToHex(bytes: Uint8Array) {
  const hex :any[]= [];
  for (const byte of bytes) {
    const current = byte < 0 ? byte + 256 : byte;
    hex.push((current >>> 4).toString(16));
    hex.push((current & 0xF).toString(16));
  }
  return hex.join("");
}

// const test = async () => {
//   const priv = secp256k1.utils.randomPrivateKey();
//   const pub = secp256k1.getPublicKey(priv);
//   const pub2 = secp256k1.getPublicKey(bytesToHex(priv));
//   console.log("priv", '0x' + bytesToHex(priv))
//   console.log("pub", '0x' + bytesToHex(pub))
//   console.log("pub2", bytesToHex(pub2))


//   const msg = new Uint8Array(32).fill(1); // message hash (not message) in ecdsa
//   const sig = secp256k1.sign(msg, priv); // `{prehash: true}` option is available
//   const isValid = secp256k1.verify(sig, msg, pub) === true;
//   console.log("isValid", isValid)


//   const encrypted = await encryptWithPublicKey('0x' + bytesToHex(pub), "sucare forte")
//   console.log("encrypted", encrypted)
// }
// test()


export const createKeyPair = () => {
  const priv = secp256k1.utils.randomPrivateKey()
  const pub = secp256k1.getPublicKey(priv);
  return {
    priv: '0x' + bytesToHex(priv),
    pub: '0x' + bytesToHex(pub),
  }
}


console.log(createKeyPair())
