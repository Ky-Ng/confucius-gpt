import { NextRequest } from "next/server";
import { formatPromptExtractConfucianValues, query_llm_confucian_values_json } from "../../lib/llm-handler";

export async function GET(request: NextRequest): Promise<Response> {
    const { searchParams } = new URL(request.url);
    const scenario = searchParams.get("scenario");
    const option1 = searchParams.get("option1");
    const option2 = searchParams.get("option2");

    // Format Prompt
    const userPrompt: UserPrompt = { scenario: scenario ?? "No Scenario Given", option1: option1 ?? "No Option Given", option2: option2 ?? "No Option Given" };
    const formattedPrompt = formatPromptExtractConfucianValues(userPrompt);

    // Query LLM
    const llm_response = await query_llm_confucian_values_json(formattedPrompt);

    console.log(`Extracted Confucian Values: ${llm_response}`);
    return Response.json(llm_response);
}