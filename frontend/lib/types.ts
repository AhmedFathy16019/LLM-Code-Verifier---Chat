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

export type MessageSseData = {
    message_type: MessageType;
    data: unknown;
}