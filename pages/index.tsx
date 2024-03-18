import { ConnectWallet, ThirdwebNftMedia, Web3Button, useAddress, useContract, useContractRead, useOwnedNFTs } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import { NextPage } from "next";
import { fail } from "assert";
import { BigNumber } from "ethers";
import NFTCard from '../components/NFTCard';
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Header from '../components/Header';
import Image1 from '../public/images/image1.jpg';
import Image2 from '../public/images/image2.jpg';
import Slider from '../components/Slider';




const Home: NextPage = () => {


  const address = useAddress ();
  
  const parrotAddress = "0xc0928a85395cbbEbf2Bb10B7252ca626659cF3e7";
  const stakingAddress ="0x2A2720Ea89186Eef2Ac62be7cF347AC1d58FEbbD";

  const { contract: parrotContract } = useContract(parrotAddress, "nft-drop");
  const { contract: stakingContract } = useContract(stakingAddress);

  const { data:myParrotNFTs} = useOwnedNFTs(parrotContract, address);
  const { data: stakedParrotNFTs } = useContractRead(stakingContract, "getStakeInfo", [address]);

  async function stakeNFT(nftId: string | undefined) {
    if (!address || !nftId) return;
  
    const isApproved = await parrotContract?.isApproved(
      address,
      stakingAddress
    );
  
    if (!isApproved) {
      await parrotContract?.setApprovalForAll(stakingAddress, true);
    }
  
    await stakingContract?.call("stake", [[nftId]]); // Pass an array of token IDs
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
    
    <div className={styles.container}>
      <div><Header /></div>
      <Slider images={['/images/image1.jpg', '/images/image2.jpg']} />
      <main className={styles.main}>
     <div className={styles.myParrotsContainer}>
     <h1>Parrot NFT</h1>
     <Web3Button
      contractAddress={parrotAddress}
      action={(parrotContract) => parrotContract.erc721.claim(1)}
     >Claim Parrot</Web3Button>   
     <br />
     <br />
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
      </div>
      <div className={styles.stakedParrotsContainer}>
      <h1> Staked Parrots:</h1>
      <div>
          {stakedParrotNFTs && stakedParrotNFTs[0].map((stakedNFT: BigNumber) => (
            <div key={stakedNFT.toString()}>
                <NFTCard tokenId={stakedNFT.toNumber()} />
            </div>
          ))}

      </div>
      </div>
      <br />
      <div className={styles.claimableRewardsContainer}>
      <h1> Claimable $PECANS:</h1>
      {!claimableReward? "Loading..." : ethers.utils.formatUnits(claimableReward, 18) }
      <br />
      <br />
      <Web3Button
      contractAddress={stakingAddress} 
      action={(stakingContract) => stakingContract.call("claimRewards")}
      >Claim $PECAN</Web3Button>
      </div>
    </main>
    </div>
    
    );
};

export default Home;