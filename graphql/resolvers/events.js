const EventModel = require('../../models/event');
const {transformEvents}=require('./populationfns')
const Usermodel = require('../../models/user');
const {dateToString}=require('../helpers/date')

module.exports = {
    // Fetch all events
    events: async () => {
        try {
            const eventList = await EventModel.find();
            return eventList.map((event) => {
                return transformEvents(event)
            });
        } catch (err) {
            console.log('Error while fetching events:', err);
            throw err;
        }
    },
    // Create a new event
    createEvent: async (args,req) => {
        if(!req.isAuth){
            throw new Error('Unauthenticated:(')
        }
        try {
            const eventObj = new EventModel({
                title: args.eventInput.title,
                description: args.eventInput.description,
                Price: +args.eventInput.Price,
                date: dateToString(args.eventInput.date),
                creator: req.userId, // Static creator for now
            });
            const result = await eventObj.save();
            const createdEvent =transformEvents(result)
            const existingUser = await Usermodel.findById(req.userId);
            if (!existingUser) {
                throw new Error('User not found');
            }
            existingUser.createdEvents.push(eventObj);
            await existingUser.save();
            return createdEvent;
        } catch (err) {
            console.log('Error while creating event:', err);
            throw err;
        }
    },

   
 

};