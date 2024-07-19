from pymongo import MongoClient
conn = MongoClient("mongodb://localhost:27017")

db = conn.local  # Use 'conn' instead of 'client'
notes_collection = db.note