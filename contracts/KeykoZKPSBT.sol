// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "./SBTData.sol";

/// @title ZKP SBT
/// @author Fabriziogianni7 (forked from Masa Finance)
/// @notice Soulbound token implementing ZKP
/// @notice writing here minting to make it easier to test (It would be used only in demo POC)
/// @notice mintable by the deployer if the contract (It should not be this way for the outlines of SBTs)

//TODO make mint function
contract KeykoZKPSBT {
    address protocolOwner;


    // tokenId => SBTData
    mapping(uint256 => SBTData) private idToSBTData;
    mapping(address => uint) public addressToId;
    uint256 private counter;

    constructor() {
        protocolOwner = msg.sender;
    }

    modifier onlyProtocolOwner() {
        require(msg.sender == protocolOwner);
        _;
    }

    function mint(address _to, SBTData memory data) external onlyProtocolOwner() returns (uint256 tokenId){
        // add SBTData to the mapping
        // increment counter and tie tokenId to the owner to owner.
        tokenId = counter +1;
        idToSBTData[tokenId] = data;
        addressToId[_to] = tokenId;
        return tokenId;

    }

    function getHashData(uint256 tokenId) external view returns (bytes memory) {
        return idToSBTData[tokenId].hashData;

    }

    function getEncryptedData(
        uint256 tokenId
    )
        external
        view
        returns (
            EncryptedData memory,
            EncryptedData memory,
            EncryptedData memory,
            EncryptedData memory,
            EncryptedData memory
        )
    {
        return (
            idToSBTData[tokenId].encryptedOwnerName,
            idToSBTData[tokenId].encryptedLicenseNumber,
            idToSBTData[tokenId].encryptedIssuanceDate,
            idToSBTData[tokenId].encryptedExpiryeDate,
            idToSBTData[tokenId].encryptedLicenseType
        );
    }
}
