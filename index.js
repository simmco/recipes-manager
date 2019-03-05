const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost:27017/recipes');

const typeDefs = gql`
  type Query {
    recipe(id: ID!): Recipe
    recipes: [Recipe]
  }

  type Mutation {
    createRecipe(name: String!, description: String!): Recipe
  }

  type Recipe {
    id: ID!
    name: String
    description: String
  }
`;

const resolvers = {
  Query: {
    recipe: (recipe, args, whatever) => {
      console.log({ recipe, args, whatever });
      return RecipeModel.findById(args.id).exec();
    },
    recipes: () => {
      return RecipeModel.find().exec();
    },
  },
  Mutation: {
    createRecipe: (_, args, context, jo) => {
      console.log({ _, args, context, jo });
      var person = new RecipeModel(args);
      return person.save();
    },
  },
};

const RecipeModel = mongoose.model('recipe', {
  name: String,
  description: String,
});

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  playground: {
    endpoint: `http://localhost:3600/graphql`,
    settings: {
      'editor.theme': 'light',
    },
  },
});

server.applyMiddleware({
  app: app,
});

app.listen(3600, () => {
  console.log('Listening at :3000');
});
