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
        deleteUser(id: ID!): User
        updateUser(id: ID!, name: String, age: Int, isMarried: Boolean): User
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
        getUsers: () => users,
        getUserById: (_, args) => {
            return users.find(user => user.id === args.id);
        }
    },
    Mutation: {
        createUser: (_, { name, age, isMarried }) => {
            const newUser = {
                id: (users.length + 1).toString(),
                name,
                age,
                isMarried,
            };
            users.push(newUser);
            return newUser;
        },
        deleteUser: (_, { id }) => {
            const index = users.findIndex(user => user.id === id);
            if (index === -1) {
                throw new Error("User not found");
            }
            const [deletedUser] = users.splice(index, 1);
            return deletedUser;
        },
        updateUser: (_, args) => {
            const { id, name, age, isMarried } = args;
            const user = users.find(user => user.id === id);
            if (!user) {
                throw new Error("User not found");
            }

            if (name !== undefined) user.name = name;
            if (age !== undefined) user.age = age;
            if (isMarried !== undefined) user.isMarried = isMarried;

            return user;
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
    listen: { port: 4001 },
});

console.log(`Server Running at: ${url}`);
