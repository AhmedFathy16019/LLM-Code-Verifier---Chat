import difflib
import json
from deepdiff import DeepDiff
import numpy as np
from typing import List, Dict, Any

def compare_outputs(
    base_code_outputs: List[Any],
    sample_code_outputs: Dict[str, List[Any]]
) -> Dict[str, List[str]]:
    def compare_output(base_code_output, sample_code_output):
        comparison_result = {}
        
        # Float Values comparison
        try:
            num1 = float(base_code_output)
            num2 = float(sample_code_output)
            if np.isclose(num1, num2):
                comparison_result['state'] = "identical"
                comparison_result['diff'] = None
                comparison_result['score'] = 1
            else:
                comparison_result['state'] = "different"
                comparison_result['diff'] = f"Numerical differences: {num1} != {num2}"
                if num1 == 0:
                    comparison_result['score'] = 1 - abs(num1 - num2)
                else:
                    comparison_result['score'] = 1 - abs(num1 - num2) / abs(num1)
            return comparison_result
        except (ValueError, TypeError):
            pass

        # Numerical Lists comparison
        try:
            array1 = np.array(eval(base_code_output))
            array2 = np.array(eval(sample_code_output))
            if np.allclose(array1, array2):
                comparison_result['state'] = "identical"
                comparison_result['diff'] = None
                comparison_result['score'] = 1
            else:
                comparison_result['state'] = "different"
                comparison_result['diff'] = f"Numerical differences: {array1 - array2}"
                comparison_result['score'] = 1 - np.linalg.norm(array1 - array2) / np.linalg.norm(array1)
            return comparison_result
        except (SyntaxError, ValueError, TypeError):
            pass

        # JSON comparison
        try:
            json1 = json.loads(base_code_output)
            json2 = json.loads(sample_code_output)
            diff = DeepDiff(json1, json2, ignore_order=True)
            if diff:
                comparison_result['state'] = "different"
                comparison_result['diff'] = diff
                comparison_result['score'] = 1 - diff['values_changed'] / len(json1)
            else:
                comparison_result['state'] = "identical"
                comparison_result['diff'] = None
                comparison_result['score'] = 1
            return comparison_result
        except (json.JSONDecodeError, TypeError):
            pass

        try:
            # Fallback to string comparison
            diff = difflib.unified_diff(base_code_output.splitlines(), sample_code_output.splitlines())
            diff_text = '\n'.join(diff)
            if diff_text:
                comparison_result['state'] = "different"
                comparison_result['diff'] = diff_text
                comparison_result['score'] = 1 - len(diff_text) / len(base_code_output)
            else:
                comparison_result['state'] = "identical"
                comparison_result['diff'] = None
                comparison_result['score'] = 1
                return comparison_result
        except Exception as e:
            comparison_result['state'] = "different"
            comparison_result['diff'] = f"Error comparing outputs: {e}\nbase_output:{base_code_output}\nsample_output:{sample_code_output}"
            comparison_result['score'] = -1 # Penalizing different types or errors
            return comparison_result
    
    # Comparing all execution results
    comparison_results = {}
    for sample_code, sample_code_output in sample_code_outputs.items():
        comparison_results[sample_code] = []
        for base_code_output, sample_code_output in zip(base_code_outputs, sample_code_output):
            comparison_result = compare_output(base_code_output, sample_code_output)
            comparison_results[sample_code].append(comparison_result)

    return comparison_results


def compute_output_similarity_score(comparison_results: Dict[str, List[Dict[str, Any]]]):
    all_codes_score = 0
    for _, sample_results in comparison_results.items():
        sample_code_score = 0
        for comparison in sample_results:
            sample_code_score += comparison['score']
        sample_code_score /= len(sample_results)
        all_codes_score += sample_code_score

    all_codes_score /= len(comparison_results.items())
    return all_codes_score
