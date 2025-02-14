/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import https from "https";

export const getBancorPoolTokens = async () => {
    try {
        const API_URL = process.env.NEXT_PUBLIC_BANCOR_POOL_API_URL as string;

        // Create custom agent with forced IPv4
        const agent = new https.Agent({
            family: 4, // Force IPv4
            rejectUnauthorized: true,
        });

        const res = await axios.get(API_URL, {
            timeout: 30000,
            httpsAgent: agent,
        });

        const mappedRes = res.data.data
            .filter((x: any) => x.tradingEnabled == true)
            .map((x: any) => ({
                poolDltId: x.poolDltId,
                poolTokenDltId: x.poolTokenDltId,
                name: x.name,
                decimals: x.decimals,
                autoCompoundingRewardsActive: x.autoCompoundingRewardsActive,
                tradingFeePPM: x.tradingFeePPM,
                tradingEnabled: x.tradingEnabled,
                depositingEnabled: x.depositingEnabled,
            }));

        return mappedRes;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getBancorPoolTokensDepositEnabled = async () => {
    try {
        const API_URL = process.env.NEXT_PUBLIC_BANCOR_POOL_API_URL as string;

        // Create custom agent with forced IPv4
        const agent = new https.Agent({
            family: 4, // Force IPv4
            rejectUnauthorized: true,
        });

        const res = await axios.get(API_URL, {
            timeout: 30000,
            httpsAgent: agent,
        });
        const mappedRes = res.data.data
            .filter((x: any) => x.depositingEnabled == true)
            .map((x: any) => ({
                poolDltId: x.poolDltId,
                poolTokenDltId: x.poolTokenDltId,
                name: x.name,
                decimals: x.decimals,
                autoCompoundingRewardsActive: x.autoCompoundingRewardsActive,
                tradingFeePPM: x.tradingFeePPM,
                tradingEnabled: x.tradingEnabled,
                depositingEnabled: x.depositingEnabled,
            }));

        return mappedRes;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
