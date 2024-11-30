export type MessageRequestData = {
    prompt: string;
    entry_point: string;
    temperature: number;
    timeout: number;
    floatThreshold: number;
    ignoreListOrder: boolean;
    ignoreStringCase: boolean;
}

enum MessageType {
    BASE_CODE = "base_code",
    SAMPLE_CODES = "sample_codes",
    TEST_CASES = "test_cases",
    BASE_OUTPUT = "base_output",
    SAMPLE_OUTPUTS = "sample_outputs",
    COMPARISON_RESULTS = "comparison_results",
    SCORE = "score",
}

type BaseCodeData = string;
type SampleCodesData = string[];
type TestCasesData = string[];
type BaseOutputData = unknown[];
type SampleOutputsData = { [key: string]: unknown[] };
type ComparisonResultsData = {
    [key: string]: { 
        state: string;
        diff: string | null;
        score: number; 
    }[] 
};
type scoreData = number;

export type MessageSseData = {
    message_type: MessageType;
    data: BaseCodeData | SampleCodesData | TestCasesData | BaseOutputData | SampleOutputsData | ComparisonResultsData | scoreData;
}

export type ExceptionMessage = {
    exception: boolean;
    exception_type: string;
    exception_message: string;
}

export type RegisterRequestData = {
    username: string;
    password: string;
    apiKey: string;
}

export type LoginRequestData = {
    username: string;
    password: string;
}