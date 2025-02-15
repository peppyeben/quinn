## What is Quinn?

Quinn is an AI agent designed to provide users with information on tradeable tokens and exchange rates on the [Bancor network](https://bancor.network/). Bancor facilitates instant, low-cost trading, single-sided liquidity provision, and liquidity protection for any listed token.

Quinn's primary function is to help users navigate and interact with the Bancor Network by providing access to information for trading and liquidity.

The agent can perform several tasks on the Bancor network:

**1. Provide a list of tradeable tokens on the Bancor Network:** With Quinn agent, users can verify whether a specific token is supported for trading.

**2. Calculate trade outputs:** Quinn agent can calculate trade outputs, or exchange rates for a specific trade. This requires a source token, target token, and source amount.

-   **Source Token:** The token the user has and is willing to trade.
-   **Target Token:** The token the user wants to acquire.
-   **Source Amount:** The amount of the source token the user is willing to trade.

For example, if a user wants to trade a certain amount of ETH for DAI, they would input ETH as the source token, DAI as the target token, and specify the amount of ETH they are willing to trade (source amount)1. The Quinn agent then calculates and returns the amount of DAI the user would receive for that ETH amount

**3. Calculate Trade Inputs:** Quinn agent tells the user the amount of source token they need to get their target token. The agent requires a source token, target token, and target amount.

-   **Source Token:** The token the user has
-   **Target Token:** The token the user wants
-   **Source Amount:** The amount of the source token the user is willing to trade.

For example, if a user wants to receive 50 LINK and is willing to trade ETH, the user would input ETH as the source token, LINK as the target token, and 50 LINK as the target amount1. The agent then calculates how much ETH is needed to get 50 LINK.

**4. Create Trade Transactions:** Quinn can create trades for you in the following way:

-   You can create a trade by entering the source token, target token, and source amount you want. You can also pick who gets the tokens (beneficiary) and how much the price can change (slippage). Picking a beneficiary is optional if your EVM wallet is connected.

-   Or, you can create a trade by saying how much of the target token you want. Similar to the previous method, specifying a beneficiary and slippage is optional.

For example, If you want to trade 1 ETH for DAI, you enter ETH as the source token, DAI as the target token, and 1 ETH as the source amount. Quinn then creates the trade. If you want 100 DAI and have ETH, you enter ETH as the source token, DAI as the target token, and 100 DAI as the target amount.
