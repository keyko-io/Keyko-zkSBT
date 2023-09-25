import { hash } from "argon2";
import { createIdentity } from "eth-crypto";

const drivingLicense = {
  name: "Maistrinu",
  surname: "Gianniscorfani",
  birthDate: 631194610,  //1st jan 1990
  licenseNumber: "Pa8762wer34",
  licenseType: "A2B",
  expiryDate: 2051265010, // 1st Jan 2035
}

const buildPoseidon = require("circomlibjs").buildPoseidon;
const generateHash = async () => {
  const identity = createIdentity()
  const poseidon = await buildPoseidon()

  const nameNum = stringToNumericRepresentation(drivingLicense.name)
  const surnameNum = stringToNumericRepresentation(drivingLicense.surname)
  const licenseNumberNum = stringToNumericRepresentation(drivingLicense.licenseNumber)
  const licenseTypeNum = stringToNumericRepresentation(drivingLicense.licenseType)


  const poseidonHash = poseidon([
    BigInt(identity.address),
    nameNum,
    surnameNum,
    BigInt(drivingLicense.birthDate),
    BigInt(drivingLicense.expiryDate),
    licenseNumberNum,
    licenseTypeNum
  ]);

  const suffix = BigInt(poseidon.F.toString(poseidonHash)).toString(16)
  const prefix = suffix.length % 2 == 0 ? "0x" : "0x0"
  const hashData = prefix + suffix

  const input = {
    "hashData": hashData,
    "ownerAddress": identity.address,
    "now": (Date.now()/1000).toFixed(),
    "name": nameNum,
    "surname": surnameNum,
    "birthDate": 631194610,
    "expiryDate": 2051265010,
    "licenseNumber":licenseNumberNum,
    "licenseType": licenseTypeNum,
  }


  return JSON.stringify(input)
}


function stringToNumericRepresentation(inputString) {
  return [...inputString].map(char => char.charCodeAt(0)).toString().replace(/,/g, "",)
}

// const inputString = "Hello, Poseidon!";
// const numericRepresentation = stringToNumericRepresentation(inputString);

// console.log(numericRepresentation);

generateHash().then(h => console.log("hash", h)).catch(console.error)