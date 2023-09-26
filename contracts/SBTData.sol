// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

struct EncryptedData {
    bytes iv; // IV
    bytes ephemPublicKey; // ephemPublicKey
    bytes cipherText; // ciphertext
    bytes mac; // mac
}

// Struct to store the encrypted data with the public key of the owner of the SBT
struct SBTData {
    bytes hashData; // hash of ownerAddress+creditScore without encryption, used to verify the data
    EncryptedData encryptedName;
    EncryptedData encryptedSurname;
    EncryptedData encryptedExpiryDate;
    EncryptedData encryptedBirthDate;
    EncryptedData encryptedLicenseNumber;
    EncryptedData encryptedLicenseType;
}
