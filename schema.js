const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
} = require("graphql");

// People Type
const PeopleType = new GraphQLObjectType({
  name: "People",
  fields: () => ({
    name: { type: GraphQLString },
    height: { type: GraphQLInt },
    mass: { type: GraphQLInt },
    gender: { type: GraphQLString },
    homeworld: {
      type: GraphQLString,
      resolve: (parent) => {
        return axios.get(parent.homeworld).then((res) => res.data.name);
      },
    },
  }),
});

// Root query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getAllPeople: {
      type: new GraphQLList(PeopleType),
      resolve: (parent, args) => {
        return axios
          .get("https://swapi.dev/api/people/")
          .then((res) => res.data.results);
      },
    },
    getPerson: {
      type: PeopleType,
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        return axios
          .get(`https://swapi.dev/api/people/${args.id}`)
          .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
