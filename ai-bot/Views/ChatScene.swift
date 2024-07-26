//
//  ChatScene.swift
//  AI BOT
//
//  Created by Ali Kaan Karagözgil on 22.07.2024.
//

import SwiftUI

struct ChatScene: View {
    
    @State private var messageText = ""
    @State private var messages: [Message] = [Message(content: "Hello!", isFromUser: false)]
    private var openAIService = OpenAIService(apiKey: "ec442c4a9f864b508f97504f7d7e687b")
    
        var body: some View {
        VStack() {
            ZStack {
                Image("Rectangle 10")
                    .resizable()
                    .scaledToFill()
                    .frame(width: UIScreen.main.bounds.width)
                    .clipped(antialiased: true)
                    .ignoresSafeArea(.all, edges: .top)
                HStack {
                    Image("maskot")
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: 42, height: 42)
                        .clipShape(Circle())
                        .overlay(Circle().stroke(Color.white, lineWidth: 1.5))
                    VStack(alignment: .leading) {
                        Text("I-Bot")
                            .font(.caption)
                            .foregroundColor(.white)
                        Text("Çevrimiçi")
                            .font(.footnote)
                            .foregroundColor(.blue)
                    }
                    Spacer()
                }
                .padding(.leading, 20)
                .padding(.top, 30)
            }
            .frame(height: 0)
            
            ScrollViewReader { proxy in
                ScrollView {
                    VStack {
                        ForEach(messages) { message in
                            ChatMessageCell(isFromUser: message.isFromUser, message: message.content)
                        }
                        .id(messages.last?.id) // Ensure the last message has an id
                    }
                    .onChange(of: messages) { _ in
                        if let lastMessageId = messages.last?.id {
                            withAnimation {
                                proxy.scrollTo(lastMessageId, anchor: .bottom)
                            }
                        }
                    }
                }
            }
            .frame(maxHeight:.infinity)
            .padding(.top, 60)
            
            ZStack {
                Image("Rectangle 11")
                    .resizable()
                    .scaledToFit()
                    .frame(height: 150)
                HStack {
                    TextField("Mesajınızı giriniz", text: $messageText)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(.leading, 1)
                    Button("Gönder") {
                        sendMessage()
                    }
                    .foregroundColor(.blue)
                    .padding(.horizontal, 1)
                }
                .padding(.horizontal)
            }
            .frame(height: 40)
        }
        .navigationBarBackButtonHidden(true)
    }
    private func sendMessage() {
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


#Preview {
    ChatScene()
}
