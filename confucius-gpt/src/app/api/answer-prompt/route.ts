import { NextRequest } from "next/server";
import { formatPromptHighLevel, query_llm } from "../../lib/llm-handler";

export async function GET(request: NextRequest): Promise<Response> {
    const { searchParams } = new URL(request.url);
    const scenario = searchParams.get("scenario");
    const option1 = searchParams.get("option1");
    const option2 = searchParams.get("option2");
    const userPrompt: UserPrompt = { scenario: scenario ?? "No Scenario Given", option1: option1 ?? "No Option Given", option2: option2 ?? "No Option Given" };
    const formattedPrompt = formatPromptHighLevel(userPrompt);

    const llm_response = await query_llm(formattedPrompt);

    console.log(`Choice: ${llm_response}`);
    return Response.json(llm_response);
}