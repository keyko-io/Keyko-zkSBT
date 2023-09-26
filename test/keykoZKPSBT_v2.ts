import { expect } from "chai";
import { ethers, network } from 'hardhat';
// import { Contract, Signer, Wallet } from 'ethers';
import { createIdentity } from 'eth-crypto';
import { generateInput, generateInputFromidentity, mockDrivingLicense } from "../src/generateHash";

const buildPoseidon = require("circomlibjs").buildPoseidon;
const {
  encryptWithPublicKey,
  decryptWithPrivateKey
} = require("../src/crypto");
const { genProof } = require("../src/solidity-proof-builder");




describe("Soulbound Token Test", function () {
  const drivingLicense = mockDrivingLicense
  let owner: any
  let keykoZKPSBT_v2: any
  let SBTGuy: any
  let identity: {
    privateKey: string;
    publicKey: string;
    address: string;
  }
  let generatedHashData
  let encryptedExpiryDate
  let groth16Verifier
  let generatedInput
  let allEncrypted


  const encryptAllData = async (data: any) => {
    const encryptionPromises = Object.keys(data).map(async (elem) => {
      const encrpt = {
        label: `encrypted${elem.charAt(0).toUpperCase() + elem.slice(1)}`,
        encr: await encryptWithPublicKey(
          identity.publicKey,
          data[elem].toString()
        )
      }
      return encrpt
    })


    return await Promise.all(encryptionPromises);
  }

  const decryptAllData = async (data: any) : Promise<{label:string, decr:string}[]>=> {
    const decryptionPromises = data.map(async (elem) => {
      const decrpt = {
        label: elem.label,
        decr: await decryptWithPrivateKey(
          identity.privateKey,
          elem.encr
        )
      }
      return decrpt
    })


    return await Promise.all(decryptionPromises);
  }


  beforeEach(async function () {
    // Retrieve the default account from ethers
    [owner] = await ethers.getSigners();
    identity = createIdentity()


    // A helper to get the contracts instance and deploy it locally
    const KeykoZKPSBT_v2 = await ethers.getContractFactory("KeykoZKPSBT_v2");
    keykoZKPSBT_v2 = await KeykoZKPSBT_v2.deploy();


    // generate hash
    const { hashData, ownerAddress, now,
      name, surname, birthDate, expiryDate, licenseNumber, licenseType
    } = JSON.parse(await generateInputFromidentity(identity))
    generatedHashData = hashData
    generatedInput = { name, surname, birthDate, expiryDate, licenseNumber, licenseType }
    allEncrypted = await encryptAllData({ name, surname, birthDate, expiryDate, licenseNumber, licenseType })
  });



  it("should mint a soulbound token and test the non-transferrability", async () => {
    //Mint token ID 0 to owner address
    await keykoZKPSBT_v2.mint(
      identity.address,
      generatedHashData,
      allEncrypted[0].encr,
      allEncrypted[1].encr,
      allEncrypted[2].encr,
      allEncrypted[3].encr,
      allEncrypted[4].encr,
      allEncrypted[5].encr,
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
    const allDecrypted : {label:string, decr:string}[]= await decryptAllData(allEncrypted)
    // we check that the data is the same
    allDecrypted.every((elem: { label, decr }) => elem.decr === generatedInput[elem.label])

    // input of ZKP
    console.log("21 yrs ago...",1695721745 - 21 * 365 * 24 * 60 * 60)
    const input = {
      hashData: generatedHashData,
      ownerAddress: identity.address,
      now: 1695721745,
      name: allDecrypted[0].decr,
      surname: allDecrypted[1].decr,
      birthDate: allDecrypted[2].decr,
      expiryDate: allDecrypted[3].decr,
      licenseNumber: allDecrypted[4].decr,
      licenseType: allDecrypted[5].decr,
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