//
//  ChatScene.swift
//  AI BOT
//
//  Created by Ali Kaan Karagözgil on 22.07.2024.
//

import SwiftUI

struct ChatScene: View {
    
    @State private var message = ""
    
    var body: some View {
        VStack {
            Spacer()
            ZStack{
                Rectangle()
                  .foregroundColor(.clear)
                  .frame(width: 400, height: 121)
                  .background(Color(red: 0, green: 0.2, blue: 0.63))
                  .cornerRadius(50)
                VStack{
                    Spacer(minLength: 50)
                    HStack(spacing: 6){
                        Spacer()
                        Image("maskot")
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(width: 42, height: 42)
                            .clipShape(Circle())
                            .overlay(Circle().stroke(Color.white, lineWidth: 1.5))
                        VStack{
                            Spacer()
                            Text("I-Bot")
                                .font(.caption)
                                .foregroundStyle(.white)
                            Text("Çevrimiçi")
                                .font(.footnote)
                                .foregroundStyle(.blue.gradient)
                            Spacer()
                        }
                       Spacer(minLength:260)
                        
                    }
                }

            }
            Spacer(minLength: 650)
            ZStack{
                Rectangle()
                    .foregroundColor(.clear)
                    .frame(width: 400, height: 121)
                    .background(Color(red: 0, green: 0.2, blue: 0.63))
                    .cornerRadius(50)
                HStack{
                    Spacer(minLength: 15)
                    TextField("Adınızı giriniz", text: $message)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .foregroundColor(.black)
                        .background(Color.gray.opacity(0.2))
                        .cornerRadius(12)
                        .keyboardType(.default)
                        Button(action: {
                    }) {
                        Text("Gönder")
                            .foregroundColor(.blue)
                            .cornerRadius(10)
                            .padding(.maximum(12, 0))
                    }
                }
            }
            Spacer(minLength: 70)
           
        }
        .navigationBarBackButtonHidden(true)
    }
}

#Preview {
    ChatScene()
}
