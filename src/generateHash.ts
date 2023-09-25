import { hash } from "argon2";
import { createIdentity } from "eth-crypto";

export const mockDrivingLicense = {
  name: "Maistrinu",
  surname: "Gianniscorfani",
  birthDate: 631194610,  //1st jan 1990
  licenseNumber: "Pa8762wer34",
  licenseType: "A2B",
  expiryDate: 2051265010, // 1st Jan 2035
}

const buildPoseidon = require("circomlibjs").buildPoseidon;
export const generateInput = async () => {
  const identity = createIdentity()
  const poseidon = await buildPoseidon()

  const nameNum = stringToNumericRepresentation(mockDrivingLicense.name)
  const surnameNum = stringToNumericRepresentation(mockDrivingLicense.surname)
  const licenseNumberNum = stringToNumericRepresentation(mockDrivingLicense.licenseNumber)
  const licenseTypeNum = stringToNumericRepresentation(mockDrivingLicense.licenseType)


  const poseidonHash = poseidon([
    BigInt(identity.address),
    nameNum,
    surnameNum,
    BigInt(mockDrivingLicense.birthDate),
    BigInt(mockDrivingLicense.expiryDate),
    licenseNumberNum,
    licenseTypeNum
  ]);

  const suffix = BigInt(poseidon.F.toString(poseidonHash)).toString(16)
  const prefix = suffix.length % 2 == 0 ? "0x" : "0x0"
  const hashData = prefix + suffix

  const input = {
    "hashData": hashData,
    "ownerAddress": identity.address,
    "now": (Date.now() / 1000).toFixed(),
    "name": nameNum,
    "surname": surnameNum,
    "birthDate": 631194610,
    "expiryDate": 2051265010,
    "licenseNumber": licenseNumberNum,
    "licenseType": licenseTypeNum,
  }


  return JSON.stringify(input)
}

export const generateInputFromidentity = async (identity:{
    privateKey: string;
    publicKey: string;
    address: string;
}) => {
  const poseidon = await buildPoseidon()

  const nameNum = stringToNumericRepresentation(mockDrivingLicense.name)
  const surnameNum = stringToNumericRepresentation(mockDrivingLicense.surname)
  const licenseNumberNum = stringToNumericRepresentation(mockDrivingLicense.licenseNumber)
  const licenseTypeNum = stringToNumericRepresentation(mockDrivingLicense.licenseType)


  const poseidonHash = poseidon([
    BigInt(identity.address),
    nameNum,
    surnameNum,
    BigInt(mockDrivingLicense.birthDate),
    BigInt(mockDrivingLicense.expiryDate),
    licenseNumberNum,
    licenseTypeNum
  ]);

  const suffix = BigInt(poseidon.F.toString(poseidonHash)).toString(16)
  const prefix = suffix.length % 2 == 0 ? "0x" : "0x0"
  const hashData = prefix + suffix

  const input = {
    "hashData": hashData,
    "ownerAddress": identity.address,
    "now": (Date.now() / 1000).toFixed(),
    "name": nameNum,
    "surname": surnameNum,
    "birthDate": 631194610,
    "expiryDate": 2051265010,
    "licenseNumber": licenseNumberNum,
    "licenseType": licenseTypeNum,
  }


  return JSON.stringify(input)
}


export const stringToNumericRepresentation = (inputString)=> {
  return [...inputString].map(char => char.charCodeAt(0)).toString().replace(/,/g, "",)
}

// const inputString = "Hello, Poseidon!";
// const numericRepresentation = stringToNumericRepresentation(inputString);

// console.log(numericRepresentation);

// generateInput().then(h => console.log("hash", h)).catch(console.error)