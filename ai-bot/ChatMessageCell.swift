//
//  ChatMessageCell.swift
//  AI BOT
//
//  Created by Ali Kaan Karagözgil on 22.07.2024.
//

import SwiftUI

struct ChatMessageCell: View {
    @State var isFromUser = true
    @State var message: String = "deneme mesajı"

    var body: some View {
        HStack {
            if !isFromUser {
                HStack(alignment: .top) {
                    Image("maskot")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 40, height: 40)
                        .clipShape(Circle())
                    
                    Text(message)
                        .font(.subheadline)
                        .padding(10)
                        .background(Color(red: 0.96, green: 0.96, blue: 0.97))
                        .cornerRadius(16)
                        .fixedSize(horizontal: false, vertical: true)
                    
                    Spacer()
                }
            } else {
                HStack {
                    Spacer()
                    
                    Text(message)
                        .font(.subheadline)
                        .padding(10)
                        .background(Color.gray.opacity(0.7))
                        .cornerRadius(16)
                        .foregroundColor(.black)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
        }
        .padding(.horizontal)
        .padding(.vertical, 4)
    }
}
#Preview {
    VStack {
    ChatMessageCell(isFromUser: false, message: "This is a system message.")
    ChatMessageCell(isFromUser: true, message: "This is a user message.")
    }
}
