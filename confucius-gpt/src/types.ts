type UserPrompt = {
    scenario: string;
    option1: string;
    option2: string;
};

type ConfucianValues = {
    ren: string;
    li: string;
    xiao: string;
    all: string;
};

type OutputCitation = {
    start: number;
    end: number;
    citation_number: number;
    orig_text: string[];
};

type AnswerWithAnalectsCitation = {
    answer: string;
    citations: OutputCitation[] | null;
};