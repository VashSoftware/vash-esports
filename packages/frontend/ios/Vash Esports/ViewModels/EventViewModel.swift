//
//  EventViewModel.swift
//  Vash Esports
//
//  Created by Stan Runge on 13/02/2024.
//

import Foundation

class EventViewModel: ObservableObject {
    init() {}
    
    @Published var event: Event?
    
    func getEvent() async {
        do {
            event = try await SupabaseManager.shared.supabaseClient
                .database
                .from("events")
                .select("name")
                .eq("id", value: 30)
                .single()
                .execute()
                .value
            
            print(event)
        } catch {
            print("Error")
        }
        

    }
}
