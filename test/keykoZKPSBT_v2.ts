import { expect } from "chai";
import { ethers, network } from 'hardhat';
// import { Contract, Signer, Wallet } from 'ethers';
import { createIdentity } from 'eth-crypto';

const buildPoseidon = require("circomlibjs").buildPoseidon;
const {
  encryptWithPublicKey,
  decryptWithPrivateKey
} = require("../src/crypto");
const { genProof } = require("../src/solidity-proof-builder");




describe("Soulbound Token Test", function () {
  const drivingLicense = {
    // ownerName: "fabrizio",
    // licenseNumber: "123asdq",
    // issuanceDate: "1410511765", // 12/9/2014
    expiryDate: 2388999052, // 12/9/2035 --> not working with timestamps
    // licenseType: "A2"
  }
  let owner: any
  let keykoZKPSBT_v2: any
  let SBTGuy: any
  let identity: {
    privateKey: string;
    publicKey: string;
    address: string;
  }
  let hashData
  let encryptedExpiryDate
  let groth16Verifier




  beforeEach(async function () {
    // Retrieve the default account from ethers
    [owner] = await ethers.getSigners();
    identity = createIdentity()


    // A helper to get the contracts instance and deploy it locally
    const KeykoZKPSBT_v2 = await ethers.getContractFactory("KeykoZKPSBT_v2");
    keykoZKPSBT_v2 = await KeykoZKPSBT_v2.deploy();

    encryptedExpiryDate = await encryptWithPublicKey(
      identity.publicKey,
      drivingLicense.expiryDate.toString()
    );

    const poseidon = await buildPoseidon();
    const poseidonHash = poseidon([
      BigInt(identity.address),
      BigInt(drivingLicense.expiryDate),
    ]);
    const suffix = BigInt(poseidon.F.toString(poseidonHash)).toString(16)
    const prefix = suffix.length %2 ==0 ? "0x" : "0x0"
    hashData = prefix + suffix
  });

  it("should mint a soulbound token and test the non-transferrability", async () => {
    //Mint token ID 0 to owner address
    await keykoZKPSBT_v2.mint(
      identity.address,
      hashData,
      encryptedExpiryDate
    );

    // Check that owner address owns the token ID 0
    const value = await keykoZKPSBT_v2.ownerOf(0);
    expect(value).to.equal(identity.address);
    await expect(keykoZKPSBT_v2['safeTransferFrom(address,address,uint256)'](
      identity.address,
      await owner.getAddress(),
      0 // token id
    )).to.be.reverted;

     await expect(keykoZKPSBT_v2['transferFrom(address,address,uint256)'](
      identity.address,
      await owner.getAddress(),
      0 // token id
    )).to.be.reverted;
  });



  it("decrypt data, generate/validate proof", async () => {


    // we decrypt the data with the private key of address1
    const decryptedExipryDate = await decryptWithPrivateKey(
      identity.privateKey,
      encryptedExpiryDate
    );

    // we check that the data is the same
    expect(decryptedExipryDate).to.equal(drivingLicense.expiryDate.toString());

    // input of ZKP
    const input = {
      hashData: hashData,
      ownerAddress: identity.address,
      threshold: 1694688653,
      expiryDate: decryptedExipryDate
    };

    // generate ZKP proof
    const proof = await genProof(input);
    // console.log("proof", proof)

    //deploy verifier
    const Groth16Verifier = await ethers.getContractFactory("Groth16Verifier");
    groth16Verifier = await Groth16Verifier.deploy();

    // function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[4] calldata _pubSignals)
    const verification = await groth16Verifier.verifyProof(
      proof.a,
      proof.b,
      proof.c,
      proof.PubSignals
    )
    expect(verification).to.be.true;
  });
});