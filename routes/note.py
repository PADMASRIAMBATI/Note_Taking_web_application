from fastapi import APIRouter, HTTPException
from models.note import NoteInDB as Note
from models.note import NoteBase, NoteCreate, NoteUpdate, NoteInDB
from config.db import conn, notes_collection
from schemas.note import noteEntity, notesEntity
from bson import ObjectId, errors
from datetime import datetime
from pymongo import ReturnDocument


# In backend/routes/note.py

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

note_router = APIRouter()

@note_router.get("/")
async def find_all_notes():
    return notesEntity(conn.local.note.find())

from bson import ObjectId, errors

@note_router.get("/{id}")
async def find_one_note(id: str):
    try:
        obj_id = ObjectId(id)  # Validate the id
    except errors.InvalidId:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    note = conn.local.note.find_one({"_id": obj_id})
    if note:
        return noteEntity(note)
    raise HTTPException(status_code=404, detail="Note not found")


@note_router.post("/")
async def create_note(note: NoteBase):
    logger.info(f"Received note: {note}")

    try:
        note_data = note.dict()
        note_data['created_at'] = datetime.utcnow()
        note_data['updated_at'] = datetime.utcnow()
        result = notes_collection.insert_one(note_data)
        created_note = notes_collection.find_one({"_id": result.inserted_id})
        if created_note:
            return noteEntity(created_note)
        raise HTTPException(status_code=500, detail="Failed to retrieve created note")
    except Exception as e:
        logger.error(f"Error inserting note: {e}")
        raise HTTPException(status_code=500, detail="Failed to create note")

@note_router.put("/{note_id}", response_model=NoteInDB)
async def update_note(note_id: str, note: NoteUpdate):
    try:
        # Convert note_id to ObjectId
        object_id = ObjectId(note_id)
    except Exception as e:
        logger.error(f"Invalid ObjectId: {note_id}. Error: {e}")
        raise HTTPException(status_code=400, detail="Invalid note ID")

    # Prepare update query
    update_query = {}
    if note.title is not None:
        update_query["title"] = note.title
    if note.content is not None:
        update_query["content"] = note.content

    if not update_query:
        raise HTTPException(status_code=400, detail="No fields to update")

    # Perform update
    result = notes_collection.update_one({"_id": object_id}, {"$set": update_query})

    if result.matched_count == 0:
        logger.info(f"Note with ID {note_id} not found")
        raise HTTPException(status_code=404, detail="Note not found")

    # Retrieve the updated note
    updated_note = notes_collection.find_one({"_id": object_id})

    if not updated_note:
        logger.error(f"Failed to retrieve updated note with ID {note_id}")
        raise HTTPException(status_code=500, detail="Failed to retrieve updated note")

    # Log the updated note data
    logger.info(f"Updated note: {updated_note}")

    # Create NoteInDB instance for response
    response_note = NoteInDB(
        id=str(updated_note["_id"]),
        title=updated_note.get("title", ""),
        content=updated_note.get("content", ""),
        created_at=updated_note.get("created_at", datetime.utcnow()),
        updated_at=updated_note.get("updated_at", datetime.utcnow())
    )

    return response_note


@note_router.delete("/{id}")
async def delete_note(id: str):
    deleted_note = conn.local.note.find_one_and_delete({"_id": ObjectId(id)})
    if deleted_note:
        return noteEntity(deleted_note)
    raise HTTPException(status_code=404, detail="Note not found")
