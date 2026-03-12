feedback_store = []

def save_feedback(data):

    feedback_store.append(data)

    return {
        "message": "Feedback received"
    }