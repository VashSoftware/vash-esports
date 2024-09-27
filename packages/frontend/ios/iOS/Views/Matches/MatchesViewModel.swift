//
//  MatchViewModel.swift
//  Vash Esports
//
//  Created by Stan Runge on 19/09/2024.
//

import Foundation
import Combine

class MatchesViewModel: ObservableObject {
    @Published var matches: [Match] = []
    private var cancellables = Set<AnyCancellable>()
    
    func fetchMatches() {
        guard let url = URL(string: "https://esports.vash.software/api/matches") else { return }
        
//        URLSession.shared.dataTaskPublisher(for: url)
//            .map( $0.data )
//            .decode(type: [Match].self, decoder: JSONDecoder())
//            .replaceError(with: [])
//            .receive(on: DispatchQueue.main)
//            .sink { [weak self] in self?.matches = $0 }
//            .store(in: &cancellables)
    }
}
