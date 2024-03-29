const { gql } = require("apollo-server-express");

//defining models
const typeDefs = gql`
type User {
    _id: ID
    email: String!
    password: String!
    uprightOnly: Boolean!
    logs: [Log]
}

type Log {
    _id: ID
    date: String
    question: String
    readtype: String!
    cards: [Card]
    note: String
}

type Tarot {
    name: String!
    suit: String!
    upright: String!
    inverted: String!
}

type Card {
    _id: ID
    name: String!
    image: String!
    description: String!
    upright: String!
    date: String
}

type Auth {
    token: ID!
    user: User
}

type Query {
    me: User
    user(userId: ID!): User
    log(logId: ID!): Log
    card(cardId: ID!): Card
    tarot(tarotName: String!): Tarot
}

type Mutation {
    signUp(
        email: String!,
        password: String!,
        uprightOnly: Boolean!
    ): Auth
    logIn(email: String!, password: String!): Auth
    updateUser(userId: ID!, uprightOnly: Boolean!): User
    createLog(question: String, readtype: String!, pref: Boolean!, num: String!, userId: String!): Log
    createCard(logId: ID!, imgUrl: String!, name: String!): Log
    updateLog(logId: ID!, question: String!, note: String): Log
}
`;

module.exports = typeDefs;
