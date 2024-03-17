import { FC } from 'react';
import { ThirdwebNftMedia, useContract, useNFT, Web3Button } from '@thirdweb-dev/react';


interface NFTCardProps {
    tokenId: number; 

}
 
const NFTCard: FC<NFTCardProps> = ({ tokenId }) => {

    const parrotAddress = "0xc0928a85395cbbEbf2Bb10B7252ca626659cF3e7";
    const stakingAddress ="0x2A2720Ea89186Eef2Ac62be7cF347AC1d58FEbbD";

    const { contract: parrotContract } = useContract ( parrotAddress, "nft-drop");
    const { contract: stakingContract } = useContract ( stakingAddress);

    const { data: nft } = useNFT(parrotContract, tokenId);

    async function withdraw(nftId: string) {
        await stakingContract?.call("withdraw", [nftId]);
    }

    return (
        <>
        {nft && (
            <div>
                <h3>{nft.metadata.name}</h3>
                {nft.metadata && (
                    <ThirdwebNftMedia
                        metadata={nft.metadata}
                    />
                )}
                <Web3Button
                    contractAddress={stakingAddress}
                    action={() => withdraw(nft.metadata.id)} 
                >Unstake</Web3Button>
            </div>

        )}
        </>
     )  
}  

export default NFTCard;