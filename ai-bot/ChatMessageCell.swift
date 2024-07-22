//
//  ChatMessageCell.swift
//  AI BOT
//
//  Created by Ali Kaan Karagözgil on 22.07.2024.
//

import SwiftUI



struct ChatMessageCell: View {
    @State var isfromUser = true
    var body: some View {
        HStack {
            if !isfromUser {
                HStack {
                    Image("maskot")
                        .resizable()
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 40, height: 40)
                        .clipShape(Circle())
                    ZStack {
                        Rectangle()
                            .foregroundStyle(.clear)
                            .frame(width: 100, height: 100)
                            .background(Color(red: 0.96, green: 0.96, blue: 0.97))
                            .cornerRadius(16)
                        Text("deneme mesajı")
                            .font(.subheadline)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
            } else {
                Spacer()
                ZStack {
                    Rectangle()
                        .foregroundStyle(.clear)
                        .frame(width: 100, height: 100)
                        .background(Color(red: 0.96, green: 0.96, blue: 0.97))
                        .cornerRadius(16)
                    Text("deneme mesajı")
                        .font(.subheadline)
                }
                .frame(maxWidth: .infinity, alignment: .trailing)
            }
        }
        .padding()
    }
}

#Preview {
    ChatMessageCell()
}
