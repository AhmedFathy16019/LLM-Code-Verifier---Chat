import asyncio
from openai import AzureOpenAI, OpenAI
from typing import Dict, Optional
from dotenv import load_dotenv
import os, json, re, logging

from .execution_service import extract_entry_points, execute_codes
from .evaluation_service import compare_outputs, compute_output_similarity_score

# Configure logging for generation service
generation_logger = logging.getLogger('generation_logger')
generation_logger.setLevel(logging.INFO)

# File handler for error logs
generation_handler = logging.FileHandler('message_generation_errors.log')
generation_handler.setLevel(logging.ERROR)
generation_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
generation_handler.setFormatter(generation_formatter)

# Console handler for info and above logs
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
console_handler.setFormatter(console_formatter)

# Add handlers to the logger
generation_logger.addHandler(generation_handler)
generation_logger.addHandler(console_handler)


load_dotenv()
RETRIALS = int(os.getenv("RETRIALS") or '5')

def parse_code(code: str) -> str:
    if code.startswith("```"):
        code = code.strip("```")
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
    client: OpenAI,
    model: str="gpt-4-turbo-2024-04-09",
    n: int=1,
    temperature: float=0.7,
) -> Optional[Dict]:
    if not prompt:
        raise Exception("Prompt not provided")

    prompt = "Write a Python function in markdown that does the following:\n" + prompt + \
        ". \nReturn the code of the function only without any other text." + \
        "\nAlso, include all the needed imports."

    for _ in range(RETRIALS):
        response = await asyncio.to_thread(
            client.chat.completions.create,
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You are a programming assistant, skilled in writing complex programming concepts with creative syntax.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=temperature,
            n=n,
        )
        response_dict = json.loads(response.to_json())
        return response_dict
    return None

async def generate_test_cases_api(
    prompt: str,
    entry_point: Optional[str],
    client: OpenAI,
    model: str="gpt-4-turbo-2024-04-09",
    n_tests: int=10,
) -> Optional[Dict]:
    if not entry_point:
        entry_point = "test_case_runner"

    prompt = f"""For the given problem statement, create test inputs. The format of the input is a list of inputs.
    The problem statement is: {prompt}.
    The entry point is: {entry_point},
    The input list is {n_tests} inputs representing {n_tests} test cases. Cover basic test cases and edge cases.
    Return only the function calls with each of the test cases, each in a separate line, without any other text."""

    for _ in range(RETRIALS):
        response = await asyncio.to_thread(
            client.chat.completions.create,
            model=model,
            messages=[
                {
                    "role": "system", 
                    "content": "You are a helpful Python programming assistant. Your objective is to create test inputs for the given problem."
                },
                {"role": "user", "content": prompt},
            ]
        )
        response_dict = json.loads(response.to_json())
        response_content = response_dict["choices"][0]["message"]["content"]
        
        test_cases = parse_code(response_content)
        test_cases = response_content.split("\n")
        test_cases = [process_test_case(test_case) for test_case in test_cases if test_case not in ["[", "]"]]
        return test_cases
    
    return None



async def generate_message_data(
    prompt: str,
    entry_point: Optional[str],
    api_key: str,
):
    if not api_key:
        raise Exception("API key not provided")
    client = OpenAI(api_key=api_key)

    try:
        base_response = await generate_code_api(prompt=prompt, client=client)
        if not base_response:
            raise Exception("Failed to generate base response")
        base_code = parse_code(base_response["choices"][0]["message"]["content"])
        base_code_response = {
            "message_type": "base_code",
            "data": base_code
        }
        base_code_text = json.dumps(base_code_response, indent=4)
        yield f"{base_code_text}\n\n"        
 
        sample_responses = await generate_code_api(prompt=prompt, n=5,client=client)
        if not sample_responses:
            raise Exception("Failed to generate sample responses")
        sample_codes = []
        for _, sample_response in enumerate(sample_responses["choices"]):
            sample_code = parse_code(sample_response["message"]["content"])
            sample_codes.append(sample_code)
        sample_codes_response = {
            "message_type": "sample_codes",
            "data": sample_codes
        }
        sample_codes_text = json.dumps(sample_codes_response, indent=4)
        yield f"{sample_codes_text}\n\n"
 

        test_cases = await generate_test_cases_api(prompt=prompt, entry_point=entry_point, client=client)
        if not test_cases:
            raise Exception("Failed to generate test cases")
        test_cases_response = {
            "message_type": "test_cases",
            "data": test_cases
        }
        test_cases_text = json.dumps(test_cases_response, indent=4)
        yield f"{test_cases_text}\n\n"

        all_codes = [base_code] + sample_codes
        entry_points = extract_entry_points(all_codes)
        base_entry_point = entry_points[0]
        sample_entry_points = entry_points[1:]
        execution_results = await execute_codes(base_code, base_entry_point, sample_codes, sample_entry_points, test_cases)
        
        base_output = execution_results["base_code_results"]
        base_output_response = {
            "message_type": "base_output",
            "data": base_output
        }
        base_output_text = json.dumps(base_output_response, indent=4)
        yield f"{base_output_text}\n\n"

        sample_outputs = execution_results["sample_code_results"]
        sample_outputs_response = {
            "message_type": "sample_outputs",
            "data": sample_outputs
        }
        sample_outputs_text = json.dumps(sample_outputs_response, indent=4)
        yield f"{sample_outputs_text}\n\n"

        comparison_results = compare_outputs(execution_results["base_code_results"], execution_results["sample_code_results"])
        comparison_results_response = {
            "message_type": "comparison_results",
            "data": comparison_results
        }
        comparison_results_text = json.dumps(comparison_results_response, indent=4)
        yield f"{comparison_results_text}\n\n"

        score = compute_output_similarity_score(comparison_results)
        score_response = {
            "message_type": "score",
            "data": score
        }
        score_text = json.dumps(score_response, indent=4)
        yield f"{score_text}\n\n"

    except Exception as e:
        logging.error(f"Error computing similarity score: {e}")
        raise