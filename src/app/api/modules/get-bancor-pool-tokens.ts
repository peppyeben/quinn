import axios from "axios";

export const getBancorPoolTokens = async () => {
    try {
        const API_URL = "https://api-v3.bancor.network/pools";

        const res = await axios.get(API_URL);

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
