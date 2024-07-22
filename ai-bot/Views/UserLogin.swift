//
//  UserLogin.swift
//  AI BOT
//
//  Created by Ali Kaan Karagözgil on 22.07.2024.
//

import SwiftUI

struct UserLogin: View {
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var phoneNumber = ""
    @State private var idNumber = ""
    @State private var isFormValid = false
    @State private var navigateToNextScene = false
    
    var body: some View {
        NavigationStack {
            VStack {
                Spacer(minLength: 60)
                Image("L4")
                    .resizable()
                    .frame(width: 160, height: 155)
                ZStack {
                    Rectangle()
                        .foregroundColor(.clear)
                        .frame(width: 397, height: 640)
                        .background(Color(red: 0, green: 0.2, blue: 0.63))
                        .cornerRadius(50)
                    VStack(spacing: 30) {
                        Spacer()
                        HStack {
                            VStack(alignment: .leading) {
                                Text("Adınız:")
                                    .font(.body)
                                    .foregroundColor(.white)
                                TextField("Adınızı giriniz", text: $firstName)
                                    .textFieldStyle(RoundedBorderTextFieldStyle())
                                    .foregroundColor(.black)
                                    .background(Color.gray.opacity(0.2))
                                    .cornerRadius(6)
                                    .keyboardType(.default)
                            }
                            Spacer()
                            VStack(alignment: .leading) {
                                Text("Soyadınız:")
                                    .font(.body)
                                    .foregroundColor(.white)
                                TextField("Soyadınızı giriniz", text: $lastName)
                                    .textFieldStyle(RoundedBorderTextFieldStyle())
                                    .foregroundColor(.black)
                                    .background(Color.gray.opacity(0.2))
                                    .cornerRadius(6)
                                    .keyboardType(.default)
                            }
                        }.padding(.horizontal)
                        
                        VStack(alignment: .leading) {
                            Text("Telefon Numaranız:")
                                .font(.body)
                                .foregroundColor(.white)
                            TextField("Telefon numaranızı giriniz", text: $phoneNumber)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                                .foregroundColor(.black)
                                .background(Color.gray.opacity(0.2))
                                .cornerRadius(6)
                                .keyboardType(.phonePad)
                        }.padding(.horizontal)
                        
                        VStack(alignment: .leading) {
                            Text("TC Kimlik numaranız:")
                                .font(.body)
                                .foregroundColor(.white)
                            TextField("TC Kimlik numaranızı giriniz", text: $idNumber)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                                .foregroundColor(.black)
                                .background(Color.gray.opacity(0.2))
                                .cornerRadius(6)
                                .keyboardType(.numberPad)
                        }.padding(.horizontal)
                        Spacer()
                        Toggle(isOn: $isFormValid) {
                            Text("DenizBank’a vermiş olduğum özel nitelikli kişisel verilerin şikayetimin çözümlenmesi amacıyla işlenmesine izin veriyorum.")
                                .font(.footnote)
                                .fontWeight(.semibold)
                                .foregroundColor(.white)
                        }
                        .padding()
                        .clipped(antialiased: true)
                        
                        Button(action: {
                            if isFormValid {
                                navigateToNextScene = true
                            }
                        }) {
                            Text("Şikayet Oluştur")
                                .foregroundColor(.black)
                                .padding()
                                .background(Color.white)
                                .cornerRadius(10)
                                .shadow(color: .black.opacity(0.21), radius: 18.5, x: 0, y: 13)
                        }
                        .disabled(!isFormValid)
                        Spacer()
                    }
                    .navigationDestination(isPresented: $navigateToNextScene) {
                        ChatScene()
                    }
                }
            }
        }
    }
}

#Preview {
    UserLogin()
}
