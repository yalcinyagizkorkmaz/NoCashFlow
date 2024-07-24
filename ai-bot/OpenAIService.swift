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
        let url = URL(string: "http://10.3.2.5:8000/chat-completion/")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")

        let body: [String: Any] = [
            "model": "gpt-4o",
            "messages": [
                ["role": "system", "content": "The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly."],
                ["role": "user", "content": prompt]
            ],
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
                   let choices = jsonObject["choices"] as? [[String: Any]],
                   let firstChoice = choices.first,
                   let message = firstChoice["message"] as? [String: Any],
                   let content = message["content"] as? String {
                    completion(content.trimmingCharacters(in: .whitespacesAndNewlines))
                } else {
                    completion(nil)
                }
            } catch {
                print("Failed to decode JSON: \(error)")
                completion(nil)
            }
        }
        task.resume()
    }
}
