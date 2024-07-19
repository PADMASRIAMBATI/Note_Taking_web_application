def noteEntity(item) -> dict:
    return {
        "id": str(item["_id"]),
        "title": item["title"],
        "content": item["content"],
        "created_at": item["created_at"],
        "updated_at": item["updated_at"],
    }

def notesEntity(entity) -> list:
    return [noteEntity(item) for item in entity]
