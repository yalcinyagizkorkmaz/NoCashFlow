//
//  ChatScene.swift
//  AI BOT
//
//  Created by Ali Kaan Karagözgil on 22.07.2024.
//

import SwiftUI

struct ChatScene: View {
    @ObservedObject var userModel: UserModel
    @State private var messageText = ""
    @State private var messages: [Message] = [Message(content: "Hello!", isFromUser: false)]
    private var openAIService = OpenAIService(apiKey: "ec442c4a9f864b508f97504f7d7e687b")

    // Public initializer
    init(userModel: UserModel) {
        self._userModel = ObservedObject(wrappedValue: userModel)
    }

    var body: some View {
        VStack {
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
            .frame(maxHeight: .infinity)
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
        let currentMessageText = messageText // Capture the messageText before it's cleared
        let userMessage = Message(content: currentMessageText, isFromUser: true)
        messages.append(userMessage)
        messageText = ""

        print("Sending message with the following details:")
        print("id: \(userModel.id)")
        print("user_id: \(userModel.userId)")
        print("tc: \(userModel.tc)")
        print("ad: \(userModel.ad)")
        print("soyad: \(userModel.soyad)")
        print("tel: \(userModel.tel)")
        print("requestString: \(currentMessageText)")
        print("request_date: \(userModel.requestDate)")
        print("request_status: \(userModel.requestStatus)")

        openAIService.generateChatResponse(
            id: userModel.id,
            user_id: userModel.userId,
            tc: userModel.tc,
            ad: userModel.ad,
            soyad: userModel.soyad,
            tel: userModel.tel,
            requestString: currentMessageText,
            request_date: userModel.requestDate,
            request_status: userModel.requestStatus
        ) { category in
            DispatchQueue.main.async {
                if let category = category {
                    print((category))
                    let responseMessage = Message(content: ("Şikayetinizi detaylıca açıkladığınız için teşekkür ederim. Şikayetinizi \(category) birimine ilettim. Şikayetinizin en kısa zamanda değerlendirilip,tarafınıza dönüş yapılacağından emin olabilirsiniz. İyi günler dilerim."), isFromUser: false)
                    messages.append(responseMessage)
                } else {
                    print("Error generating category.")
                    let errorMessage = Message(content: "Error generating category.", isFromUser: false)
                    messages.append(errorMessage)
                }
            }
        }
    }
}



#Preview {
    ChatScene(userModel: UserModel())
}
