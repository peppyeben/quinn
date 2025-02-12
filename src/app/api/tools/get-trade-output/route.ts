import { NextResponse } from "next/server";
import { getTradeOutput } from ".";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sourceToken = searchParams.get("sourceToken");
        const targetToken = searchParams.get("targetToken");
        const sourceAmount = parseFloat(searchParams.get("sourceAmount") || "0");

        if (!sourceToken || !targetToken || sourceAmount <= 0) {
            return NextResponse.json({ error: "one or more of the parameters are incorrect" }, { status: 400 });
        }

        const result = await getTradeOutput(sourceToken, targetToken, sourceAmount);

        // Return the result
        return NextResponse.json({ result: String(result) }, { status: 200 });
    } catch (error) {
        console.error("Error in trade output:", error);
        return NextResponse.json({ error: "Failed to perform get trade output" }, { status: 500 });
    }
}
