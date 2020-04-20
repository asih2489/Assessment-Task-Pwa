import gql from "graphql-tag";

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }

  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [ID!]!
  }
`;

export const resolvers = {
  Mutation: {
    addOrRemoveFromCart: (_, { id }, { cache }) => {
      cache.writeData({ cartItems: [1] });
      return [1];
    },
  },
};
