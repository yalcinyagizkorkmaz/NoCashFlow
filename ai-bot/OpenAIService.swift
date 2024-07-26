//
//  OpenAIService.swift
//  AI BOT
//
//  Created by Ali Kaan Karagözgil on 5.07.2024.
//

import Foundation

class OpenAIService {
    private var apiKey: String

    init(apiKey: String) {
        self.apiKey = apiKey
    }

    func generateChatResponse(prompt: String, completion: @escaping (String?) -> Void) {
        // Updated URL to point to the specific FastAPI endpoint
        let url = URL(string: "http://127.0.0.1:8002/classify-query/")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")

        // Ensure the JSON body matches the server's expected format.
        // Here's an example; adjust 'messages' and other fields as required by your server.
        let body: [String: Any] = [
            "prompt": prompt,
            "model": "gpt-4o",
            "temperature": 0.7,
            "max_tokens": 4096,
            "top_p": 0.95
        ]
        
        request.httpBody = try? JSONSerialization.data(withJSONObject: body, options: [])

        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data, error == nil else {
                print("Error: \(error?.localizedDescription ?? "Unknown error")")
                completion(nil)
                return
            }
            
            do {
                if let jsonObject = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
                   let result = jsonObject["result"] as? String { // Adjust the key 'result' as per your JSON response structure
                    completion(result)
                } else {
                    completion("Unable to parse response or no result found")
                }
            } catch {
                print("Failed to decode JSON: \(error)")
                completion(nil)
            }
        }
        task.resume()
    }
}
