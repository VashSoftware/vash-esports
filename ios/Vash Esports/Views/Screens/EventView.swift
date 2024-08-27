//
//  EventView.swift
//  Vash Esports
//
//  Created by Stan Runge on 07/02/2024.
//

import Foundation
import SwiftUI

struct EventView: View {
    @ObservedObject var viewModel = EventViewModel()
    
    var body: some View {
        Text(viewModel.event?.name ?? "Event Name")
        .onAppear {
            Task {
                await viewModel.getEvent()
            }
            
            }
        }
    }
