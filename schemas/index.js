// const { CarGraph } = require('./car');
// const { UserGraph } = require('./user');
const Car = require('../models/car');
const User = require('../models/user');
const mongoose = require('mongoose');
const graphql = require('graphql');
const { 
    GraphQLObjectType, GraphQLString, 
    GraphQLID, GraphQLInt,GraphQLSchema, 
    GraphQLList,GraphQLNonNull
} = graphql;


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

const CarGraph = new GraphQLObjectType({
    name: 'Car',
    fields: () => ({
        id: { type: GraphQLID },
        brand: { type: GraphQLString },
        model: { type: GraphQLString },
        year: { type: GraphQLInt },
        owner: {
            type: UserGraph,
            resolve(parent, args) {
                return User.findById(mongoose.Types.ObjectId(parent.owner));
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        car: {
            type: CarGraph,
            //argument passed by the user while making the query
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //Here we define how to get data from database source

                //this will return the book with id passed in argument 
                //by the user
                return Car.findById(args.id);
            }
        },
        cars:{
            type: new GraphQLList(CarGraph),
            resolve(parent, args) {
                return Car.find({});
            }
        },
        user:{
            type: UserGraph,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return User.findById(args.id);
            }
        },
        users: { 
            type: new GraphQLList(UserGraph),
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return User.find({});
            }
        }
    }
});
 
//Very similar to RootQuery helps user to add/update to the database.
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserGraph,
            args: {
                //GraphQLNonNull make these field required
                name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLString }
            },
            resolve(parent, args) {
                let user = new User({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                });
                return user.save();
            }
        },
        addCar:{
            type:CarGraph,
            args:{
                brand: { type: new GraphQLNonNull(GraphQLString)},
                model: { type: new GraphQLNonNull(GraphQLString)},
                year: { type: new GraphQLNonNull(GraphQLInt)},
                owner: { type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args){
                let car = new Car({
                    brand: args.brand,
                    model: args.model,
                    year: args.year,
                    owner: mongoose.Types.ObjectId(args.owner)
                })
                return car.save()
            }
        }
    }
});

//Creating a new GraphQL Schema, with options query which defines query 
//we will allow users to use when they are making request.
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation:Mutation
});