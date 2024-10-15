from openai import AzureOpenAI
from typing import Dict, Optional
from dotenv import load_dotenv
import os, json, re

from .execution_service import extract_entry_point, execute_codes

load_dotenv()
RETRIALS = int(os.getenv("RETRIALS") or '5')

def parse_code(code: str) -> str:
    replacements = ["python\n", "Python\n"]
    code = code.replace("markdown\n", "")

    for replacement in replacements:
        code = code.replace(replacement, "", 1)
    
    code = code.replace('`', "").strip()
    return code


def process_test_case(text):
    # Match quotes outside of parentheses and replace them
    result = re.sub(r'\"(?![^()]*\))', '', text)
    result = re.sub(r"\'(?![^()]*\))", '', result)
    result = result.strip()
    if result[-1] == ",":
        result = result[:-1]
    return result

async def generate_code_api(
    prompt: str,
    api_key: str,
    client: AzureOpenAI,
    model: str="gpt4-api",
    n: int=1,
    temperature: float=0.7,
) -> Optional[Dict]:
    if not api_key:
        raise Exception("API key not provided")
    if not prompt:
        raise Exception("Prompt not provided")
    
    prompt = "Write a Python function in markdown that does the following:\n" + prompt + \
        ". \nReturn the code of the function only without any other text." + \
        "\nAlso, include all the needed imports."

    client.api_key = api_key

    for _ in range(RETRIALS):
        response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a programming assistant, skilled in writing complex programming concepts with creative syntax."
                },
                {"role": "user", "content": prompt}
            ],
            temperature=temperature,
            n=n
        )
        response_dict = json.loads(response.to_json())
        return response_dict
    return None

async def generate_test_cases_api(
    prompt: str,
    entry_point: Optional[str],
    api_key: str,
    client: AzureOpenAI,
    model: str="gpt4-api",
    n_tests: int=10,
) -> Optional[Dict]:
    client.api_key = api_key
    if not entry_point:
        entry_point = "test_case_runner"

    for _ in range(RETRIALS):
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a helpful Python programming assistant. Your objective is to create test inputs for the given problem."},
                {"role": "user", "content": f"""For the given problem statement, create test inputs. The format of the input is a list of inputs.
                                            The problem statement is: {prompt}.
                                            The entry point is: {entry_point},
                                            The input list is {n_tests} inputs representing {n_tests} test cases. Cover basic test cases and edge cases.
                                            Return only the function calls with each of the test cases, each in a separate line, without any other text."""},
            ]
        )
        response_dict = json.loads(response.to_json())
        response_content = response_dict["choices"][0]["message"]["content"]
        
        test_cases = parse_code(response_content)
        test_cases = response_content.split("\n")
        test_cases = [process_test_case(test_case) for test_case in test_cases]
        return test_cases
    
    return None



async def generate_message_data(prompt: str, entry_point: Optional[str], api_key: str, n_samples: int=5):
    client = AzureOpenAI(
        azure_endpoint=os.getenv("AZURE_ENDPOINT"),
        api_version = "2023-05-15",
        api_key=api_key
    )

    base_response = await generate_code_api(prompt=prompt, api_key=api_key, client=client)
    if not base_response:
        raise Exception("Failed to generate base response")
    base_code = parse_code(base_response["choices"][0]["message"]["content"])
    base_entry_point = extract_entry_point(base_code)
    yield f"Base code: \n{base_code}\n\n"

    sample_responses = await generate_code_api(prompt=prompt, api_key=api_key, n=n_samples, client=client)
    if not sample_responses:
        raise Exception("Failed to generate sample responses")
    sample_codes = []
    for i, sample_response in enumerate(sample_responses["choices"]):
        sample_code = parse_code(sample_response["message"]["content"])
        sample_codes.append(sample_code)
    sample_entry_points = [extract_entry_point(sample_code) for sample_code in sample_codes]
    sample_codes_text = "\n".join(sample_codes)
    yield f"Sample codes:\n{sample_codes_text}\n\n"

    test_cases = await generate_test_cases_api(prompt=prompt, entry_point=entry_point, api_key=api_key, client=client)
    if not test_cases:
        raise Exception("Failed to generate test cases")
    test_cases_text = "\n".join(test_cases)
    yield f"Test cases:\n{test_cases_text}\n\n"

    results = await execute_codes(base_code, base_entry_point, sample_codes, sample_entry_points, test_cases)
    results = json.dumps(results, indent=4)
    yield f"Results:\n{results}\n\n"