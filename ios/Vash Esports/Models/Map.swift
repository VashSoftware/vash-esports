//
//  Map.swift
//  Vash Esports
//
//  Created by Stan Runge on 07/02/2024.
//

import Foundation

struct Map: Identifiable, Decodable {
    let id: Int
    let osu_id: String
    let match_maps: [MatchMap]
}
