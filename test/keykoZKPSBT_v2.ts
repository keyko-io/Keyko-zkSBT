import { expect } from "chai";
import { ethers, network } from 'hardhat';
// import { Contract, Signer, Wallet } from 'ethers';
import { createIdentity } from 'eth-crypto';

const buildPoseidon = require("circomlibjs").buildPoseidon;
const {
  encryptWithPublicKey,
  decryptWithPrivateKey
} = require("../src/crypto");




describe("Soulbound Token Test", function () {
  const drivingLicense = {
    // ownerName: "fabrizio",
    // licenseNumber: "123asdq",
    // issuanceDate: "1410511765", // 12/9/2014
    expiryDate: 20, // 12/9/2035 --> not working with timestamps
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




  beforeEach(async function () {
    // Retrieve the default account from ethers
    [owner] = await ethers.getSigners();
    identity = createIdentity()


    // A helper to get the contracts instance and deploy it locally
    const KeykoZKPSBT_v2 = await ethers.getContractFactory("KeykoZKPSBT_v2");
    keykoZKPSBT_v2 = await KeykoZKPSBT_v2.deploy();
  });

  it("should mint a soulbound token", async () => {
    //Mint token ID 0 to owner address

    encryptedExpiryDate = await encryptWithPublicKey(
      identity.publicKey,
      drivingLicense.expiryDate.toString()
    );
    console.log("encryptedExpiryDate", encryptedExpiryDate)

    const poseidon = await buildPoseidon();
    const poseidonHash = poseidon([
      BigInt(identity.address),
      BigInt(drivingLicense.expiryDate),
    ]);
    hashData = "0x" + BigInt(poseidon.F.toString(poseidonHash)).toString(16)

    await keykoZKPSBT_v2.safeMint(
      identity.address,
      hashData,
      encryptedExpiryDate
    );

    // Check that owner address owns the token ID 0
    const value = await keykoZKPSBT_v2.ownerOf(0);
    expect(value).to.equal(identity.address);

  });


  it("should revert when trying to transfer via safeTransferFrom", async () => {

    await keykoZKPSBT_v2.safeMint(
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
  });

  it("should revert when trying to transfer via transferFrom", async () => {
    //Mint token ID 0 to owner address
    await keykoZKPSBT_v2.safeMint(
      identity.address,
      hashData,
      encryptedExpiryDate
    );

    // Check that owner address owns the token ID 0
    const value = await keykoZKPSBT_v2.ownerOf(0);
    expect(value).to.equal(identity.address);

    await expect(keykoZKPSBT_v2['transferFrom(address,address,uint256)'](
      identity.address,
      await owner.getAddress(),
      0 // token id
    )).to.be.reverted;
  });
});