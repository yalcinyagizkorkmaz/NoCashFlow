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
    
    @State private var showAlert = false
    @State private var errorDetails: ErrorDetails?
    
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
                            if validateForm() {
                                navigateToNextScene = true
                            } else {
                                showAlert = true
                            }
                        }) {
                            Text("Şikayet Oluştur")
                                .foregroundColor(.black)
                                .padding()
                                .background(Color.white)
                                .cornerRadius(10)
                                .shadow(color: .black.opacity(0.21), radius: 18.5, x: 0, y: 13)
                        }
                        .alert("Hata", isPresented: $showAlert, presenting: errorDetails) { details in
                            Button("Tamam", role: .cancel) {}
                        } message: { details in
                            Text(details.message)
                        }
                        Spacer()
                    }
                    .navigationDestination(isPresented: $navigateToNextScene) {
                        ChatScene()
                    }
                }
            }
            .navigationBarBackButtonHidden(true)
        }
    }
    
    private func validateForm() -> Bool {
        var isValid = true
        var messages: [String] = []
        
        if firstName.isEmpty {
            messages.append("Adınızı giriniz.")
            isValid = false
        } else if firstName.contains(where: { $0.isNumber }) {
            messages.append("Adınızda sayı bulunamaz.")
            isValid = false
        }
        
        if lastName.isEmpty {
            messages.append("Soyadınızı giriniz.")
            isValid = false
        } else if lastName.contains(where: { $0.isNumber }) {
            messages.append("Soyadınızda sayı bulunamaz.")
            isValid = false
        }
        
        if phoneNumber.isEmpty {
            messages.append("Telefon numaranızı giriniz.")
            isValid = false
        } else if phoneNumber.count != 10 || !phoneNumber.allSatisfy({ $0.isNumber }) {
            messages.append("Telefon numaranız 10 karakter ve sadece rakamlardan oluşmalıdır.")
            isValid = false
        }
        
        if idNumber.count != 11 {
            messages.append("TC Kimlik numaranız 11 karakter olmalıdır.")
            isValid = false
        }

        if !isFormValid {
            messages.append("Lütfen verilerin işlenmesine izin verin.")
            isValid = false
        }
        
        if !isValid {
            errorDetails = ErrorDetails(message: messages.joined(separator: "\n"))
        }
        
        return isValid
    }
}

#Preview {
    UserLogin()
}
