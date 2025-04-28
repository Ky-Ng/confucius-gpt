import { NextRequest } from "next/server";
import { query_llm } from "../../lib/llm-handler";

export async function GET(request: NextRequest): Promise<Response> {
    const { searchParams } = new URL(request.url);
    const to_translate = searchParams.get("text");

    if (!to_translate) {
        return Response.json({ error: "Error No Message to Translate" });
    }

    const llm_response = await query_llm(
        `You are a translator from English to Mandarin Chinese. Translate the "English Text below to Mandarin Chinese. Respond only with Chinese Response.
        English Text: 
        ############
        ${to_translate}
        ############
        `);

    console.log(`Translate request: ${to_translate}`);
    console.log(`Translation to Chinese is: ${llm_response}`);
    return Response.json(llm_response);
}