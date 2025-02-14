/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MetaTransaction } from "near-safe";
import { isAddress, parseEther, parseUnits } from "ethers";
import { getBancorPoolTokens } from "../../modules/get-bancor-pool-tokens";
import { ERC20_TOKEN_APPROVAL, tradeContract } from "../../modules/trade-contract-read";
import { Interface } from "ethers";
import { POOL_COLLECTION_WRITE_ABI } from "../../modules/abi/pool-collection-write";

export const createTradeByTargetAmount = async (
    sourceToken: string,
    targetToken: string,
    targetAmount: number,
    beneficiary: string,
    slippage: number
) => {
    try {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const deadline = currentTimestamp + 300;

        let BANCOR_POOL_TOKENS = await getBancorPoolTokens();

        BANCOR_POOL_TOKENS = BANCOR_POOL_TOKENS.reduce((acc: any, token: any) => {
            acc[token.name] = token.poolDltId;
            return acc;
        }, {});

        const isValidSourceToken: boolean =
            sourceToken in BANCOR_POOL_TOKENS || isAddress(sourceToken);
        const isValidTargetToken: boolean =
            targetToken in BANCOR_POOL_TOKENS || isAddress(sourceToken);

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

        const potentialInputAmount = await contract.tradeInputByTargetAmount(
            sourceTokenToUse,
            targetTokenToUse,
            parseUnits(String(targetAmount), "ether")
        );

        const maxInputAmount =
            potentialInputAmount - (potentialInputAmount * BigInt(slippage)) / BigInt(100);

        const functionName = "tradeByTargetAmount";
        const functionArgs = [
            sourceTokenToUse,
            targetTokenToUse,
            parseUnits(String(targetAmount), "ether"),
            maxInputAmount,
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
                to: process.env.NEXT_PUBLIC_BANCOR_POOL_WRITE_COLLECTION_ADDRESS as string,
                value: parseEther(targetAmount.toString()).toString(),
                data: transactionEncodedData,
            };

            return { transaction };
        } else {
            const ERC20TransactionEncodedData = ERC20_TOKEN_APPROVAL();

            // Create Token Approval transaction object
            const erc20TokenApprovalTransaction: MetaTransaction = {
                to: targetTokenToUse,
                value: "0x0",
                data: ERC20TransactionEncodedData,
            };

            // Create EVM transaction object
            const transaction: MetaTransaction = {
                to: process.env.NEXT_PUBLIC_BANCOR_POOL_WRITE_COLLECTION_ADDRESS as string,
                value: "0x0",
                data: transactionEncodedData,
            };

            console.log(erc20TokenApprovalTransaction);
            console.log(transaction);
            return { erc20TokenApprovalTransaction, transaction };
        }
    } catch (error) {
        throw error;
    }
};
