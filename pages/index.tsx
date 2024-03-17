import { ConnectWallet, ThirdwebNftMedia, Web3Button, useAddress, useContract, useContractRead, useOwnedNFTs } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { NextPage } from "next";
import { fail } from "assert";
import { BigNumber } from "ethers";
import NFTCard from '../components/NFTCard';
import { useEffect, useState } from "react";
import { ethers } from "ethers";


const Home: NextPage = () => {

  const address = useAddress ();
  
  const parrotAddress = "0xc0928a85395cbbEbf2Bb10B7252ca626659cF3e7";
  const stakingAddress ="0x2A2720Ea89186Eef2Ac62be7cF347AC1d58FEbbD";

  const { contract: parrotContract } = useContract(parrotAddress, "nft-drop");
  const { contract: stakingContract } = useContract(stakingAddress);

  const { data:myParrotNFTs} = useOwnedNFTs(parrotContract, address);
  const { data: stakedParrotNFTs } = useContractRead(stakingContract, "getStakeInfo", [address]);



  async function stakeNFT(nftId: string | undefined) {
    if (!address || nftId === undefined) return;

    const isApproved = await parrotContract?.isApproved(
        address,
        stakingAddress
    );

    if (!isApproved) {
        await parrotContract?.setApprovalForAll(stakingAddress, true);
    }

    await stakingContract?.call("stake", [nftId]);
}

  const [claimableReward, setClaimableRewards] = useState<BigNumber>();

    useEffect(() => {
      if(!stakingContract || !address) return;

      async function loadClaimableRewards() {
          const stakeInfo = await stakingContract?.call("getStakeInfo", [address])
          setClaimableRewards(stakeInfo[1]);
      }

      loadClaimableRewards();
    }, [address, stakingContract]);

  return (
    <div className= {styles.container}>
    <main className={styles.main}>
     <h1>Parrot NFT</h1>
     <Web3Button
      contractAddress={parrotAddress}
      action={(parrotContract) => parrotContract.erc721.claim(1)}
     >Claim Parrot</Web3Button>   
     <br />
      <h1>My Parrots:</h1>
      <div>
        {myParrotNFTs?.map((nft) => (
          // eslint-disable-next-line react/jsx-key
          <div className={styles.nftContainer}>
          <div>
              <h3>{nft.metadata.name}</h3>
              <ThirdwebNftMedia
              metadata={nft.metadata}
              height="150px"
              width="200px"
              />
              </div>
              <br />
              <div className={styles.buttonContainer}>
              <Web3Button
              contractAddress={stakingAddress}
              action={() => address && stakeNFT([nft.metadata.id].join(""))}
              >Stake Parrot</Web3Button>
          </div>
          </div>
          
        ))}
      </div>
      <h1> Staked Parrots:</h1>
      <div>
          {stakedParrotNFTs && stakedParrotNFTs[0].map((stakedNFT: BigNumber) => (
            <div key={stakedNFT.toString()}>
                <NFTCard tokenId={stakedNFT.toNumber()} />
            </div>
          ))}

      </div>
      <br />
      <h1> Claimable $PECANS:</h1>
      {!claimableReward? "Loading..." : ethers.utils.formatUnits(claimableReward, 18) }
      <Web3Button
      contractAddress={stakingAddress} 
      action={(stakingContract) => stakingContract.call("claimRewards")}
      >Claim $PECAN</Web3Button>
    </main>
    </div>
    );
};

export default Home;
