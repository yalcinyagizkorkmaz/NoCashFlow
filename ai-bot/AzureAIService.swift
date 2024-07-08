//
//  AzureAIService.swift
//  AI BOT
//
//  Created by Ali Kaan Karagözgil on 5.07.2024.
//

import Foundation

class AzureOpenAIService {
    private let apiKey: String
    private let endpoint: String
    private let deploymentName: String

    init(apiKey: String, endpoint: String, deploymentName: String) {
        self.apiKey = apiKey
        self.endpoint = endpoint
        self.deploymentName = deploymentName
    }

    func generateText(prompt: String, completion: @escaping (String?) -> Void) {
        guard let url = URL(string: "\(endpoint)/openai/deployments/\(deploymentName)/chat/completions?api-version=2024-05-13") else {
            completion(nil)
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let parameters: [String: Any] = [
            "messages": [
                ["role": "system", "content": "You are a helpful assistant."],
                ["role": "user", "content": prompt]
            ],
            "max_tokens": 4096,
            "temperature": 0.7,
            "top_p": 0.95
        ]

        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: parameters)
        } catch {
            completion(nil)
            return
        }

        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data, error == nil else {
                completion(nil)
                return
            }

            if let result = try? JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
               let choices = result["choices"] as? [[String: Any]],
               let text = choices.first?["message"] as? [String: Any],
               let content = text["content"] as? String {
                completion(content.trimmingCharacters(in: .whitespacesAndNewlines))
            } else {
                completion(nil)
            }
        }
        task.resume()
    }
}
