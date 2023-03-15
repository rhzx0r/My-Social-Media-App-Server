const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const { MONGODB, CLIENT } = require("./config");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
  cors: {
    origin: ["http://127.0.0.1:5173", CLIENT ],
    credentials: true
  },
});

mongoose.set("strictQuery", true);

mongoose
  .connect(MONGODB)
  .then(() => {
    console.log("MongoDB Connected success");
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch(err => {
    console.error(err);
  });
