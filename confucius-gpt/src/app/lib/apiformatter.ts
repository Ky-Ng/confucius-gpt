/**
 * Formats prompt to be sent to /api/answer-prompt
 * @param prompt 
 * @returns 
 */
export function formatAnswerPromptURL(prompt: UserPrompt): string {
    const baseURL = `api/answer-prompt`;
    const searchParams = new URLSearchParams();
    searchParams.append("scenario", prompt.scenario);
    searchParams.append("option1", prompt.option1);
    searchParams.append("option2", prompt.option2);
    const fullURL = baseURL + "?" + searchParams.toString();
    return fullURL;
}

export function formatTranslateURL(to_translate: string): string {
    const baseURL = `api/translate`;
    const searchParams = new URLSearchParams();
    searchParams.append("text", to_translate);
    const fullURL = baseURL + "?" + searchParams.toString();
    return fullURL;
}

export function formatURLExtractConfucianValues(prompt: UserPrompt): string {
    const baseURL = `api/extract-confucian-values`;
    const searchParams = new URLSearchParams();
    searchParams.append("scenario", prompt.scenario);
    searchParams.append("option1", prompt.option1);
    searchParams.append("option2", prompt.option2);
    const fullURL = baseURL + "?" + searchParams.toString();
    return fullURL;
}

export function formatURLQueryAnalects(prompt: UserPrompt, confucianValues: ConfucianValues): string {
    const baseURL = `api/query-analects`;
    const searchParams = new URLSearchParams();

    searchParams.append("scenario", prompt.scenario);
    searchParams.append("option1", prompt.option1);
    searchParams.append("option2", prompt.option2);

    searchParams.append("ren", confucianValues.ren);
    searchParams.append("li", confucianValues.li);
    searchParams.append("xiao", confucianValues.xiao);
    searchParams.append("all", confucianValues.all);

    const fullURL = baseURL + "?" + searchParams.toString();
    return fullURL;
}