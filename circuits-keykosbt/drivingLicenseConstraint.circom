pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";

// all timestamps are in seconds
template drivingLicenseConstraint() {
    
    // public
    signal input hashData; //input: is the hash we have in the SBT. is the hash of the hash of every data poseidon.hashData
    signal input ownerAddress;
    signal input now; // now: now timestamp, current time. 
    // signal input twentyoneYears; // should be: current timestamp-21 years 

    // private
    signal input name;
    signal input surname;
    signal input birthDate;
    signal input expiryDate;
    signal input licenseNumber;
    signal input licenseType;

    // intermediate signals
    signal expiryOutput;
    signal twentyoneYearsInPast;
    signal birthOutput;

    // true/false (the output)
    signal output out;



    // check hash to be equal to hashData --> all data are verified
    component hash = Poseidon(7);
    hash.inputs[0] <== ownerAddress;
    hash.inputs[1] <== name;
    hash.inputs[2] <== surname;
    hash.inputs[3] <== birthDate;
    hash.inputs[4] <== expiryDate;
    hash.inputs[5] <== licenseNumber;
    hash.inputs[6] <== licenseType;
    hashData === hash.out;

    // check driving license is not expired
    // expiryDate should be bigger than current time in order to return true
    component expiryGreaterEqThan = GreaterEqThan(64); 
    expiryGreaterEqThan.in[0] <== expiryDate;
    expiryGreaterEqThan.in[1] <== now;

    //how to declare new signals?
    expiryOutput <-- expiryGreaterEqThan.out;
    expiryOutput === 1;


    // check owner is more than 21 years old
    // birthDate <= now - 21 years --> CS: birthDate + 21 years <= now, 
    component birthLessEqThan = LessEqThan(64);  //should be less tan now
    twentyoneYearsInPast <-- now - 21 * 365 * 24 * 60 * 60; // calculating 21 years in the past
    birthLessEqThan.in[0] <== birthDate + twentyoneYearsInPast;
    birthLessEqThan.in[1] <== now;


    birthOutput <-- birthLessEqThan.out;
    birthOutput === 1;

    expiryOutput === birthOutput;
}

component main {public [hashData,ownerAddress,now]} = drivingLicenseConstraint();
