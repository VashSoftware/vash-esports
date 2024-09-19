//
//  Team.swift
//  Vash Esports
//
//  Created by Stan Runge on 07/02/2024.
//

import Foundation

struct Team: Identifiable, Decodable {
    let id: Int
    let name: String
    let bio: String
    let country_code: String
}
