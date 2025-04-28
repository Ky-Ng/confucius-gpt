import { CohereClientV2 } from 'cohere-ai';
import getConfucianDocuments from './confucian-documents';

const cohere = new CohereClientV2({
    token: process.env.LLM_API_KEY,
});

/**
 * @returns structured output for confucian values
 * Written as a function for immutability
 */
export const extract_confucian_values_json_format = () => {
    return {
        "type": "json_object",
        "schema": {
            "type": "object",
            "properties": {
                "relation_to_ren": { "type": "string" },
                "relation_to_li": { "type": "string" },
                "relation_to_xiao": { "type": "string" },
                "relation_all": { "type": "string" },
            },
            "required": ["relation_to_ren", "relation_to_li", "relation_to_xiao", "relation_all"],
        }
    };
};

/**
 * Query to LLM with general prompts and no tools/documents
 * @param prompt 
 * @returns 
 */
export async function query_llm(prompt: string): Promise<string | null> {
    const llm_response_json = await cohere.chat({
        model: 'command-a-03-2025',
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
    });

    // Case 1) Check for failed LLM response
    if (!llm_response_json || !llm_response_json["message"] || !llm_response_json["message"]["content"]) {
        return null;
    }

    // Case 2) Return LLM Response
    const llm_response = llm_response_json["message"]["content"][0]["text"];
    return llm_response;
}

export async function query_answer_with_analects(prompt: string) {
    // Chat (POST /v2/chat)
    const response = await fetch("https://api.cohere.com/v2/chat", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.LLM_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "stream": false,
            "model": "command-a-03-2025",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "documents": getConfucianDocuments(),
            "citation_options": {
                "mode": "FAST"
            }
        }),
    });

    // Step 0) Parse Response
    const llm_response_json = await response.json();

    // Step 1) Get LLM Resposne
    // Case 1) Check for failed LLM response
    if (!llm_response_json || !llm_response_json["message"] || !llm_response_json["message"]["content"]) {
        return null;
    }

    // Case 2) Return LLM Response
    const llm_response = llm_response_json["message"]["content"][0]["text"];

    // Step 2) Get Citations
    let citations: OutputCitation[] | null = null;

    // Generated using ChatGPT
    if (llm_response_json["message"] && llm_response_json["message"]["citations"]) {
        // Use a reducer to deduplicate based on document id
        const seenDocumentIds = new Set<string>(); // Track seen document ids

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        citations = llm_response_json["message"]["citations"].reduce((acc: OutputCitation[], citation: Record<string, any>, idx: number) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const uniqueSources = citation["sources"].filter((source: Record<string, any>) => {
                // Check if the document id has been seen already
                const documentId = source["document"]["id"];
                if (seenDocumentIds.has(documentId)) {
                    return false; // Ignore if document id has been seen
                }
                seenDocumentIds.add(documentId); // Mark document id as seen
                return true; // Keep this source
            });

            if (uniqueSources.length > 0) {
                acc.push({
                    start: citation["start"],
                    end: citation["end"],
                    citation_number: idx,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    orig_text: uniqueSources.map((source: Record<string, any>) => source["document"]["content"])
                } as OutputCitation);
            }

            return acc; // Return the accumulator with unique citations
        }, []);
    }


    console.log("JSON Response", JSON.stringify(llm_response_json));


    return { answer: llm_response, citations: citations } as AnswerWithAnalectsCitation;
}

/**
 * Query LLM with structured JSON output
 * @param prompt 
 * @returns 
 */
export async function query_llm_confucian_values_json(prompt: string): Promise<string | null> {
    // Use HTTPS request instead of SDK since documentation for typescript is unclear on how to do
    // structured output in JSON
    const response = await fetch("https://api.cohere.com/v2/chat", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.LLM_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "stream": false,
            "model": "command-a-03-2025",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "response_format": extract_confucian_values_json_format()
        }),
    });

    const llm_response_json = await response.json();

    // Case 1) Check for failed LLM response
    if (!llm_response_json || !llm_response_json["message"] || !llm_response_json["message"]["content"]) {
        return null;
    }

    // Case 2) Return LLM Response
    const llm_response = llm_response_json["message"]["content"][0]["text"];
    return llm_response;
}

/**
 * Structure prompt for default answer
 * @param prompt 
 * @returns 
 */
export function formatPromptHighLevel(prompt: UserPrompt): string {
    return (
        `You are a Confucian advisor and can only choose one option based on the situation below:

Situation:
${prompt.scenario}

Option 1:
${prompt.option1}

Option 2:
${prompt.option2}
`
    );
}

/**
 * Prompt for extracting Confucian values
 * @param prompt 
 * @returns 
 */
export function formatPromptExtractConfucianValues(prompt: UserPrompt) {
    return (
        `You are a Confucian Scholar giving advice to a person on a situation with 2 options.

Below are the three Confucian Virtues:
##########
\`\`\`
仁 (Benevolence), 礼 (Ritual), and 孝 (Filial Piety)
\`\`\`
1. 仁 (Benevolence)
	1. General Principle
		1. The ultimate virtue is to treat others with respect, kindness, and empathy
		2. By being kind to others, each person can have a "trickle-down" morality--spreading the Benevolence recursively throughout society
	2. Example Social Scenarios
		1. If person A feels hurt, person B should continue to be kind to this person and understand how they are feeling a certain way
		2. If person A treats person B with Benevolence, then person B will treat others (say person C) with Benevolence
	3. When to Apply this Principle: Internal Perspective on Inter-Personal Situations
		1. Benevolence is involved with inter-personal relationships as the guiding internal principle of kindness towards others.
		2. Benevolence requires the daily hard work (Kung Fu/功夫) of finding common ground as a foundation for deep connection and empathy.
2. 礼 (Ritual)
	4. General Principle
		1. What external actions and behavior should each person do individually in order to maintain social harmony
		2. Builds upon \`仁 (Benevolence)\`; manifests the virtue of kindness and respect through actions
	5. Examples of Ritual
		1. Person A treating Person B with respect despite having different political views
		2. Making space for a friend or stranger at a table so they can sit comfortably
		3. Helping or offering to help a friend when seeing them carry many boxes
	6. When to Apply this Principle: When taking actions on Inter-Personal Situations
		4. The external side of 仁, taking actions that help to facilitate deeper connection, empathy, and understanding
3. 孝  (Filial Piety)
	1. General Principle
		1. Special honor and respect towards elders and ancestors
		2. Acknowledging the sacrifices and contributions of the previous generation through special treatment of respect
		3. Special case of 仁 and 礼; where 仁 understanding is of the previous generations work and 礼 is the manifestation of how to treat these elders
	2. Examples of Filial Piety
		4. Calling one's parents, grandparents, or older siblings as a sign of gratitude and remembrance of the giant shoulders you stand upon
		5. Moving back to one's hometown to take care of the older generation, especially in their old age
		6. Remembering to call family members during days of celebrations as acknowledgement
		7. Yielding your seat on a crowded bus to elderly strangers for them to sit
		8. Once of older age, you can 夹菜 or getting food for older members of the family during family dinner
		9. Greeting others by their respective titles instead of just a "hi"
		10. As a member of the younger generation: doing your best to help the older generation not worry as much
	3. When to Apply this Principle: Special Respect towards elders
		1. Individually
			1. Conducting oneself in a way that would make one's elders less likely to be worried
		2. Within one's own family
			2. Remembering to acknowledge the presence of others
			3. Spending time with the elder generations to care for them in their older age
		3. Externally
			1. Respecting elderly people who you may not know

In conclusion, in this balance of logic and feeling (道理和人情), Confucianisms's 仁 is the internal mindset of benevolence through deep understanding and empathy towards others as a daily practice or 功夫 (Kung Fu). 礼 is the physical manifestations and application of this mindset in how to treat others in social scenarios. Lastly, 孝 is a special case of 仁 and 礼 extended to the internal appreciation and external respect of elders.
##########

Given Scenario:
##########
Scenario:
${prompt.scenario}

Option 1:
${prompt.option1}

Option 2:
${prompt.option2}
##########

Generate JSON in format with the relation of the scenario and options to 仁("relation_to_ren"), 礼("relation_to_li"), 孝("relation_to_xiao") and how all three combine together in this situation("relation_all")
{
    relation_to_ren: string, 
    relation_to_li: string, 
    relation_to_xiao: string, 
    relation_all: string
}`
    );
}

/**
 * Prompt Structure:
 * 
 * You are a Confucian Scholar with document access to the Analects, a collection of Confucius's sayings by his disciples.
 * You will be given a situation with two possible options and are asked to advise which option to take and may only choose one option.
 * 
 * <Scenario Setup>
 * 
 * Here is how the scenario relates to the Confucian Values of 仁 (Benevolence), 礼 (Ritual), 孝(Filial Piety), and the three combined
 * <Setup of Relationship to each/combined>
 * 
 * Using the documents you have available and the relationships described above, choose exactly one option and explain why.
 * Response format:
 * 1. You should choose <INSERT OPTION>
 * 2. <EXPLAIN YOUR REASONING>
 */
export function formatPromptRespondWithAnalects(prompt: UserPrompt, confucianValues: ConfucianValues): string {
    return (
        `You are a Confucian Scholar with document access to the Analects, a collection of Confucius's sayings by his disciples.
You will be given a situation with two possible options and are asked to advise which option to take and may only choose one option.

Given Scenario:
##########
Scenario:
${prompt.scenario}

Option 1:
${prompt.option1}

Option 2:
${prompt.option2}
##########

Here is how the scenario relates to the Confucian Values of 仁 (Benevolence), 礼 (Ritual), 孝 (Filial Piety), and the three combined
##########
Relationship to 仁 (Benevolence):
${confucianValues.ren}

Relationship to 礼 (Ritual):
${confucianValues.li}

Relationship to 孝 (Filial Piety):
${confucianValues.xiao}

Relationship of 仁 (Benevolence), 礼 (Ritual), 孝 (Filial Piety) together with this situation
${confucianValues.all}
##########

Using the documents you have available and the relationships described above, choose exactly one option and explain why.
Note: the text will be rendered directly into <p></p> tags in HTML so do not use Markdown.
Response format:
1. You should choose <INSERT_OPTION1_OR_OPTION2>
2. <EXPLAIN_YOUR_REASONING>
`
    );
}