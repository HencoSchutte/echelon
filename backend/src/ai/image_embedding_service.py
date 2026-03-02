from fastapi import FastAPI, File, UploadFile
from PIL import Image
import torch
from transformers import CLIPProcessor, CLIPModel
import io

app = FastAPI()

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

@app.post("/embed")
async def embed_image(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    inputs = processor(images=image, return_tensors="pt")
    outputs = model.get_image_features(**inputs)

    embedding = outputs[0].detach().numpy().tolist()

    return {"embedding": embedding}
