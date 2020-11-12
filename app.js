const express =  require('express');
const bodyParser = require('body-parser')
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose')

const Event = require('./models/events')

const app = express();

app.use(bodyParser.json());


app.use('/gql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            date: String!
        }
        input EventInput {
            title: String!
            date: String
        }
        type RootQuery{
            events: [Event!]!
        }
        type RootMutation{
            createEvent(eventInput: EventInput): Event
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find()
              .then(events => {
                return events.map(event => {
                  return { ...event._doc, _id: event.id };
                });
              })
              .catch(err => {
                throw err;
              });
          },
        createEvent: args => {
            // const event = {
            //     _id: Math.random().toString(),
            //     title: args.eventInput.title,
            //     date: new Date().toISOString()
            // }
            const event = new Event({
                title: args.eventInput.title,
                date: new Date().toISOString()
            })
            console.log(args)
            // events.push(event);
            return event
            .save()
            .then(result => {
                console.log(result);
                return { ...result._doc, _id: result._doc._id.toString() };
              })
              .catch(err => {
                console.log(err);
                throw err;
              });
        }
    }, 
    graphiql: true
}))

mongoose.connect(process.env.mongoURI)
.then(()=>{
    app.listen(3030);
})
.catch(err => {
    console.log(err)
})

