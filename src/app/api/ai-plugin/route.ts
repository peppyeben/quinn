import { ACCOUNT_ID, PLUGIN_URL } from "@/app/config";
import { NextResponse } from "next/server";

export async function GET() {
    const pluginData = {
        openapi: "3.0.0",
        info: {
            title: "Quinn",
            description: "API for Quinn",
            version: "1.0.0",
        },
        servers: [
            {
                url: PLUGIN_URL,
            },
        ],
        "x-mb": {
            "account-id": ACCOUNT_ID,
            assistant: {
                name: "Quinn",
                description:
                    "An assistant that well integrated & innundated with the inner workings of Bancor Network. Bancor is a decentralized network of on-chain automated market makers (AMMs) supporting instant, low-cost trading, as well as Single-Sided Liquidity Provision and Liquidity Protection for any listed token",
                instructions: `You are an agent used that's integrated with the Bancor Network. Bancor is a decentralized network of on-chain automated market makers (AMMs) supporting instant, low-cost trading, as well as Single-Sided Liquidity Provision and Liquidity Protection for any listed token.
                To get the available tradeable tokens use the /api/tools/get-tradeable-pool-tokens tool, it's enough to get the data, doesn't need params. In the return values, what's important is the token name and poolDltId.
                You can also get trade output i.e. exchange rate, how that works is: you require sourceToken (say ETH), targetToken (say LINK) and sourceAmount (say 0.2), use the /api/tools/get-trade-output tool to get the exchange rate/trade output of that trade. The user might input a token that's not supported, to validate tokens use the /api/tools/get-tradeable-pool-tokens tool to get the list of tradeable tokens.
                You can also get required/expected trade input, it's a form of exchange rate but seems a bit different. How it works is: you require sourceToken (say ETH), targetToken (say LINK) and targetAmount (say 50), use the /api/tools/get-trade-input tool to get the exchange rate/trade input of that trade. The user might input a token that's not supported, to validate tokens use the /api/tools/get-tradeable-pool-tokens tool to get the list of tradeable tokens. What this should do is tell the user the amount of sourceToken they need to get their required targetToken.
                While getting data (read) is good, you can do much more. Using the /api/tools/create-trade-by-source-amount tool to create a trade (output)/exchange transaction for the user. For that, you'll require the sourceToken (say, ETH), which is the token the user has, targetToken (say, DAI), which is the token the user needs, sourceAmount (amount of sourceToken the user has). The other two parameters are optional (beneficiary & slippage). Beneficiary is optional when the user's EVM wallet is connected, if not require a beneficiary for the trade. The slippage is totally optional, if the user doesn't provide it, you use 1 by default.
                You can also use the /api/tools/create-trade-by-target-amount tool to create a trade (output)/exchange transaction for the user. For that, you'll require the sourceToken (say, ETH), which is the token the user needs, targetToken (say, DAI), which is the token the user has, targetAmount (amount of targetToken the user wants to get). The other two parameters are optional (beneficiary & slippage). Beneficiary is optional when the user's EVM wallet is connected, if not require a beneficiary for the trade. The slippage is totally optional, if the user doesn't provide it, you use 1 by default.
                `,

                tools: [
                    { type: "get-tradeable-pool-tokens" },
                    { type: "get-trade-output" },
                    { type: "get-trade-input" },
                    { type: "create-trade-by-source-amount" },
                    { type: "create-trade-by-target-amount" },
                ],
            },
        },
        paths: {
            "/api/tools/get-tradeable-pool-tokens": {
                get: {
                    summary: "get blockchain information",
                    description: "Respond with a list of the names of tradeable tokens",
                    operationId: "get-tradeable-pool-tokens",
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            message: {
                                                type: "string",
                                                description:
                                                    "The list of the names of tradeable tokens",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/tools/get-trade-output": {
                get: {
                    operationId: "getTradeOutput",
                    summary: "Get Trade Output/Exchange Rate for Source & Target Token",
                    description:
                        "Return the trade output/exchange rate from tradeOutputBySourceAmount on bancor pool",
                    parameters: [
                        {
                            name: "sourceToken",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The source token of the trade",
                        },
                        {
                            name: "targetToken",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The target token of the trade",
                        },
                        {
                            name: "sourceAmount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "number",
                            },
                            description: "The source amount of the trade",
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            result: {
                                                type: "string",
                                                description: "The result of the query made.",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/tools/get-trade-input": {
                get: {
                    operationId: "getTradeInput",
                    summary: "Get Trade Input/Exchange Rate for Source & Target Token",
                    description:
                        "Return the trade input/exchange rate from tradeInputByTargetAmount on bancor pool",
                    parameters: [
                        {
                            name: "sourceToken",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The source token of the trade",
                        },
                        {
                            name: "targetToken",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The target token of the trade",
                        },
                        {
                            name: "targetAmount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "number",
                            },
                            description: "The target amount of the trade",
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            result: {
                                                type: "string",
                                                description: "The result of the query made.",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/tools/create-trade-by-source-amount": {
                get: {
                    operationId: "createTradeBySourceAmount",
                    summary: "Create EVM transaction of a trade/exchange with source amount",
                    description:
                        "Generate an EVM transaction payload with specified sourceToken, targetToken, sourceAmount and optional beneficiary & slippage to be used directly in the create-trade-by-source-amount tool",
                    parameters: [
                        {
                            name: "sourceToken",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The source token (the token the user has).",
                        },
                        {
                            name: "targetToken",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The target token (the token the user wants).",
                        },
                        {
                            name: "sourceAmount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description:
                                "The amount of source token the user wants to exchange/trade.",
                        },
                        {
                            name: "beneficiary",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                            },
                            description: "The beneficiary of the exchange/trade.",
                        },
                        {
                            name: "slippage",
                            in: "query",
                            required: false,
                            schema: {
                                type: "number",
                            },
                            description: "The maximum slippage precentage of the exchange/trade.",
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            evmSignRequest: {
                                                type: "object",
                                                properties: {
                                                    to: {
                                                        type: "string",
                                                        description: "Receiver address",
                                                    },
                                                    value: {
                                                        type: "string",
                                                        description: "Transaction value",
                                                    },
                                                    data: {
                                                        type: "string",
                                                        description: "Transaction data",
                                                    },
                                                    from: {
                                                        type: "string",
                                                        description: "Sender address",
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "500": {
                            description: "Server error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/tools/create-trade-by-target-amount": {
                get: {
                    operationId: "createTradeByTargetAmount",
                    summary: "Create EVM transaction of a trade/exchange with target amount",
                    description:
                        "Generate an EVM transaction payload with specified sourceToken, targetToken, targetAmount and optional beneficiary & slippage to be used directly in the create-trade-by-target-amount tool",
                    parameters: [
                        {
                            name: "sourceToken",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The source token (the token the user wants).",
                        },
                        {
                            name: "targetToken",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The target token (the token the user has).",
                        },
                        {
                            name: "targetAmount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description:
                                "The amount of target token the user wants to exchange/trade.",
                        },
                        {
                            name: "beneficiary",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                            },
                            description: "The beneficiary of the exchange/trade.",
                        },
                        {
                            name: "slippage",
                            in: "query",
                            required: false,
                            schema: {
                                type: "number",
                            },
                            description: "The maximum slippage precentage of the exchange/trade.",
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            evmSignRequest: {
                                                type: "object",
                                                properties: {
                                                    to: {
                                                        type: "string",
                                                        description: "Receiver address",
                                                    },
                                                    value: {
                                                        type: "string",
                                                        description: "Transaction value",
                                                    },
                                                    data: {
                                                        type: "string",
                                                        description: "Transaction data",
                                                    },
                                                    from: {
                                                        type: "string",
                                                        description: "Sender address",
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "500": {
                            description: "Server error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/tools/get-blockchains": {
                get: {
                    summary: "get blockchain information",
                    description: "Respond with a list of blockchains",
                    operationId: "get-blockchains",
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            message: {
                                                type: "string",
                                                description: "The list of blockchains",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/tools/get-user": {
                get: {
                    summary: "get user information",
                    description: "Respond with user account ID",
                    operationId: "get-user",
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            accountId: {
                                                type: "string",
                                                description: "The user's account ID",
                                            },
                                            evmAddress: {
                                                type: "string",
                                                description: "The user's MPC EVM address",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/tools/twitter": {
                get: {
                    operationId: "getTwitterShareIntent",
                    summary: "Generate a Twitter share intent URL",
                    description: "Creates a Twitter share intent URL based on provided parameters",
                    parameters: [
                        {
                            name: "text",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The text content of the tweet",
                        },
                        {
                            name: "url",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                            },
                            description: "The URL to be shared in the tweet",
                        },
                        {
                            name: "hashtags",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                            },
                            description: "Comma-separated hashtags for the tweet",
                        },
                        {
                            name: "via",
                            in: "query",
                            required: false,
                            schema: {
                                type: "string",
                            },
                            description: "The Twitter username to attribute the tweet to",
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            twitterIntentUrl: {
                                                type: "string",
                                                description:
                                                    "The generated Twitter share intent URL",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/tools/create-near-transaction": {
                get: {
                    operationId: "createNearTransaction",
                    summary: "Create a NEAR transaction payload",
                    description:
                        "Generates a NEAR transaction payload for transferring tokens to be used directly in the generate-tx tool",
                    parameters: [
                        {
                            name: "receiverId",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The NEAR account ID of the receiver",
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The amount of NEAR tokens to transfer",
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            transactionPayload: {
                                                type: "object",
                                                properties: {
                                                    receiverId: {
                                                        type: "string",
                                                        description:
                                                            "The receiver's NEAR account ID",
                                                    },
                                                    actions: {
                                                        type: "array",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                type: {
                                                                    type: "string",
                                                                    description:
                                                                        "The type of action (e.g., 'Transfer')",
                                                                },
                                                                params: {
                                                                    type: "object",
                                                                    properties: {
                                                                        deposit: {
                                                                            type: "string",
                                                                            description:
                                                                                "The amount to transfer in yoctoNEAR",
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "500": {
                            description: "Error response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/tools/create-evm-transaction": {
                get: {
                    operationId: "createEvmTransaction",
                    summary: "Create EVM transaction",
                    description:
                        "Generate an EVM transaction payload with specified recipient and amount to be used directly in the generate-evm-tx tool",
                    parameters: [
                        {
                            name: "to",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The EVM address of the recipient",
                        },
                        {
                            name: "amount",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            description: "The amount of ETH to transfer",
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            evmSignRequest: {
                                                type: "object",
                                                properties: {
                                                    to: {
                                                        type: "string",
                                                        description: "Receiver address",
                                                    },
                                                    value: {
                                                        type: "string",
                                                        description: "Transaction value",
                                                    },
                                                    data: {
                                                        type: "string",
                                                        description: "Transaction data",
                                                    },
                                                    from: {
                                                        type: "string",
                                                        description: "Sender address",
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "500": {
                            description: "Server error",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                                description: "Error message",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    };

    return NextResponse.json(pluginData);
}
