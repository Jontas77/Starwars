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
    homeworld: { type: PlanetType },
  }),
});

// Planet Type
const PlanetType = new GraphQLObjectType({
  name: "Planets",
  fields: () => ({
    name: { type: GraphQLString },
    climate: { type: GraphQLString },
    gravity: { type: GraphQLString },
  }),
});

// Root query
const RootQuery = new GraphQLObjectType({
  name: "PeopleQueryType",
  fields: {
    people: {
      type: new GraphQLList(PeopleType),
      resolve(parent, args) {
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
      resolve(parent, args) {
        return axios
          .get(`https://swapi.dev/api/people/${args.id}`)
          .then((res) => res.data);
      },
    },
    planets: {
      type: new GraphQLList(PlanetType),
      resolve(parent, args) {
        return axios
          .get("https://swapi.dev/api/planets/")
          .then((res) => res.data.results);
      },
    },
    planet: {
      type: PlanetType,
      args: {
        id: { type: GraphQLInt },
      },
      resolve(parent, args) {
        return axios
          .get(`https://swapi.dev/api/planets/${args.id}`)
          .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
