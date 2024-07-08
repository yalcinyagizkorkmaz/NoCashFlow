//
//  OpenAIService.swift
//  AI BOT
//
//  Created by Ali Kaan Karagözgil on 5.07.2024.
//

import Foundation
import OpenAI

class OpenAIService {
    private var apiKey: String

    init(apiKey: String) {
        self.apiKey = apiKey
    }

    func generateChatResponse(prompt: String, completion: @escaping (String?) -> Void) {
        let url = URL(string: "https://api.openai.com/v1/chat/completions")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")

        let body: [String: Any] = [
            "model": "gpt-3.5-turbo-0125",
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
                   let responses = jsonObject["choices"] as? [[String: Any]],
                   let firstResponse = responses.first,
                   let text = firstResponse["message"] as? [String: Any],
                   let content = text["content"] as? String {
                    completion(content.trimmingCharacters(in: .whitespacesAndNewlines))
                }
            } catch {
                print("Failed to decode JSON: \(error)")
                completion(nil)
            }
        }
        task.resume()
    }
}

