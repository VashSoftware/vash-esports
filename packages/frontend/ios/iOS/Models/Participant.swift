//
//  Participant.swift
//  Vash Esports
//
//  Created by Stan Runge on 30/05/2024.
//

import Foundation

struct Participant: Identifiable, Decodable {
    let id: Int
    let teams: Team
//    let event: Event
//    let match_participants: [MatchParticipant]
}
