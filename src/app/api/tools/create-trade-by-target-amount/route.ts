import { NextResponse } from "next/server";
import { signRequestFor } from "@bitte-ai/agent-sdk";
import { headers } from "next/headers";
import { createTradeByTargetAmount } from ".";
import { isAddress } from "ethers";
import { MetaTransaction } from "near-safe";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sourceToken = searchParams.get("sourceToken");
        const targetToken = searchParams.get("targetToken");
        const targetAmount = parseFloat(searchParams.get("targetAmount") || "0");
        const beneficiary = searchParams.get("beneficiary") || null;
        const slippage = Number(searchParams.get("slippage")) || 1;

        const mbMetadataHeader = (await headers()).get("mb-metadata");
        const mbMetadata: { accountId: string; evmAddress: string } | undefined =
            mbMetadataHeader && JSON.parse(mbMetadataHeader);

        const recipient = beneficiary ?? mbMetadata?.evmAddress ?? "";

        if (!recipient || !isAddress(recipient)) {
            // console.log(`to: ${to}\namount: ${amount}`);

            return NextResponse.json(
                {
                    error: "A beneficiary/recipient for the trade is missing, or you could connect your EVM wallet to be the recepient of the trade.",
                },
                { status: 400 }
            );
        }

        if (!sourceToken || !targetToken || targetAmount <= 0) {
            return NextResponse.json(
                { error: "one or more of the parameters are incorrect" },
                { status: 400 }
            );
        }

        const { erc20TokenApprovalTransaction, transaction } = await createTradeByTargetAmount(
            sourceToken,
            targetToken,
            targetAmount,
            recipient,
            slippage
        );

        const signRequestTransaction = signRequestFor({
            chainId: 1,
            metaTransactions: [erc20TokenApprovalTransaction, transaction].filter(
                (tx): tx is MetaTransaction => tx !== null && tx !== undefined
            ),
        });

        return NextResponse.json({ evmSignRequest: signRequestTransaction }, { status: 200 });
    } catch (error) {
        console.error("Error generating EVM transaction for creating trade:", error);
        return NextResponse.json(
            { error: "Failed to generate EVM transaction for generating trade" },
            { status: 500 }
        );
    }
}
