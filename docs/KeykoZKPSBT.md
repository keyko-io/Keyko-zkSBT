# KeykoZKPSBT

*Fabriziogianni7 (forked from Masa Finance)*

> ZKP SBT

Soulbound token implementing ZKPwriting here minting to make it easier to test (It would be used only in demo POC)mintable by the deployer if the contract (It should not be this way for the outlines of SBTs)



## Methods

### addressToId

```solidity
function addressToId(address) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### getEncryptedData

```solidity
function getEncryptedData(uint256 tokenId) external view returns (struct EncryptedData, struct EncryptedData, struct EncryptedData, struct EncryptedData, struct EncryptedData)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | EncryptedData | undefined |
| _1 | EncryptedData | undefined |
| _2 | EncryptedData | undefined |
| _3 | EncryptedData | undefined |
| _4 | EncryptedData | undefined |

### getHashData

```solidity
function getHashData(uint256 tokenId) external view returns (bytes)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes | undefined |

### mint

```solidity
function mint(address _to, SBTData data) external nonpayable returns (uint256 tokenId)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _to | address | undefined |
| data | SBTData | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| tokenId | uint256 | undefined |




