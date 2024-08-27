//
//  MatchParticipantPlayer.swift
//  Vash Esports
//
//  Created by Stan Runge on 30/05/2024.
//

import Foundation

struct MatchParticipantPlayer: Identifiable, Decodable {
    let id: Int
    let match_participants: MatchParticipant
}
