const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLInt, GraphQLSchema } = graphql;
const User = require('../models/user');
const UserGraph = require('./user');

const CarGraph = new GraphQLObjectType({
    name: 'Car',
    fields: () => ({
        id: { type: GraphQLID },
        brand: { type: GraphQLString },
        model: { type: GraphQLString },
        year: { type: GraphQLInt },
        user: {
            type: UserGraph,
            resolve(parent, args) {
                return User.findById(parent.id);
            }
        }
    })
})

module.exports = {
    CarGraph
}