import { NextRequest } from "next/server";
import { formatPromptRespondWithAnalects, query_answer_with_analects } from "../../lib/llm-handler";

export async function GET(request: NextRequest): Promise<Response> {
    const { searchParams } = new URL(request.url);

    const scenario = searchParams.get("scenario");
    const option1 = searchParams.get("option1");
    const option2 = searchParams.get("option2");

    const ren = searchParams.get("ren");
    const li = searchParams.get("li");
    const xiao = searchParams.get("xiao");
    const all = searchParams.get("all");

    // Format Prompt
    const userPrompt: UserPrompt = {
        scenario: scenario ?? "No Scenario Given",
        option1: option1 ?? "No Option Given",
        option2: option2 ?? "No Option Given"
    };
    const confucianValues: ConfucianValues = {
        ren: ren ?? "No ren Relationship Given",
        li: li ?? "No li Relationship Given",
        xiao: xiao ?? "No xiao Relationship Given",
        all: all ?? "No all Relationship Given",
    };

    const formattedPrompt = formatPromptRespondWithAnalects(userPrompt, confucianValues);
    console.log("FORMATTED PROMPT", formattedPrompt);
    // Query LLM
    const llm_response = await query_answer_with_analects(formattedPrompt);

    return Response.json(llm_response);
}