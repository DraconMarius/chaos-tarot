/*setting up server for back end: 
node.js / express w/ apollo
mongoDB, mongoose
*/

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');

//requiring middleware for token verification
const { authMiddleware } = require('./utils/auth')

//typeDefs and Resolvers for graphQL
const { typeDefs, resolvers } = require('./schemas');

//connection to db
const db = require('./config/connection');

//defining PORT
const PORT = process.env.PORT || 3001;

//setting up express app and apollo
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//cloudinary
var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

//static public build folder
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

//catch route
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/build/index.html'));
// })


// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
    await server.start();
    // integrate our Apollo server with the Express application
    server.applyMiddleware({ app });
    //   // start the  server
    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`API server running on port ${PORT}!`);
            console.log(
                `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
            );
        });
    })
};

// call fn with our typeDefs, resolvers
startApolloServer(typeDefs, resolvers);
