from fastapi import FastAPI, File, UploadFile
import torch
import clip
from PIL import Image

app = FastAPI()

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

@app.get("/")
def root():
    return {"message": "Embedding service running"}

@app.post("/embed")
async def embed_image(file: UploadFile = File(...)):
    image = Image.open(file.file).convert("RGB")
    image_input = preprocess(image).unsqueeze(0).to(device)

    with torch.no_grad():
        embedding = model.encode_image(image_input)
        embedding = embedding / embedding.norm(dim=-1, keepdim=True)

    return {"embedding": embedding.cpu().numpy().tolist()[0]}