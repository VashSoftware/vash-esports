//
//  SupabaseManager.swift
//  Vash Esports
//
//  Created by Stan Runge on 13/02/2024.
//

import Foundation
import Supabase

final class SupabaseManager: ObservableObject {
    static let shared = SupabaseManager()
    
    let supabaseClient = SupabaseClient(supabaseURL: URL(string: "https://mdixwlzweijevgjmcsmt.supabase.co")!, supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kaXh3bHp3ZWlqZXZnam1jc210Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTIwMzQyNDcsImV4cCI6MjAwNzYxMDI0N30.a8SWatAgGUn8MDCSVcjEdNhlEJum177aIVQnxVZaY8w")
    
    private init() {}
}
