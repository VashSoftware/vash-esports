//
//  HomeView.swift
//  Vash Esports
//
//  Created by Stan Runge on 07/02/2024.
//

import Foundation
import SwiftUI

struct HomeView: View {
    
    var body: some View {
        NavigationSplitView {            
            Text("Vash Esports")
                .font(.largeTitle)
                .fontWeight(.bold)
            
            Text("Ongoing Matches")
                .font(.title)
            
            NavigationLink("macdobald borgar vs evil macdobald borgar") {
                MatchView()
            }
        } detail: { MatchView()
      }
    }
}

#Preview {
    HomeView()
}
