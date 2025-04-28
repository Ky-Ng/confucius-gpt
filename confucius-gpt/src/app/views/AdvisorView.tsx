"use client";
import React, { useState } from 'react';
import UserPrompt from '../components/UserPrompt';
import { formatAnswerPromptURL, formatTranslateURL, formatURLExtractConfucianValues, formatURLQueryAnalects } from '../lib/apiformatter';
import { callAPI } from '../lib/apihandler';
import { formatPromptHighLevel } from '../lib/llm-handler';
import ToggleItem from '../components/ToggleItem';
import Link from 'next/link';

export default function AdvisorView() {
    const [defaultResponse, setDefaultResponse] = useState<string>("");
    const [englishPrompt, setEnglishPrompt] = useState<string>("");
    const [chinesePrompt, setChinesePrompt] = useState<string>("");
    const [confucianValues, setConfucianValues] = useState<ConfucianValues | null>(null);
    const [finalResponse, setFinalResponse] = useState<AnswerWithAnalectsCitation | null>(null);

    /**
     * Sets the default answer from LLM without pipeline
     * Gets Chinese Translation of the prompt
     * @param prompt User Prompt
     */
    async function submitPrompt(prompt: UserPrompt) {
        // Step 1) Provide High Level prompt information to user
        const englishPrompt = formatPromptHighLevel(prompt);
        setEnglishPrompt(englishPrompt);

        // Prepare all API calls concurrently
        const translatePromptURL = formatTranslateURL(englishPrompt);
        const extractConfucianValuesURL = formatURLExtractConfucianValues(prompt);
        const defaultResponseURL = formatAnswerPromptURL(prompt);


        // Query LLMs concurrently
        const [translatedPrompt, confucianValuesJSONString, defaultOption] = await Promise.all([
            callAPI(translatePromptURL),
            callAPI(extractConfucianValuesURL),
            callAPI(defaultResponseURL)
        ]);

        // Step 1.5) Provide High Level Prompt in Chinese
        setChinesePrompt(translatedPrompt);

        // Step 2) Extract information on Confucian Values
        const confucianValuesJSON = JSON.parse(confucianValuesJSONString);
        const updatedConfucianValues = {
            ren: confucianValuesJSON["relation_to_ren"],
            li: confucianValuesJSON["relation_to_li"],
            xiao: confucianValuesJSON["relation_to_xiao"],
            all: confucianValuesJSON["relation_all"]
        } as ConfucianValues;
        setConfucianValues(updatedConfucianValues);

        // Step 3) Get Default LLM Response
        setDefaultResponse(defaultOption);
        console.log("Default Response", defaultResponse);

        // Step 4) Get Final Answer
        const queryAnalectsURL = formatURLQueryAnalects(prompt, updatedConfucianValues);
        const finalResponseUpdate = await callAPI(queryAnalectsURL);
        setFinalResponse(finalResponseUpdate);
    }


    return (
        <div>
            {/* Page Title */}
            <div className='p-4 border-2 rounded-lg shadow-md'>
                <div className="text-center">
                    <h1 className="text-4xl text-[#9A1B1B] font-bold">ConfuciusGPT</h1>
                    <p className="text-xl text-[#9A1B1B] font-bold mt-2">
                        Answering the Age Old Question: What would Confucius say?
                    </p>
                    <p className='font-semibold'>Guidance based on Confucian Values: 礼, 仁, 孝</p>
                    <Link href={'https://github.com/Ky-Ng/confucius-gpt'} target="_blank" rel="noopener noreferrer">
                        <button className="mt-4 px-6 py-2 bg-[#f5e1e1] text-[#9A1B1B] font-semibold rounded-lg shadow-lg hover:bg-[#e9c4c4] transition duration-300 border border-[#9A1B1B]">
                            Github: Learn More
                        </button>
                    </Link>
                </div>
            </div>
            <br />

            <div className='p-4 border-2 rounded-lg shadow-md'>
                <h1 className="text-4xl text-[#9A1B1B] font-bold">Step 1: User Prompt</h1>
                <br />
                <UserPrompt submitPrompt={submitPrompt}></UserPrompt>
            </div>

            <br />

            {/* English and Chinese Prompt */}
            {englishPrompt.length > 0 &&
                <div className='p-4 border-2 rounded-lg shadow-md'>
                    <h1 className="text-4xl text-[#9A1B1B] font-bold">
                        Step 2: Prepare LLM Prompts
                    </h1>
                    <div className="grid grid-cols-2 gap-4 my-8 whitespace-pre-wrap">
                        <div className="p-4  border-2 rounded-lg shadow-md border-[#9A1B1B] text-[#3E1A1A] bg-[#FFF1E6]">
                            <h2 className="text-2xl font-semibold mb-2">English Prompt</h2>
                            <p>{englishPrompt}</p>
                        </div>
                        <div className="p-4  border-2 rounded-lg shadow-md border-[#9A1B1B] text-[#3E1A1A] bg-[#FFF1E6]">
                            <h2 className="text-2xl font-semibold mb-2">Chinese Prompt</h2>
                            <p>{chinesePrompt}</p>
                        </div>
                    </div>
                </div>
            }
            <br />

            {/* Alignment with Confucian Values */}
            {confucianValues &&
                <div className='p-4 border-2 rounded-lg shadow-md'>
                    <h1 className="text-4xl text-[#9A1B1B] font-bold">
                        Step 3: Contextualize with Confucian Values
                    </h1>
                    <div className="grid grid-cols-2 gap-4 my-8 whitespace-pre-wrap">
                        <div className="p-4  border-2 rounded-lg shadow-md border-[#9A1B1B] text-[#3E1A1A] bg-[#FFF1E6]">
                            <h2 className="text-2xl font-semibold mb-2">Relationship to Benevolence (仁 rén)</h2>
                            <p>{confucianValues.ren}</p>
                        </div>
                        <div className="p-4  border-2 rounded-lg shadow-md border-[#9A1B1B] text-[#3E1A1A] bg-[#FFF1E6]">
                            <h2 className="text-2xl font-semibold mb-2">Relationship to Ritual (礼 lǐ)</h2>
                            <p>{confucianValues.li}</p>
                        </div>
                        <div className="p-4  border-2 rounded-lg shadow-md border-[#9A1B1B] text-[#3E1A1A] bg-[#FFF1E6]">
                            <h2 className="text-2xl font-semibold mb-2">Relationship to Filial Piety (孝 xìao)</h2>
                            <p>{confucianValues.xiao}</p>
                        </div>
                        <div className="p-4  border-2 rounded-lg shadow-md border-[#9A1B1B] text-[#3E1A1A] bg-[#FFF1E6]">
                            <h2 className="text-2xl font-semibold mb-2">Relationship to All Values (仁，礼，孝）</h2>
                            <p>{confucianValues.all}</p>
                        </div>
                    </div>
                </div>
            }

            <br />

            {finalResponse && (
                <div className="p-4 border-2 rounded-lg shadow-md">
                    <h1 className="text-4xl text-[#9A1B1B] font-bold">
                        Step 4: Confucian Recommendation with Citations from The Analects (论语)
                    </h1>
                    <div className="grid grid-cols-2 gap-4 my-8 whitespace-pre-wrap">
                        {/* LHS: Recommendation */}
                        {finalResponse.citations && <div className="p-4 border-2 rounded-lg shadow-md border-[#9A1B1B] text-[#3E1A1A] bg-[#FFF1E6]">
                            <h2 className="text-2xl font-semibold mb-2">Recommendation</h2>
                            <p>
                                {formatAnswerWithCitations(finalResponse.answer, finalResponse.citations)}
                            </p>
                        </div>}

                        {/* RHS: Citations */}
                        {finalResponse.citations && (
                            <div className="p-4 border-2 rounded-lg shadow-md border-[#9A1B1B] text-[#3E1A1A] bg-[#FFF1E6]">
                                <h2 className="text-2xl font-semibold mb-2">Citations:</h2>
                                <div className="space-y-2">
                                    {finalResponse.citations.map((citation, idx) => (
                                        <div key={idx} className="border rounded-lg overflow-hidden">
                                            {citation.orig_text.length > 1 && citation.orig_text.slice(0, 2).map((text, textIdx) => {
                                                const splitIndex = text.indexOf('(');
                                                const chinese = splitIndex !== -1 ? text.slice(0, splitIndex).trim() : text;
                                                const english = splitIndex !== -1 ? text.slice(splitIndex).trim() : "";

                                                return (
                                                    <ToggleItem key={textIdx} chinese={chinese} english={english} />
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Generated Using ChatGPT
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatAnswerWithCitations(answer: string, citations: any[]) {
    if (!citations || citations.length === 0) return answer;

    // Split answer into sentences (roughly)
    const sentences = answer.match(/[^.!?]+[.!?]?/g);
    if (!sentences) return answer;

    const formattedSentences = sentences.map((sentence, idx) => {
        const citationNumber = idx < citations.length ? idx + 1 : null;
        if (citationNumber) {
            return `${sentence.trim()} <b><sup>${citationNumber}</sup></b>`;
        }
        return sentence.trim();
    });

    const formatted = formattedSentences.join(' ');

    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
}
