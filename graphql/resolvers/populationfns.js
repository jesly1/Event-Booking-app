const EventModel = require('../../models/event');
const Usermodel = require('../../models/user');
const {dateToString}=require('../helpers/date')
const events = async (eventIds) => {
    try {
        const events = await EventModel.find({ _id: { $in: eventIds } })
       return events.map((event) => {
            return  transformEvents(event)
        })
        
    } catch (err) {
        throw err
    }
}
//Manual population
const user = async (userId) => {
    try {
        const userData = await Usermodel.findById(userId).populate('createdEvents');
        if (!userData) {
            throw new Error('User not found');
        }
        return {
            ...userData._doc,
            _id: userData.id,
            createdEvents: userData.createdEvents.map(event => transformEvents(event))
        };
    } catch (err) {
        throw err;
    }
};

const singleEvent = async (eventId) => {
    try {
        const eventData = await EventModel.findById(eventId);
        if (!eventData) {
            throw new Error('Event not found');
        }
        return {
            ...eventData._doc,
            _id: eventData.id,
            creator: user.bind(this, eventData.creator),
        };
    } catch (err) {
        throw err;
    }
};
const transformEvents = (event) => {
    return {
        ...event._doc,
        _id: event.id,
        date: event._doc.date ? dateToString(new Date(event._doc.date)) : null,  // Check if date exists and parse it to Date object
        creator: user.bind(this, event.creator)
    };
};


const transformBookings = (booking) => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: booking._doc.createdAt ? dateToString(booking._doc.createdAt) : null,  // Check if createdAt exists
        updatedAt: booking._doc.updatedAt ? dateToString(booking._doc.updatedAt) : null,  // Check if updatedAt exists
    };
};


exports.transformBookings=transformBookings
exports.transformEvents=transformEvents
// exports.user=user
// exports.events=events
// exports.singleEvent=singleEvent