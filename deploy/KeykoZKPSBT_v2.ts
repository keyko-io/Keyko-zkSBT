import hre from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { getEnvParams, getPrivateKey } from "../src/EnvParams";

let admin: SignerWithAddress;

const func: DeployFunction = async ({
  // @ts-ignore
  getNamedAccounts,
  // @ts-ignore
  deployments,
  // @ts-ignore
  ethers,
  network
}) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // [, admin] = await ethers.getSigners();
  const env = getEnvParams(network.name);
  // const baseUri = `${env.BASE_URI}`;

  const constructorArguments = [
    // env.SBT_NAME,
    // env.SBT_SYMBOL,
  ];

  const keykoZKPSBT_v2DeploymentResult = await deploy(
    "KeykoZKPSBT_v2",
    {
      from: deployer,
      args: constructorArguments,
      log: true
    }
  );
  // verify contract with etherscan, if its not a local network
  if (network.name !== "hardhat") {
    try {
      await hre.run("verify:verify", {
        address: keykoZKPSBT_v2DeploymentResult.address,
        constructorArguments
      });
    } catch (error) {
      if (
        !error.message.includes("Contract source code already verified") &&
        !error.message.includes("Reason: Already Verified")
      ) {
        throw error;
      }
    }
  }

  if (network.name === "hardhat" || network.name === "goerli") {
    // const signer = env.ADMIN
    //   ? new ethers.Wallet(getPrivateKey(network.name), ethers.provider)
    //   : admin;

    const keykoZKPSBT_v2 = await ethers.getContractAt(
      "KeykoZKPSBT_v2",
      keykoZKPSBT_v2DeploymentResult.address
    );
    // console.log("keykoZKPSBT_v2",keykoZKPSBT_v2)

  }
};

func.tags = ["keykoZKPSBT_v2"];
func.dependencies = [];
export default func;
