import React from 'react';

// Generated Using ChatGPT
export default function ToggleItem({ chinese, english }: { chinese: string, english: string; }) {
    const [open, setOpen] = React.useState(false);

    return (
        <div className="border-b">
            <button
                onClick={() => setOpen(!open)}
                className="w-full text-left p-2 font-semibold hover:bg-[#FFE5D0]"
            >
                {chinese}
            </button>
            {open && (
                <div className="p-2 text-sm bg-[#FFF7F2]">
                    {english}
                </div>
            )}
        </div>
    );
}