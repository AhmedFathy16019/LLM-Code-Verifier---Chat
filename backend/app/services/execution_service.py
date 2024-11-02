import ast, astor
import asyncio
import logging
from concurrent.futures import ThreadPoolExecutor
from typing import List, Dict
 
# Configure logging for execution service
execution_logger = logging.getLogger('execution_logger')
execution_logger.setLevel(logging.ERROR)
execution_handler = logging.FileHandler('execution_errors.log')
execution_handler.setLevel(logging.ERROR)
execution_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
execution_handler.setFormatter(execution_formatter)
execution_logger.addHandler(execution_handler)

def extract_entry_point(code: str):
    tree = ast.parse(code)
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            return node.name
    return None

def extract_entry_points(codes: List[str]) -> List[str]:
    entry_points = []
    for code in codes:
        tree = ast.parse(code)
        entry_point = None
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                entry_point = node.name
                break
        entry_points.append(entry_point)
    return entry_points

def replace_entry_point(test_case: str, entry_point: str) -> str:
    tree = ast.parse(test_case)
    for node in ast.walk(tree):
        if isinstance(node, ast.Call):
            node.func.id = entry_point
    return astor.to_source(tree)

def execute_code(code: str, test_case: str) -> str:
    try:
        exec_globals = {}
        exec(code, exec_globals)
        exec(test_case, exec_globals)
        return exec_globals.get('result', 'No result')
    except SyntaxError as e:
        logging.error(f"Syntax error executing code: {e}")
        return str(e)
    except Exception as e:
        logging.error(f"Error executing code: {e}")
        return str(e)

async def execute_codes(
    base_code: str,
    base_entry_point: str,
    sample_code: List[str],
    sample_entry_points: List[str],
    test_cases: List[str]
) -> Dict[str, List[str]]:
    results = {
        "base_code_results": [],
        "sample_code_results": {}
    }

    def run_test(code: str, entry_point: str, test_case: str) -> str:
        modified_test = replace_entry_point(test_case, entry_point)
        modified_test = f"result = {modified_test}"
        return execute_code(code, modified_test)

    with ThreadPoolExecutor() as executor:
        loop = asyncio.get_event_loop()

        # Execute base code tests
        base_futures = [
            loop.run_in_executor(executor, run_test, base_code, base_entry_point, test_case)
            for test_case in test_cases
        ]
        results["base_code_results"] = await asyncio.gather(*base_futures)

        # Execute sample code tests
        for i, (code, entry_point) in enumerate(zip(sample_code, sample_entry_points)):
            sample_futures = [
                loop.run_in_executor(executor, run_test, code, entry_point, test_case)
                for test_case in test_cases
            ]
            results["sample_code_results"][f"sample_{i}"] = await asyncio.gather(*sample_futures)

    return results