import SwiftUI

struct UserLogin: View {
    @StateObject var userModel = UserModel()
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
                                TextField("Adınızı giriniz", text: $userModel.ad)
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
                                TextField("Soyadınızı giriniz", text: $userModel.soyad)
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
                            TextField("Telefon numaranızı giriniz", text: $userModel.tel)
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
                            TextField("TC Kimlik numaranızı giriniz", text: $userModel.tc)
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
                                createComplaint()
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
                        ChatScene(userModel: userModel) // Pass the existing userModel instance
                    }
                }
            }
            .navigationBarBackButtonHidden(true)
        }
    }
    
    private func validateForm() -> Bool {
        var isValid = true
        var messages: [String] = []
        
        if userModel.ad.isEmpty {
            messages.append("Adınızı giriniz.")
            isValid = false
        } else if userModel.ad.contains(where: { $0.isNumber }) {
            messages.append("Adınızda sayı bulunamaz.")
            isValid = false
        }
        
        if userModel.soyad.isEmpty {
            messages.append("Soyadınızı giriniz.")
            isValid = false
        } else if userModel.soyad.contains(where: { $0.isNumber }) {
            messages.append("Soyadınızda sayı bulunamaz.")
            isValid = false
        }
        
        if userModel.tel.isEmpty {
            messages.append("Telefon numaranızı giriniz.")
            isValid = false
        } else if userModel.tel.count != 10 || !userModel.tel.allSatisfy({ $0.isNumber }) {
            messages.append("Telefon numaranız 10 karakter ve sadece rakamlardan oluşmalıdır.")
            isValid = false
        }
        
        if userModel.tc.count != 11 {
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

    func createComplaint() {
        guard let url = URL(string: "http://127.0.0.1:8000/kullanici_bilgileri") else {
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let parameters: [String: Any] = [
            "ad": userModel.ad,
            "soyad": userModel.soyad,
            "tc": userModel.tc,
            "tel": userModel.tel
        ]

        request.httpBody = try? JSONSerialization.data(withJSONObject: parameters, options: .prettyPrinted)

        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data, error == nil else {
                DispatchQueue.main.async {
                    self.errorDetails = ErrorDetails(message: error?.localizedDescription ?? "Unknown error")
                    self.showAlert = true
                }
                return
            }

            do {
                if let response = response as? HTTPURLResponse, response.statusCode == 201 {
                    DispatchQueue.main.async {
                        self.navigateToNextScene = true
                    }
                } else {
                    let jsonResponse = try JSONSerialization.jsonObject(with: data, options: .mutableContainers)
                    DispatchQueue.main.async {
                        self.errorDetails = ErrorDetails(message: "Error: \(jsonResponse)")
                        self.showAlert = true
                    }
                }
            } catch {
                DispatchQueue.main.async {
                    self.errorDetails = ErrorDetails(message: error.localizedDescription)
                    self.showAlert = true
                }
            }
        }

        task.resume()
    }
}

#Preview {
    UserLogin()
}
