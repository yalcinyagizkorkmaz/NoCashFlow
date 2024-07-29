import Foundation

class OpenAIService {
    private var apiKey: String

    init(apiKey: String) {
        self.apiKey = apiKey
    }

    func generateChatResponse(
        id: Int,
        user_id: Int,
        tc: String,
        ad: String,
        soyad: String,
        tel: String,
        requestString: String,
        request_date: String,
        request_status: String,
        completion: @escaping (String?) -> Void
    ) {
        let url = URL(string: "http://127.0.0.1:8000/classify-query/")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")

        let body: [String: Any] = [
            "id": id,
            "user_id": user_id,
            "tc": tc,
            "ad": ad,
            "soyad": soyad,
            "tel": tel,
            "request": requestString,
            "request_date": request_date,
            "request_status": request_status
        ]
        
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: body, options: [])
            request.httpBody = jsonData
            if let jsonString = String(data: jsonData, encoding: .utf8) {
                print("Request JSON: \(jsonString)")
            }
        } catch {
            print("Failed to serialize JSON: \(error)")
            completion(nil)
            return
        }

        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Error: \(error.localizedDescription)")
                completion(nil)
                return
            }
            
            guard let data = data else {
                print("No data received")
                completion(nil)
                return
            }
            
            do {
                if let jsonObject = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any],
                   let catagory = jsonObject["catagory"] as? String {
                    completion(catagory)
                } else {
                    if let jsonString = String(data: data, encoding: .utf8) {
                        print("Response JSON: \(jsonString)")
                    }
                    completion("Unable to parse response or no catagory found")
                }
            } catch {
                print("Failed to decode JSON: \(error)")
                completion(nil)
            }
        }
        task.resume()
    }
}
