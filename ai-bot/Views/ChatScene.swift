//
//  ChatScene.swift
//  AI BOT
//
//  Created by Ali Kaan Karagözgil on 22.07.2024.
//

import SwiftUI

struct ChatScene: View {
    
    @State private var message = ""
    @State private var messages: [String] = ["Hello!", "How can I help you?"]
    
    var body: some View {
        VStack {
//Tepe
            ZStack{
                Image("Rectangle 10")
                    .resizable()
                    .scaledToFit()
                    .offset(y:-340)
                HStack {
                    Image("maskot")
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(width: 42, height: 42)
                    .clipShape(Circle())
                    .overlay(Circle().stroke(Color.white, lineWidth: 1.5))
                    .offset(y: -312)
                    VStack(alignment: .leading) {
                        Text("I-Bot")
                        .font(.caption)
                        .foregroundStyle(.white)
                        Text("Çevrimiçi")
                        .font(.footnote)
                        .foregroundStyle(.blue.gradient)
                    }.offset(y:-310)
                    Spacer()
                    }
                    .padding(.leading, 20)
            }
//Ortadaki Mesaj kısmı
            
    
            
// aşağıdaki mesaj part
            ZStack {
                Image("Rectangle 11")
                    .resizable()
                    .scaledToFit()
                    .offset(y: 300)
                
                HStack {
                    TextField("Adınızı giriniz", text: $message)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .foregroundColor(.black)
                        .background(Color.gray.opacity(0.2))
                        .cornerRadius(12)
                        .keyboardType(.default)
                        .frame(width: 260)
                    Button(action: {
                       
                    }) {
                        Text("Gönder")
                            .foregroundColor(.blue)
                            .cornerRadius(10)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 8)
                    }
                    .padding(.trailing, 10)
                }
                .frame(maxWidth: .infinity)
                .padding()
                .cornerRadius(12)
                .offset(y: 300)
            }
        }
        .navigationBarBackButtonHidden(true)
    }
}

#Preview {
    ChatScene()
}
