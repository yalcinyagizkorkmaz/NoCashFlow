const axios = require('axios');
const fs = require('fs');
const { SentenceTransformer } = require('sentence-transformers');
const { cosineSimilarity } = require('ml-distance');
const dotenv = require('dotenv');

dotenv.config();
process.env.TOKENIZERS_PARALLELISM = "false";

// Set environment variables
process.env.AZURE_OPENAI_KEY = "ec442c4a9f864b508f97504f7d7e687b";
process.env.AZURE_OPENAI_ENDPOINT = "https://rgacademy3oai.openai.azure.com/";

// Initialize OpenAI client
const apiKey = process.env.AZURE_OPENAI_KEY;
const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiVersion = "2024-02-15-preview";

const client = axios.create({
  baseURL: `${azureEndpoint}`,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  },
  timeout: 30000
});

const readJsonFile = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const semanticSearch = async (query, messages, model, top_k = 20) => {
  const contentList = messages.map(msg => msg.content);
  const queryEmbedding = await model.encode([query]);
  const contentEmbeddings = await model.encode(contentList);

  const similarities = contentEmbeddings.map(content => cosineSimilarity(queryEmbedding[0], content));
  const topIndices = similarities
    .map((sim, idx) => [sim, idx])
    .sort((a, b) => b[0] - a[0])
    .slice(0, top_k)
    .map(item => item[1]);

  return topIndices.map(index => messages[index]);
};

// Load messages from JSON file
const filePath = 'few_shots.json';
const allMessages = readJsonFile(filePath);

// Initialize the sentence transformer model
const model = new SentenceTransformer('all-MiniLM-L6-v2');

const prompt = "Sen, banka müşterilerinin şikayetlerini belirli kategorilere göre sınıflandıran bir yapay zeka asistanısın. Müşterilerden gelen yorumları, aşağıda belirtilen kategorilere göre sınıflandıracaksın. Eğer sınıflandırma dışında bir taleple karşılaşırsan, 'Üzgünüm, sadece sınıflandırma işlemlerini uyguluyorum.' şeklinde yanıt vereceksin. Sınıflandırma Kategorileri: MobilDeniz, ATM, İnternet Bankacılığı, Bireysel Kredi Kartları, Debit Kartlar, Yatırım İşlemleri, Para Transferi, Vadeli Mevduat, Hesap Kart Bloke Kaldırma, EFL/HAVAL Teyit, Dolandırcılık/Bilgi Dışı Şüpheli Hesap Kart İşlemleri, Bilgi/Belge Sahteciliği/Kayıp, Konut Sigortası, Bireysel Hayat Sigortası, Ferdi Kaza Sigortası, İletişim Merkezi. Vereceğin cevap formatı sadece İlgili kategoriyi belirtmelisin başka hiçbir şey yazmamalısın.";

// Get user input
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => {
  return new Promise(resolve => readline.question(query, resolve));
};

const run = async () => {
  let question = await askQuestion("Merhabalar, size nasıl yardımcı olabilirim?\n");

  while (true) {
    const relevantMessages = await semanticSearch(question, allMessages, model);

    const messageText = [{"role": "assistant", "content": prompt}, ...relevantMessages, {"role": "user", "content": question}];

    try {
      const response = await client.post('/openai/deployments/gpt-4o/chat/completions', {
        model: "gpt-4o",
        messages: messageText,
        max_tokens: 4096,
        temperature: 0.7,
        top_p: 0.95,
        stop: null
      });

      const assistantResponse = response.data.choices[0].message.content;
      console.log(assistantResponse);

      question = await askQuestion("\n");
    } catch (error) {
      console.error("Error:", error);
      break;
    }
  }

  readline.close();
};

run();
