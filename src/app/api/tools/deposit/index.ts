/* eslint-disable @typescript-eslint/no-explicit-any */
import { isAddress, parseEther, parseUnits } from "ethers";
import { getBancorPoolTokensDepositEnabled } from "../../modules/get-bancor-pool-tokens";
import { Interface } from "ethers";
import { POOL_COLLECTION_WRITE_ABI } from "../../modules/abi/pool-collection-write";
import { MetaTransaction } from "near-safe";
import { ERC20_TOKEN_APPROVAL } from "../../modules/trade-contract-read";

export const deposit = async (token: string, amount: number, recepient?: string) => {
    try {
        let BANCOR_POOL_TOKENS = await getBancorPoolTokensDepositEnabled();

        BANCOR_POOL_TOKENS = BANCOR_POOL_TOKENS.reduce((acc: any, token: any) => {
            acc[token.name] = token.poolDltId;
            return acc;
        }, {});

        const isValidToken: boolean = token in BANCOR_POOL_TOKENS || isAddress(token);

        if (!isValidToken) {
            throw "Invalid token";
        }

        const tokenKey = token as keyof typeof BANCOR_POOL_TOKENS;

        const tokenToUse = isAddress(token) ? token : BANCOR_POOL_TOKENS[tokenKey];

        if (!recepient) {
            const functionName = "deposit";
            const functionArgs = [tokenToUse, parseUnits(String(amount), "ether")];

            const iface = new Interface(POOL_COLLECTION_WRITE_ABI);
            const transactionEncodedData = iface.encodeFunctionData(functionName, functionArgs);

            // If trying to trade with ETH, there should be a value
            if (
                String(tokenToUse).toLowerCase() ==
                "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLowerCase()
            ) {
                // Create EVM transaction object
                const transaction: MetaTransaction = {
                    to: process.env.NEXT_PUBLIC_BANCOR_POOL_WRITE_COLLECTION_ADDRESS as string,
                    value: parseEther(amount.toString()).toString(),
                    data: transactionEncodedData,
                };

                console.log(transaction);

                return { transaction };
            } else {
                const ERC20TransactionEncodedData = ERC20_TOKEN_APPROVAL();

                // Create Token Approval transaction object
                const erc20TokenApprovalTransaction: MetaTransaction = {
                    to: token,
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
        } else {
            const functionName = "depositFor";
            const functionArgs = [recepient, tokenToUse, parseUnits(String(amount), "ether")];

            const iface = new Interface(POOL_COLLECTION_WRITE_ABI);
            const transactionEncodedData = iface.encodeFunctionData(functionName, functionArgs);

            // If trying to trade with ETH, there should be a value
            if (
                String(tokenToUse).toLowerCase() ==
                "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLowerCase()
            ) {
                // Create EVM transaction object
                const transaction: MetaTransaction = {
                    to: process.env.NEXT_PUBLIC_BANCOR_POOL_WRITE_COLLECTION_ADDRESS as string,
                    value: parseEther(amount.toString()).toString(),
                    data: transactionEncodedData,
                };

                console.log(transaction);

                return { transaction };
            } else {
                const ERC20TransactionEncodedData = ERC20_TOKEN_APPROVAL();

                // Create Token Approval transaction object
                const erc20TokenApprovalTransaction: MetaTransaction = {
                    to: token,
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
        }
    } catch (error) {
        throw error;
    }
};
