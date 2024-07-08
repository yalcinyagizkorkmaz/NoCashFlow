import SwiftUI

struct ChatMessageCell: View {
    let message: Message
    
    var body: some View {
        HStack {
            if message.isFromUser {
                Spacer()
                Text(message.content)
                    .font(.subheadline)
                Image(systemName: "person.fill")
                    .foregroundStyle(.blue)
                    .padding(.leading, 1)
                    .font(.system(size: 25))
                    .padding(2)
            } else {
                HStack {
                Image("team_icon")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 40, height: 40)
                .clipShape(Circle())
                Text(message.content)
                .font(.subheadline)
                Spacer()
                 }
            .padding(.horizontal, 5)
            .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
    }
}

struct ChatMessageCell_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            ChatMessageCell(message: Message(content: "This is a user message.", isFromUser: true))
            ChatMessageCell(message: Message(content: "This is a bot response, displayed as normal text, similar to how ChatGPT responses appear.", isFromUser: false))
        }
    }
}
