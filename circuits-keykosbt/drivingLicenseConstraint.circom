pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";

template drivingLicenseConstraint() {
    // public
    signal input hashData; //input: is the hash we have in the SBT. is the hash of the hash of every data poseidon.hashData
    signal input ownerAddress;
    signal input threshold; // threshold: now timestamp, current time. it should be less than expiry date

    // private
    // idToSBTData[tokenId].encryptedIssuanceDate,
    // idToSBTData[tokenId].encryptedExpiryeDate,
    // idToSBTData[tokenId].encryptedOwnerName,
    // idToSBTData[tokenId].encryptedLicenseNumber,
    // idToSBTData[tokenId].encryptedLicenseType

    signal input expiryDate;

    // true/false
    signal output out;

    // check hash to be equal to hashData
    component hash = Poseidon(2);
    hash.inputs[0] <== ownerAddress;
    hash.inputs[1] <== expiryDate;
    hashData === hash.out;

    // check driving license is not expired
    // expiryDate should be bigger than current time in order to return true
    component greaterEqThan = GreaterEqThan(8); 
    greaterEqThan.in[0] <== expiryDate;
    greaterEqThan.in[1] <== threshold;

    out <-- greaterEqThan.out;
    out === 1;
}

component main {public [hashData,ownerAddress,threshold]} = drivingLicenseConstraint();
