import { NextResponse } from "next/server";
import { getTradeInput } from ".";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sourceToken = searchParams.get("sourceToken");
        const targetToken = searchParams.get("targetToken");
        const targetAmount = parseFloat(searchParams.get("targetAmount") || "0");

        if (!sourceToken || !targetToken || targetAmount <= 0) {
            return NextResponse.json({ error: "one or more of the parameters are incorrect" }, { status: 400 });
        }

        const result = await getTradeInput(sourceToken, targetToken, targetAmount);

        // Return the result
        return NextResponse.json({ result: String(result) }, { status: 200 });
    } catch (error) {
        console.error("Error in trade input:", error);
        return NextResponse.json({ error: "Failed to perform get trade input" }, { status: 500 });
    }
}
