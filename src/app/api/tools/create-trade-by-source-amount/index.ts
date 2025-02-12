import type { MetaTransaction } from "near-safe";
import { ethers, isAddress, parseEther, parseUnits } from "ethers";
import { getBancorPoolTokens } from "../../modules/get-bancor-pool-tokens";
import { tradeContract } from "../../modules/trade-contract-read";
import { Interface } from "ethers";
import { POOL_COLLECTION_WRITE_ABI } from "../../modules/abi/pool-collection-write";

export const createTradeBySourceAmount = async (
    sourceToken: string,
    targetToken: string,
    sourceAmount: number,
    beneficiary: string,
    slippage: number
) => {
    //     Token sourceToken,
    //     Token targetToken,
    //     uint256 sourceAmount,
    //     uint256 minReturnAmount,
    //     uint256 deadline,
    //     address beneficiary

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const deadline = currentTimestamp + 300;

    let BANCOR_POOL_TOKENS = await getBancorPoolTokens();

    BANCOR_POOL_TOKENS = BANCOR_POOL_TOKENS.reduce((acc: any, token: any) => {
        acc[token.name] = token.poolDltId;
        return acc;
    }, {});

    const isValidSourceToken: boolean = sourceToken in BANCOR_POOL_TOKENS || isAddress(sourceToken);
    const isValidTargetToken: boolean = targetToken in BANCOR_POOL_TOKENS || isAddress(sourceToken);

    if (!isValidSourceToken || !isValidTargetToken) {
        throw "Invalid source or target token";
    }

    const sourceTokenKey = sourceToken as keyof typeof BANCOR_POOL_TOKENS;
    const targetTokenKey = targetToken as keyof typeof BANCOR_POOL_TOKENS;

    const sourceTokenToUse = isAddress(sourceToken)
        ? sourceToken
        : BANCOR_POOL_TOKENS[sourceTokenKey];
    const targetTokenToUse = isAddress(targetToken)
        ? targetToken
        : BANCOR_POOL_TOKENS[targetTokenKey];

    const contract = await tradeContract();

    const potentialOutputAmount = await contract.tradeOutputBySourceAmount(
        sourceTokenToUse,
        targetTokenToUse,
        parseUnits(String(sourceAmount), "ether")
    );

    const minReturnAmount =
        potentialOutputAmount - (potentialOutputAmount * BigInt(slippage)) / BigInt(100);

    const functionName = "tradeBySourceAmount";
    const functionArgs = [
        sourceTokenToUse,
        targetTokenToUse,
        parseUnits(String(sourceAmount), "ether"),
        minReturnAmount,
        deadline,
        beneficiary,
    ];

    const iface = new Interface(POOL_COLLECTION_WRITE_ABI);
    const transactionEncodedData = iface.encodeFunctionData(functionName, functionArgs);

    // If trying to trade with ETH, there should be a value
    if (
        String(sourceTokenToUse).toLowerCase() ==
        "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLowerCase()
    ) {
        // Create EVM transaction object
        const transaction: MetaTransaction = {
            to: beneficiary,
            value: parseEther(sourceAmount.toString()).toString(),
            data: transactionEncodedData,
        };

        return transaction;
    } else {
        // Create EVM transaction object
        const transaction: MetaTransaction = {
            to: beneficiary,
            value: "0x",
            data: transactionEncodedData,
        };

        return transaction;
    }
};
