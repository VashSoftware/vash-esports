import SwiftUI

struct MatchView: View {
    @State private var match: Match?
    @State private var error: Error?
    
    var body: some View {
        ZStack {
            Color.black.edgesIgnoringSafeArea(.all)
            
            if let error = error {
                Text("Error: \(error.localizedDescription)")
                    .foregroundColor(.red)
            } else if let match = match {
                VStack {
                    HStack {
                        VStack {
                        

                        }
                        
                        Spacer()
                            .frame(width: 40)
                        
                        HStack {
                            Text("5")
                                .font(.custom("Times New Roman", size: 32))
                                .fontWeight(/*@START_MENU_TOKEN@*/.bold/*@END_MENU_TOKEN@*/)
                            
                            Text("-")
                                .font(.custom("Times New Roman", size: 32))
                                .fontWeight(/*@START_MENU_TOKEN@*/.bold/*@END_MENU_TOKEN@*/)
                            
//                            Text(String(match.match_maps[1].id))
//                                .font(.custom("Times New Roman", size: 32))
//                                .fontWeight(/*@START_MENU_TOKEN@*/.bold/*@END_MENU_TOKEN@*/)
                        }
                        
                        Spacer()
                            .frame(width: 40)
                        
                        VStack {
                       
                        }
                    }
                }
                .foregroundColor(.white)
            } else {
                ProgressView("Loading match data...")
                    .foregroundColor(.white)
            }
        }
        .preferredColorScheme(.dark)

    }
}

struct MatchesView_Previews: PreviewProvider {
    static var previews: some View {
        MatchesView()
    }
}
