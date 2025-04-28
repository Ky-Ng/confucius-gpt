"use client";
import React, { useState } from 'react';

interface UserPromptProps {
    submitPrompt: (prompt: UserPrompt) => Promise<void>;
}

export default function UserPrompt({ submitPrompt }: UserPromptProps) {
    const [scenario, setScenario] = useState<string>("I have 2 job opportunities with equal pay, status, and enjoyment. However, there is an opportunity to be located at either a new exciting place for young people (Seattle) or work from my hometown where my family is. Which one should I choose?");
    const [option1, setOption1] = useState<string>("Hometown with Family");
    const [option2, setOption2] = useState<string>("Exciting new place for young people");

    function handleSubmit() {
        const user_prompt: UserPrompt = {
            scenario: scenario, option1: option1, option2: option2
        };
        submitPrompt(user_prompt);
    }
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold mb-2">Problem Scenario</h2>
                <textarea
                    id="scenario"
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                    className="w-full h-32 p-4 border-2 border-[#9A1B1B] rounded-md text-[#3E1A1A] bg-[#FFF1E6] focus:outline-none focus:border-[#9A1B1B]"
                    placeholder="Describe your problem scenario"
                />
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-2">Option 1</h2>
                <textarea
                    id="option1"
                    value={option1}
                    onChange={(e) => setOption1(e.target.value)}
                    className="w-full h-32 p-4 border-2 border-[#9A1B1B] rounded-md text-[#3E1A1A] bg-[#FFF1E6] focus:outline-none focus:border-[#9A1B1B]"
                    placeholder="Input the first option"
                />
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-2">Option 2</h2>
                <textarea
                    id="option2"
                    value={option2}
                    onChange={(e) => setOption2(e.target.value)}
                    className="w-full h-32 p-4 border-2 border-[#9A1B1B] rounded-md text-[#3E1A1A] bg-[#FFF1E6] focus:outline-none focus:border-[#9A1B1B]"
                    placeholder="Input the second option"
                />
            </div>
            <button
                onClick={() => handleSubmit()}
                disabled={scenario.length === 0 || option1.length === 0 || option2.length === 0}
                className={
                    `w-full py-3 px-4 border-2 rounded-md font-semibold text-lg focus:outline-none focus:ring-2 transition-all 
                    ${scenario.length === 0 || option1.length === 0 || option2.length === 0
                        ? 'border-[#D1D5DB] text-[#6B7280] bg-[#F3F4F6] opacity-70 cursor-not-allowed'
                        : 'border-[#9A1B1B] text-[#9A1B1B] bg-[#FFF1E6] hover:bg-[#FFE6CC] focus:border-[#7A1616] focus:ring-[#9A1B1B] cursor-pointer'
                    }
                `}
            >
                Submit
            </button>
        </div>
    );
}
