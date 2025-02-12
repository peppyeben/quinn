import { NextResponse } from "next/server";
import { getBancorPoolTokens } from "../../modules/get-bancor-pool-tokens";

export async function GET() {
    try {
        const result = await getBancorPoolTokens();

        // Return the result
        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        console.error("Error in getting bancor pool tokens:", error);
        return NextResponse.json({ errorMesssage: "Failed to get bancor pool tokens, error flip" }, { status: 500 });
    }
}
