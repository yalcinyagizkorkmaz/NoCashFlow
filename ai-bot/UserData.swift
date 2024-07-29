//
//  UserData.swift
//  AI BOT
//
//  Created by Ali Kaan Karagözgil on 29.07.2024.
//

import Foundation
import Combine

class UserModel: ObservableObject {
    @Published var id: Int = Int.random(in: 1..<10)
    @Published var userId: Int = 0
    @Published var tc: String = ""
    @Published var ad: String = ""
    @Published var soyad: String = ""
    @Published var tel: String = ""
    @Published var requestString: String = ""
    @Published var requestDate: String = ""
    @Published var requestStatus: String = ""
}
