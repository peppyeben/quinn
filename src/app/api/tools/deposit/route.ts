import { NextResponse } from "next/server";
import { signRequestFor } from "@bitte-ai/agent-sdk";
import { headers } from "next/headers";
import { isAddress } from "ethers";
import { deposit } from ".";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get("token");
        const amount = parseFloat(searchParams.get("amount") || "0");
        const beneficiary = searchParams.get("beneficiary") || null;

        const mbMetadataHeader = (await headers()).get("mb-metadata");
        const mbMetadata: { accountId: string; evmAddress: string } | undefined =
            mbMetadataHeader && JSON.parse(mbMetadataHeader);

        const recepient = beneficiary ?? mbMetadata?.evmAddress ?? "";

        if (!recepient || !isAddress(recepient)) {
            // console.log(`to: ${to}\namount: ${amount}`);

            return NextResponse.json(
                {
                    error: "A beneficiary/recepient for the trade is missing, or you could connect your EVM wallet to be the recepient of the trade.",
                },
                { status: 400 }
            );
        }

        if (!token || amount <= 0) {
            return NextResponse.json(
                { error: "one or more of the parameters are incorrect" },
                { status: 400 }
            );
        }

        const transaction = await deposit(token, amount, recepient || undefined);

        const signRequestTransaction = signRequestFor({
            chainId: 1,
            metaTransactions: [transaction],
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
