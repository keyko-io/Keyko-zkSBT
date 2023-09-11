// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

struct EncryptedData {
    bytes iv; // IV
    bytes ephemPublicKey; // ephemPublicKey
    bytes cipherText; // ciphertext
    bytes mac; // mac
}

// Struct to store the encrypted data with the public key of the owner of the SBT
// It should be generated for a driving license
struct SBTData {
    bytes hashData; // hash of ownerAddress+creditScore without encryption, used to verify the data
    // encrypted data with the public key of the owner of the SBT
    EncryptedData encryptedIssuanceDate;
    EncryptedData encryptedExpiryeDate;
    EncryptedData encryptedOwnerName;
    EncryptedData encryptedLicenseNumber;
    EncryptedData encryptedLicenseType;
}
