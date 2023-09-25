# Generating and verifying zkProof
### compile circuit:
`cd circuits-keykosbt && circom drivingLicenseConstraint.circom --r1cs --wasm --sym --c`

### get hash for input.json:
`cd .. && cd dist/src && node generateHash.js`

paste data in input.json

### generate witness:
`cd ../../circuits-keykosbt && cp input.json drivingLicenseConstraint_js`
`cd drivingLicenseConstraint_js`
`node generate_witness.js drivingLicenseConstraint.wasm input.json witness.wtns`

### 1st power of tau cerimony:
`cd ..`
`snarkjs powersoftau new bn128 12 pot12_0000.ptau -v`
`snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v`

### phase2 of cerimony:
`snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v`
`snarkjs groth16 setup drivingLicenseConstraint.r1cs pot12_final.ptau drivingLicenseConstraint_0000.zkey`
`snarkjs zkey contribute drivingLicenseConstraint_0000.zkey drivingLicenseConstraint_0001.zkey --name="1st Contributor Name" -v`

### export verification Key
`snarkjs zkey export verificationkey drivingLicenseConstraint_0001.zkey verification_key.json`

### generating a zk proof
copy paste witness.wtns to the general circuit folder (circuits-keykosbt)

`snarkjs groth16 prove drivingLicenseConstraint_0001.zkey witness.wtns proof.json public.json`


### verifying proof --> output "OK"
`snarkjs groth16 verify verification_key.json public.json proof.json`

### Verifying from smart contract
`snarkjs zkey export solidityverifier drivingLicenseConstraint_0001.zkey verifier.sol`

deploy contract

### generating call
`snarkjs generatecall`

source:

https://docs.circom.io/getting-started/proving-circuits/#verifying-from-a-smart-contract



