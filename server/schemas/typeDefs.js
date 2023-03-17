const { gql } = require("apollo-server-express");

//defining models
const typeDefs = gql`
type User {
    _id: ID
    email: String!
    password: String!
    Logs: [ID]
}

type Log {
    _id: ID
    date: String
    question: String!
    image: String!
    cards: [ID!]
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
    upright: Boolean!
    date: String
    user: String
}

type Auth {
    token: ID!
    user: User
}

type Query {
    me: User
    log(logId: ID!): Log
    card(cardId: ID!): Card
    tarot(tarotName: String!): Tarot
}

input cardContent {
    name: String!
    image: String!
    upright: Boolean!
    username: String!
}

type Mutation {
    signUp(
        email: String!,
        password: String!,
        uprightOnly: Boolean!
    ): Auth
    logIn(email: String!, password: String!): Auth
    updateUser(userId: ID!, uprightOnly: Boolean!): User
    createLog(
        question: String!,
        cards: [cardContent]!,
        note: String,
        ): Log
    updateLog(logId: ID!, question: String!, note: String): Log
}
`;

module.exports = typeDefs;
