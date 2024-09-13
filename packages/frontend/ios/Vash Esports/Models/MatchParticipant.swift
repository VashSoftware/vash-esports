//
//  MatchParticipant.swift
//  Vash Esports
//
//  Created by Stan Runge on 30/05/2024.
//

import Foundation

struct MatchParticipant: Identifiable, Decodable {
    let id: Int
    let matches: Match
    let participants: Participant
//    let match_participant_players: [MatchParticipantPlayer]
//    let roll: Int
//    let surrenderedBans: Bool
}
