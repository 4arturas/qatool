export const schema = gql`
  type Message {
    id: Int!
    type: Int!
    request: String
    response: String
    requestDate: DateTime
    responseDate: DateTime
    httpCode: Int
    txnId: String
  }

  type MessagePage {
    messages: [Message!]!
    count: Int!
    page: Int!
    pageSize: Int
  }

  type Query {
    messages: [Message!]! @requireAuth
    message(id: Int!): Message @requireAuth
    messagePage(page: Int, pageSize: Int): MessagePage @requireAuth
  }

  input CreateMessageInput {
    type: Int!
    request: String
    response: String
    requestDate: DateTime
    responseDate: DateTime
    httpCode: Int
    txnId: String
  }

  input UpdateMessageInput {
    type: Int
    request: String
    response: String
    requestDate: DateTime
    responseDate: DateTime
    httpCode: Int
    txnId: String
  }

  type Mutation {
    createMessage(input: CreateMessageInput!): Message! @requireAuth
    updateMessage(id: Int!, input: UpdateMessageInput!): Message! @requireAuth
    deleteMessage(id: Int!): Message! @requireAuth
  }
`
