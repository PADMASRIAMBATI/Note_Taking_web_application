from fastapi import FastAPI
from routes.note import note_router  # Import the note router

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.include_router(note_router)  # Include the note router

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL for better security, e.g., ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)
@app.get("/")
async def read_root():
    return {"Hello": "Welcome to Note Taking App"}
