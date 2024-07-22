//
//  WelcomeView.swift
//  AI BOT
//
//  Created by Ali Kaan Karagözgil on 19.07.2024.
//

import SwiftUI

struct WelcomeView: View {
    @State private var navigateToNextScreen = false

    var body: some View {
        NavigationStack {
            VStack {
                Spacer(minLength: 79)
                Image("L3")
                    .resizable()
                    .frame(width: 160, height: 155)
                    .clipped()
                Image("Y2")
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .padding()
                    .frame(width: 393, height: 95)
                    .clipped()
                Spacer(minLength: 39)
                ZStack {
                    Rectangle()
                        .foregroundColor(.clear)
                        .frame(width: 397, height: 510)
                        .background(Color(red: 0, green: 0.2, blue: 0.63))
                        .cornerRadius(50)
                    VStack {
                        Spacer()
                        Text("Her geri bildiriminiz bizim için çok değerli.")
                            .font(.largeTitle)
                            .foregroundColor(.white)
                            .padding()
                            .frame(maxWidth: .infinity, alignment: .topLeading)
                            .clipped()
                        Text("Şimdi DenizBank’ın yapay zeka destekli şikayet sistemi ile şikayetlerinizi bize iletin, hızlıca çözelim!")
                            .font(.title3)
                            .foregroundColor(.white)
                            .padding()
                            .frame(maxWidth: .infinity, alignment: .topLeading)
                            .clipped()
                        Spacer(minLength: 100)
                        Button("Şikayet Oluştur") {
                            navigateToNextScreen = true
                        }
                        .font(.title3)
                        .foregroundColor(.black)
                        .multilineTextAlignment(.center)
                        .padding(.vertical, 14)
                        .padding(.horizontal, 20)
                        .background(Color.white)
                        .cornerRadius(10)
                        .frame(minWidth: 0, maxWidth: .infinity)
                        .shadow(color: .black.opacity(0.21), radius: 18.5, x: 0, y: 13)
                        Spacer(minLength: 76.5)
                    }
                }
            }
            .navigationDestination(isPresented: $navigateToNextScreen) {
                           UserLogin()
            }
        }
        .navigationBarHidden(true)
    }
}


#Preview {
    WelcomeView()
}
