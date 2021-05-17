const { buildSchema } = require("graphql");

module.exports = buildSchema(`
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

  input UserInput {
    email: String!
    name: String!
    password: String!
  }

  type RootQuery {
    hello: String!
  }

  type RootMutation {
    createUser(input: UserInput!): User!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
