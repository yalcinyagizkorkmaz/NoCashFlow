import requests

# Replace with your actual API endpoint and subscription key
endpoint = "https://rgacademy3oai.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview"
subscription_key = "ec442c4a9f864b508f97504f7d7e687b"

# Sample data to send in the request
data = {
    "messages": [
        { "role": "system", "content": "You are a helpful assistant." },
        { "role": "user", "content": "Hello world!" }
    ]
}

# Headers
headers = {
    "Authorization": f"Bearer {subscription_key}",
    "Content-Type": "application/json"
}

# Make the request
response = requests.post(endpoint, headers=headers, json=data)

# Check the response
if response.status_code == 200:
    print("Authorization successful. API key is valid.")
    print("Response:", response.json())
else:
    print(f"Authorization failed with status code {response.status_code}.")
    print("Response:", response.json())
