//
//  ChatScene.swift
//  AI BOT
//
//  Created by Ali Kaan Karagözgil on 22.07.2024.
//

import SwiftUI

struct ChatScene: View {
    
    @State private var message = ""
    @State private var messages: [Message] = [Message(content: "Hello!", isFromUser: false)]
    
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
                    TextField("Adınızı giriniz", text: $message)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding(.leading, 1)
                    Button("Gönder") {
                    let newMessage = Message(content: message, isFromUser: true)
                    messages.append(newMessage)
                    message = ""
                    let responseMessage = Message(content: "Response to \(newMessage.content)", isFromUser: false)
                        messages.append(responseMessage)
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
}
#Preview {
    ChatScene()
}
