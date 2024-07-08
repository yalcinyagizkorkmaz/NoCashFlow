//
//  Message.swift
//  AI BOT
//
//  Created by Ali Kaan Karagözgil on 5.07.2024.
//

import Foundation

struct Message: Identifiable {
    let id = UUID()
    let content: String
    let isFromUser: Bool
}
