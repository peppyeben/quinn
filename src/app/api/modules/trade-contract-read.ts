import { Contract } from "ethers";
import { Address } from "viem";
import { POOL_COLLECTION_READ_ABI } from "./abi/pool-collection-read";
import { JsonRpcProvider } from "ethers";
import { Interface } from "ethers";
import { ERC20_TOKEN_ABI } from "./abi/erc20-token-abi";

export const tradeContract = async () => {
    const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL as string);

    const contract = new Contract(
        process.env.NEXT_PUBLIC_BANCOR_POOL_READ_COLLECTION_ADDRESS as Address,
        POOL_COLLECTION_READ_ABI,
        provider
    );

    return contract;
};

export const MAX_UINT256 = BigInt(2) ** BigInt(256) - BigInt(1);

export const ERC20_TOKEN_APPROVAL = () => {
    const functionName = "approve";
    const functionArgs = [
        process.env.NEXT_PUBLIC_BANCOR_POOL_WRITE_COLLECTION_ADDRESS as string,
        MAX_UINT256,
    ];

    const iface = new Interface(ERC20_TOKEN_ABI);
    const transactionEncodedData = iface.encodeFunctionData(functionName, functionArgs);

    return transactionEncodedData;
};

// TO-DO: When the signer's address is a param (from)
export const ERC20TokenContract = async (ERC20Token: string) => {
    const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL as string);

    const contract = new Contract(ERC20Token as Address, ERC20_TOKEN_ABI, provider);

    return contract;
};
