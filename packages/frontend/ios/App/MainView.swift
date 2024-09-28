//
//  MainView.swift
//  Vash Esports
//
//  Created by Stan Runge on 20/09/2024.
//

import SwiftUI

struct MainView: View {
    var body: some View {
        TabView {
            HomeView()
                .tabItem {
                    Label("Home", systemImage: "house")
                }
//            
//            MatchesView()
//                .tabItem {
//                    Label("Matches", systemImage: "calendar")
//                }
//            
            EventsView()
                .tabItem {
                    Label("Events", systemImage: "calendar")
                }
            
            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gearshape")
                }
        }
    }
}

struct MainView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            MainView()
                .previewDevice("iPhone 14 Pro Max")
            MainView()
                .preferredColorScheme(.dark)
        }
    }
}
