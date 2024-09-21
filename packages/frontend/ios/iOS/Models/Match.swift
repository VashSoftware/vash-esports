//
//  MatchModel.swift
//  Vash Esports
//
//  Created by Stan Runge on 07/02/2024.
//

import Foundation

struct Match: Identifiable, Decodable {
    let id: Int
    let match_participants: [MatchParticipant]?
//    let match_maps: [MatchMap]
}

