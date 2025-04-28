// eslint-disable-next-line @typescript-eslint/no-unused-vars
type UserPrompt = {
    scenario: string;
    option1: string;
    option2: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type AnswerWithAnalectsCitation = {
    answer: string;
    citations: OutputCitation[] | null;
};