//
//  LaunchScreen.swift
//  AI BOT
//
//  Created by Ali Kaan Karagözgil on 18.07.2024.
//

import SwiftUI

struct LaunchScreen: View {
    @State private var isActive = false

    var body: some View {
        NavigationStack {
            VStack {
                Spacer(minLength: 30)
                Image("L2")
                    .frame(width: 100, height: 210)
                Spacer(minLength: 85)
                ZStack {
                    Rectangle()
                        .foregroundColor(.clear)
                        .frame(width: 397, height: 510)
                        .background(Color(red: 0, green: 0.2, blue: 0.63))
                        .cornerRadius(50)
                    
                    VStack {
                        Image("L1")
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(width: 160, height: 155)
                            .clipped()

                        Image("Y1")
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .padding()
                            .frame(width: 393, height: 95)
                            .clipped()
                    }
                }
            }
            .onAppear {
                DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                    withAnimation(.easeInOut(duration: 1.0)) {
                        self.isActive = true
                    }
                }
            }
            .navigationDestination(isPresented: $isActive) {
                WelcomeView()
            }
        }
        .navigationBarHidden(true)
    }
}
#Preview {
    LaunchScreen()
}
