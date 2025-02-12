import { Contract } from "ethers";
import { Address } from "viem";
import { POOL_COLLECTION_READ_ABI } from "./abi/pool-collection-read";
import { JsonRpcProvider } from "ethers";

export const tradeContract = async () => {
    const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL as string);

    const contract = new Contract(
        process.env.NEXT_PUBLIC_BANCOR_POOL_READ_COLLECTION_ADDRESS as Address,
        POOL_COLLECTION_READ_ABI,
        provider
    );

    return contract;
};
