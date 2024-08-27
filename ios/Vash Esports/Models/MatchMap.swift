//
//  MatchMap.swift
//  Vash Esports
//
//  Created by Stan Runge on 30/05/2024.
//

import Foundation

struct MatchMap: Identifiable, Decodable {
    let id: Int
    let matches: Match
    let maps: Map
}
