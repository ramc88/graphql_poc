const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLList, GraphQLSchema } = graphql;
const Car = require('../models/car');
const { CarGraph } = require('./car');

const UserGraph = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID  },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        car: { 
            type: new GraphQLList(CarGraph),
            resolve(parent, args) {
                return Car.find({owner: mongoose.Types.ObjectId(parent.id)})
            }    
        }
    })
})

module.exports = {
    UserGraph
}