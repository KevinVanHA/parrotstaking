import { FC } from 'react';
import { ThirdwebNftMedia, useContract, useNFT, Web3Button } from '@thirdweb-dev/react';
import styles from "../styles/NFTCard.module.css";

interface NFTCardProps {
  tokenId: number;
}

const NFTCard: FC<NFTCardProps> = ({ tokenId }) => {
  const parrotAddress = "0xc0928a85395cbbEbf2Bb10B7252ca626659cF3e7";
  const stakingAddress = "0x2A2720Ea89186Eef2Ac62be7cF347AC1d58FEbbD";

  const { contract: parrotContract } = useContract(parrotAddress, "nft-drop");
  const { contract: stakingContract } = useContract(stakingAddress);

  const { data: nft } = useNFT(parrotContract, tokenId);

  async function withdraw(nftId: string) {
    await stakingContract?.call("withdraw", [[nftId]]);
  }

  return (
    <>
      {nft && (
        <div className={styles.card}>
          <h3 className={styles.title}>{nft.metadata.name}</h3>
          {nft.metadata && (
            <div className={styles.content}>
              <div className={styles.imageContainer}>
                <ThirdwebNftMedia
                  metadata={nft.metadata}
                />
              </div>
              <div className={styles.buttonContainer}>
                <Web3Button
                  contractAddress={stakingAddress}
                  action={() => withdraw(nft.metadata.id)}
                  className={styles.button}
                >
                  Unstake
                </Web3Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default NFTCard;
