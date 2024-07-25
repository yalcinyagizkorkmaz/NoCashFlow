//
//  ContentView.swift
//  AI BOT
//
//  Created by Ali Kaan Karagözgil on 5.07.2024.
//

/*import SwiftUI

struct ContentView: View {
    @State private var messageText = ""
    @State var messages: [Message] = [Message(content: "Hoş geldiniz. Size nasıl yardımcı olabilirim?", isFromUser: false)]
    private let openAIService = OpenAIService(apiKey: "YOUR_API_KEY")
    
    var body: some View {
           VStack {
               HStack {
                   Text("NoCashFlow")
                       .font(.largeTitle.bold())
                   Image(systemName: "message.circle.fill")
                       .font(.system(size: 30))
                       .foregroundStyle(.blue)
               }
               
               ScrollView {
                   ForEach(messages) { message in
                       ChatMessageCell(message: message)
                   }
               }
               
               HStack {
                   TextField("Mesajınızı Giriniz", text: $messageText)
                       .padding()
                       .background(Color.gray.opacity(0.1))
                       .cornerRadius(10)
                       .onSubmit {
                           sendMessage()
                       }
                   
                   Button(action: sendMessage) {
                       Image(systemName: "paperplane.circle.fill")
                           .foregroundStyle(.blue)
                   }
                   .font(.system(size: 38))
               }
           }
           .padding()
       }
       
       func sendMessage() {
           let userMessage = Message(content: messageText, isFromUser: true)
           messages.append(userMessage)
           messageText = ""
           
           openAIService.generateChatResponse(prompt: userMessage.content) { response in
               DispatchQueue.main.async {
                   if let response = response {
                       let responseMessage = Message(content: response, isFromUser: false)
                       messages.append(responseMessage)
                   } else {
                       messages.append(Message(content: "Error generating response.", isFromUser: false))
                   }
               }
           }
       }
   }

   // Preview
   struct ContentView_Previews: PreviewProvider {
       static var previews: some View {
           ContentView()
       }
   }
*/
