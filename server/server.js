import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

const users = [
    { id: "1", name: "John Doe", age: 30, isMarried: true },
    { id: "2", name: "Jane Smith", age: 25, isMarried: false },
    { id: "3", name: "Alice Johnson", age: 28, isMarried: false },
];

const typeDefs = `
    type Query {
        getUsers: [User]
        getUserById(id: ID!): User
    }

    type Mutation {
        createUser(name: String!, age: Int!, isMarried: Boolean!): User
    }

    type User {
        id: ID
        name: String
        age: Int
        isMarried: Boolean
    }
`

const resolvers = {
    Query: {
        getUsers: () => { return users },
        getUserById: (_, args) => {
            const id = args.id;
            console.log(`Fetching user with id: ${id}`); 
            const user = users.find(user => user.id === id);
            console.log(`Found user: ${JSON.stringify(user)}`); 
            return user;
        }
    },
    Mutation: {
        createUser: (_, args) => {
            const { name, age, isMarried } = args;
            const newUser = {
                id: (users.length + 1).toString(),
                name,
                age,
                isMarried,
            }
            users.push(newUser);
            console.log('New user created:', newUser);
            return newUser;
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
    listen: { port: 4001 },
});

console.log(`Server Running at: ${url}`);