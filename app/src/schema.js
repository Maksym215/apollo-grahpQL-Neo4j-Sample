import { makeAugmentedSchema } from 'neo4j-graphql-js';

const typeDefs = `
  type USER_MAP_POSITION {
    map_name: String
    user: String
    x: Int
    y: Int
  }
 
  type Query {
    frontPage: [Fruit!]!
    fruits: [Fruit!]!
    customers: [Customer!]!
  }

  type Mutation {
    addFruitToBasket: Boolean!
  }

  type Fruit {
    name: String!
    count: Int!
  }

  type Customer {
    id: ID!
    basket: [Fruit!]!
  }
`

// convert typeDefs to neo4j schema
// need to verify if this works with shield
export const schema = makeAugmentedSchema({ typeDefs });

