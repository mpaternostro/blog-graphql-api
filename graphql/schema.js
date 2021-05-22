const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type AuthData {
    token: String!
    userId: String!
  }

  type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User!
  }

  type User {
    _id: ID!
    email: String!
    name: String!
    password: String!
    posts: [Post!]!
  }

  input LoginData {
    email: String!
    password: String!
  }

  input UserInput {
    email: String!
    name: String!
    password: String!
  }

  type RootQuery {
    login(input: LoginData!): AuthData
  }

  type RootMutation {
    createUser(input: UserInput!): User!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
