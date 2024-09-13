//
//  Round.swift
//  Vash Esports
//
//  Created by Stan Runge on 07/02/2024.
//

import Foundation

struct Round: Decodable {
    var event: Event
    var name: String
    var matches: [Match]
    
    init(event: Event, name: String, matches: [Match]) {
        self.event = event
        self.name = name
        self.matches = matches
    }
}
