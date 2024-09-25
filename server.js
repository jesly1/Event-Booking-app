const express = require('express');
const bodyparser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const isAuth=require('./middleware/is-auth')
const cors = require('cors'); 
const graphqlSchema=require('./graphql/schema/index')
const graphqlResolvers=require('./graphql/resolvers/index')
const PORT = 4000;

const MONGO_URI = 'mongodb+srv://jesly:66qkJkuP2oUA7jEV@cluster0.h0tzqt8.mongodb.net/EventBooking';

if (!MONGO_URI) {
  throw new Error('You must provide a Mongo Atlas URI');
}

mongoose.connect(MONGO_URI);
mongoose.connection
  .once('open', () => console.log('Connected to Mongo Atlas instance.'))
  .on('error', (error) => console.log('Error connecting to Mongo Atlas:', error));

const app = express();
app.use(bodyparser.json());
app.use(cors());
app.use(isAuth)
//instead of populate of mongoose we use custom functions for queries for nested query implementation without complexity like this  query{
    // query{
    //     events{
    //       title
    //       creator{
    //         _id
    //         email
    //         createdEvents{
    //           title
    //           creator{
    //             email
    //           }
    //         }
    //       }
    //     }
    //   }

  
app.use(
  '/graphql',
  graphqlHTTP({
    schema:graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
);

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(PORT, () => {
  console.log(`Your Express Server is running successfully on port ${PORT}`);
});
