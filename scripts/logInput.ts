import { ethers } from "ethers"; 

const {
    encryptWithPublicKey,
    decryptWithPrivateKey
} = require("../src/crypto");


const buildPoseidon = require("circomlibjs").buildPoseidon;

// signal input ownerName;
//     signal input licenseNumber;
//     signal input issuanceDate;
//     signal input expiryDate;
//     signal input licenseType;
const drivingLicense = {
    // ownerName: "fabrizio",
    // licenseNumber: "123asdq",
    // issuanceDate: "1410511765", // 12/9/2014
    expiryDate: 2388999052, // 12/9/2035 --> not working with timestamps
    // licenseType: "A2"
}

// const address1 = new ethers.Wallet(
//       "0x41c5ab8f659237772a24848aefb3700202ec730c091b3c53affe3f9ebedbc3c9",
//       // ethers.Wallet.createRandom().privateKey,
//       ethers.provider
//     );
const address1 = ethers.Wallet.createRandom();


const createHashAndEncrypt = async () => {
    try {
        // middleware calculates hash of data
        const poseidon = await buildPoseidon();
        const hashData = poseidon([
            // drivingLicense.ownerName,
            // drivingLicense.licenseNumber,
            // BigInt(drivingLicense.issuanceDate),
            BigInt(drivingLicense.expiryDate),
            // drivingLicense.licenseType,
        ]);
        const hashDataHex = "0x" + BigInt(poseidon.F.toString(hashData)).toString(16);

        // encrypts data with public key of address1
        // const encryptedOwnerName = await encryptWithPublicKey(
        //     "0x14B2Bab4d1068e742BAf05F908D7b5A00773B0dd",
        //     drivingLicense.ownerName.toString()
        // );

        // const encryptedLicenseNumber = await encryptWithPublicKey(
        //     "0x14B2Bab4d1068e742BAf05F908D7b5A00773B0dd",
        //     drivingLicense.licenseNumber.toString()
        // );

        // const encryptedIssuanceDate = await encryptWithPublicKey(
        //     address1.publicKey,
        //     drivingLicense.issuanceDate.toString()
        // );

        const encryptedExpiryDate = await encryptWithPublicKey(
            address1.publicKey,
            drivingLicense.expiryDate.toString()
        );
        // const encryptedLicenseType = await encryptWithPublicKey(
        //     "0x14B2Bab4d1068e742BAf05F908D7b5A00773B0dd",
        //     drivingLicense.licenseType.toString()
        // );

        // console.log("result:", JSON.stringify({
        //     hashDataHex,
        //     // encryptedOwnerName,
        //     // encryptedLicenseNumber,
        //     encryptedIssuanceDate,
        //     encryptedExpiryDate,
        //     // encryptedLicenseType
        // }
        // ))

    } catch (error) {
        console.log(error)
    }
}

const generateHashData =  async() => {
    const poseidon = await buildPoseidon();
    const hashData = poseidon([
         BigInt(address1.address),
        // drivingLicense.ownerName,
        // drivingLicense.licenseNumber,
        // BigInt(drivingLicense.issuanceDate),
        BigInt(drivingLicense.expiryDate),
        // drivingLicense.licenseType,
    ]);
console.log("hash:", "0x" + BigInt(poseidon.F.toString(hashData)).toString(16))
console.log("pubkey:", address1.address)
}

generateHashData()
// createHashAndEncrypt()