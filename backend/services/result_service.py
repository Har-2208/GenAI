import uuid

saved_results = {}

def save_result(data):

    result_id = str(uuid.uuid4())

    saved_results[result_id] = data

    return {
        "id": result_id,
        "message": "Results saved successfully"
    }


def get_result(result_id):

    if result_id not in saved_results:
        return {"error": "Result not found"}

    return saved_results[result_id]