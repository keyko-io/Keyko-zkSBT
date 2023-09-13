import { expect } from "chai";
import { ethers } from 'hardhat';
import { Contract, Signer } from 'ethers';

describe("Soulbound Token Test", function () {
    let owner: Signer
    let keykoZKPSBT_v2: Contract

    beforeEach(async function () {
        // Retrieve the default account from ethers
        [owner] = await ethers.getSigners();

        // A helper to get the contracts instance and deploy it locally
        const KeykoZKPSBT_v2 = await ethers.getContractFactory("KeykoZKPSBT_v2");
         keykoZKPSBT_v2 = await KeykoZKPSBT_v2.deploy();
    });

    it("should mint a soulbound token", async () => {
        //Mint token ID 0 to owner address
        // console.log("keykoZKPSBT_v2",keykoZKPSBT_v2)
        // console.log("owner",owner)
        const ownerAddress = await owner.getAddress()

        //need to pass SBTData here!
        await keykoZKPSBT_v2.safeMint(ownerAddress);

        // //Check that owner address owns the token ID 0
        const value = await keykoZKPSBT_v2.ownerOf(0);
        expect(value).to.equal(ownerAddress);
        
    });


    // it("should revert when trying to transfer via safeTransferFrom", async () => {
    //     //Mint token ID 0 to owner address
    //     await keykoZKPSBT_v2.safeMint(owner.address);
        
    //     await expect(keykoZKPSBT_v2['safeTransferFrom(address,address,uint256)'](
    //         owner.address,
    //         "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
    //         0 // token id
    //     )).to.be.reverted;
    // });

    // it("should revert when trying to transfer via transferFrom", async () => {
    //     //Mint token ID 0 to owner address
    //     await keykoZKPSBT_v2.safeMint(owner.address);

    //     await expect(keykoZKPSBT_v2['transferFrom(address,address,uint256)'](
    //         owner.address,
    //         "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
    //         0 // token id
    //     )).to.be.reverted;
    // });
});