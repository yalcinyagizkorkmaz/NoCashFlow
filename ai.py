from openai import AzureOpenAI
import os
os.environ["TOKENIZERS_PARALLELISM"] = "false"
import requests
import json
from requests.auth import HTTPBasicAuth
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

#Get the API KEY

os.environ["AZURE_OPENAI_KEY"] = "ec442c4a9f864b508f97504f7d7e687b"
os.environ["AZURE_OPENAI_ENDPOINT"] = "https://rgacademy3oai.openai.azure.com/"

api_key = os.getenv("AZURE_OPENAI_KEY")

client = AzureOpenAI (
    azure_endpoint = "https://rgacademy3oai.openai.azure.com/",
    api_key = os.getenv("AZURE_OPENAI_KEY"),
    api_version = "2024-02-15-preview",
    timeout=30,

)

def read_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

def semantic_search(query, messages, model, top_k=20):
    content_list = [msg['content'] for msg in messages]
    query_embedding = model.encode([query])
    content_embeddings = model.encode(content_list)
    
    similarities = cosine_similarity(query_embedding, content_embeddings)[0]
    top_indices = np.argsort(similarities)[-top_k:][::-1]
    
    return [messages[i] for i in top_indices]

# Load messages from JSON file
file_path = 'few_shots.json'
all_messages = read_json_file(file_path)

# Initialize the sentence transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

prompt= "Sen, banka müşterilerinin şikayetlerini belirli kategorilere göre sınıflandıran bir yapay zeka asistanısın. Müşterilerden gelen yorumları, aşağıda belirtilen kategorilere göre sınıflandıracaksın. Eğer sınıflandırma dışında bir taleple karşılaşırsan, 'Üzgünüm, sadece sınıflandırma işlemlerini uyguluyorum.' şeklinde yanıt vereceksin. Sınıflandırma Kategorileri: MobilDeniz, ATM, İnternet Bankacılığı, Bireysel Kredi Kartları, Debit Kartlar, Yatırım İşlemleri, Para Transferi, Vadeli Mevduat, Hesap Kart Bloke Kaldırma, EFL/HAVAL Teyit, Dolandırcılık/Bilgi Dışı Şüpheli Hesap Kart İşlemleri, Bilgi/Belge Sahteciliği/Kayıp, Konut Sigortası, Bireysel Hayat Sigortası, Ferdi Kaza Sigortası, İletişim Merkezi. Vereceğin cevap formatı sadece İlgili kategoriyi belirtmelisin başka hiçbir şey yazmamalısın."

# Get user input
question = input(str("Merhabalar, size nasıl yardımcı olabilirim?\n"))

while True:
    # Perform semantic search
    relevant_messages = semantic_search(question, all_messages, model)
    
    # Construct the message list for the API call
    message_text = [{"role": "assistant", "content":prompt}]+ relevant_messages + [{"role": "user", "content": question}]
    
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=message_text,
        max_tokens=4096,
        temperature=0.7,
        top_p=0.95,
        stop=None
    )
    
    assistant_response = completion.choices[0].message.content
    print(assistant_response)
    
    question = input(str("\n"))