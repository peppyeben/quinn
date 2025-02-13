/* eslint-disable @typescript-eslint/no-explicit-any */
import { isAddress, parseUnits } from "ethers";
import { tradeContract } from "../../modules/trade-contract-read";
import { getBancorPoolTokens } from "../../modules/get-bancor-pool-tokens";

export const getTradeInput = async (
    sourceToken: string,
    targetToken: string,
    targetAmount: number
) => {
    try {
        let BANCOR_POOL_TOKENS = await getBancorPoolTokens();

        BANCOR_POOL_TOKENS = BANCOR_POOL_TOKENS.reduce((acc: any, token: any) => {
            acc[token.name] = token.poolDltId;
            return acc;
        }, {});

        const isValidSourceToken: boolean =
            sourceToken in BANCOR_POOL_TOKENS || isAddress(sourceToken);
        const isValidTargetToken: boolean =
            targetToken in BANCOR_POOL_TOKENS || isAddress(sourceToken);

        if (isValidSourceToken && isValidTargetToken) {
            const sourceTokenKey = sourceToken as keyof typeof BANCOR_POOL_TOKENS;
            const targetTokenKey = targetToken as keyof typeof BANCOR_POOL_TOKENS;

            const sourceTokenToUse = isAddress(sourceToken)
                ? sourceToken
                : BANCOR_POOL_TOKENS[sourceTokenKey];
            const targetTokenToUse = isAddress(targetToken)
                ? targetToken
                : BANCOR_POOL_TOKENS[targetTokenKey];

            const contract = await tradeContract();

            const data = await contract.tradeInputByTargetAmount(
                sourceTokenToUse,
                targetTokenToUse,
                parseUnits(String(targetAmount), "ether")
            );

            return data;
        }

        return null;
    } catch (error: any) {
        throw error;
    }
};
