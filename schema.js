const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
} = require("graphql");
const {
  Page,
  convertCursorToNodeId,
  convertNodeToCursor,
} = require("./pagination");

// People Type
const PeopleType = new GraphQLObjectType({
  name: "People",
  fields: () => ({
    name: { type: GraphQLString },
    height: { type: GraphQLInt },
    mass: { type: GraphQLString },
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
    people: {
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
    goNextPage: {
      type: new GraphQLList(PeopleType),
      args: {
        page: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        return axios
          .get(`https://swapi.dev/api/people/?page=${args.page}`)
          .then((res) => res.data.results);
      },
    },
    searchQuery: {
      type: new GraphQLList(PeopleType),
      args: {
        name: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        return axios
          .get(`https://swapi.dev/api/people/?search=${args.name}`)
          .then((res) => res.data.results);
      },
    },
    nextPeople: {
      type: Page(PeopleType),
      args: {
        first: { type: GraphQLInt },
        afterCursor: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        let { first, afterCursor } = args;
        let afterIndex = 0;

        return axios.get(`https://swapi.dev/api/people/`).then((res) => {
          let data = res.data.results;

          if (typeof afterCursor === "string") {
            /* Extracting nodeId from afterCursor */
            let nodeId = convertCursorToNodeId(afterCursor);
            /* Finding the index of nodeId */
            let nodeIndex = data.findIndex((datum) => datum.id === nodeId);
            if (nodeIndex >= 0) {
              afterIndex = nodeIndex + 1; // 1 is added to exclude the afterIndex node and include items after it
            }
          }

          const slicedData = data.slice(afterIndex, afterIndex + first);
          const edges = slicedData.map((node) => ({
            node,
            cursor: convertNodeToCursor(node),
          }));

          let startCursor,
            endCursor = null;
          if (edges.length > 0) {
            startCursor = convertNodeToCursor(edges[0].node);
            endCursor = convertNodeToCursor(edges[edges.length - 1].node);
          }
          let hasNextPage = data.length > afterIndex + first;

          return {
            totalCount: data.length,
            edges,
            pageInfo: {
              startCursor,
              endCursor,
              hasNextPage,
            },
          };
        });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
