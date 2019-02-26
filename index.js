const Express = require('express');
const ExpressGraphQL = require('express-graphql');
const Mongoose = require('mongoose');
const {
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} = require('graphql');

var app = Express();

Mongoose.connect('mongodb://localhost:27017/recipe');

const RecipeModel = Mongoose.model('recipe', {
  name: String,
  description: String,
});

const RecipeType = new GraphQLObjectType({
  name: 'Recipe',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  },
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      recipes: {
        type: GraphQLList(RecipeType),
        resolve: (root, args, context, info) => {
          return RecipeModel.find().exec();
        },
      },
      recipe: {
        type: RecipeType,
        args: {
          id: { type: GraphQLNonNull(GraphQLID) },
        },
        resolve: (root, args, context, info) => {
          return RecipeModel.findById(args.id).exec();
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      recipe: {
        type: RecipeType,
        args: {
          name: { type: GraphQLNonNull(GraphQLString) },
          description: { type: GraphQLNonNull(GraphQLString) },
        },
        resolve: (root, args, context, info) => {
          var person = new RecipeModel(args);
          return person.save();
        },
      },
    },
  }),
});

app.use(
  '/graphql',
  ExpressGraphQL({
    schema: schema,
    graphiql: true,
  })
);

app.listen(3000, () => {
  console.log('Listening at :3000');
});
