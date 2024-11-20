import json
from deepdiff import DeepDiff
from typing import List, Dict, Any
import logging

# Configure logging
logger = logging.getLogger('evaluation_logger')
logger.setLevel(logging.ERROR)
handler = logging.FileHandler('evaluation_errors.log')
handler.setLevel(logging.ERROR)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

def compare_outputs(
    base_code_outputs: List[Any],
    sample_code_outputs: Dict[str, List[Any]]
) -> Dict[str, List[str]]:
    def compare_output(base_code_output, sample_code_output):
        comparison_result = {}

        base_exception = isinstance(base_code_output, dict) and base_code_output.get('exception')
        sample_exception = isinstance(sample_code_output, dict) and sample_code_output.get('exception')

        if base_exception or sample_exception:
            comparison_result['state'] = "exception"
            comparison_result['diff'] = "Exception occurred during execution."
            comparison_result['score'] = -1
        else:
            base_code_dict = {
                "type": "output",
                "value": base_code_output
            }
            sample_code_dict = {
                "type": "output",
                "value": sample_code_output
            }
            
            try:
                diff = DeepDiff(base_code_dict, sample_code_dict, significant_digits=3, ignore_numeric_type_changes=True)
                if diff:
                    comparison_result['state'] = "different"
                    comparison_result['diff'] = diff
                    comparison_result['score'] = 1 - diff['distance']
                else:
                    comparison_result['state'] = "identical"
                    comparison_result['diff'] = None
                    comparison_result['score'] = 1
                return comparison_result
            except Exception as e:
                logger.error(f"Error comparing outputs: {e}\nbase_output:{base_code_output}\nsample_output:{sample_code_output}")
                comparison_result['state'] = "different"
                comparison_result['diff'] = f"Error comparing outputs: {e}\nbase_output:{base_code_output}\nsample_output:{sample_code_output}"
                comparison_result['score'] = -1
    
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