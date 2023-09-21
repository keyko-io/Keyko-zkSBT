// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./SBTData.sol";

contract KeykoZKPSBT_v2 is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => SBTData) public idToSBTData;
    mapping(address => uint256) public userToTokenId;
    mapping(address => bool) private addressHasSbt;

    constructor() ERC721("KeykoZKPSBT_v2", "KSBT_v2") {}

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721) {
        require(from == address(0), "Token not transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

     //_safemint changed to _mint, so anyone can get the SBT.
     //it's just for testing and demoing!!!
    function mint(
        address to,
        bytes calldata hashData,
        EncryptedData calldata encryptedExpiryDate
    ) public {
        require(!addressHasSbt[to], "address already have SBT");
    
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
    
        idToSBTData[tokenId] = SBTData({
            hashData: hashData,
            encryptedExpiryDate: encryptedExpiryDate
        });
        // _safeMint(to, tokenId);
        _mint(to, tokenId);
        addressHasSbt[to] = true;
        userToTokenId[to] = tokenId;
    }

    function getHashData(uint256 tokenId) external view returns (bytes memory) {
        return idToSBTData[tokenId].hashData;
    }

    //  commenting the other fields for now
    function getEncryptedData(uint256 tokenId)
        external
        view
        returns (
            EncryptedData memory // EncryptedData memory,
        )
    {
        return idToSBTData[tokenId].encryptedExpiryDate;
        // idToSBTData[tokenId].encryptedOwnerName,
        // idToSBTData[tokenId].encryptedLicenseNumber,
        // idToSBTData[tokenId].encryptedIssuanceDate,

        // idToSBTData[tokenId].encryptedLicenseType
    }

    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }


    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function tokenIdLookup(address tokenOwner) public view  returns (uint256) {
        require(addressHasSbt[tokenOwner], "address don't have SBT");
        return userToTokenId[tokenOwner];
    }
}
