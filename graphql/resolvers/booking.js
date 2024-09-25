const BookingModel = require('../../models/booking')
const EventModel = require('../../models/event');
const {transformBookings,transformEvents}=require('../resolvers/populationfns')

module.exports = {
    bookings: async (args,req) => {
        if(!req.isAuth){
            throw new Error('Unauthenticated:(')
        }
        try {
            const bookingList = await BookingModel.find();
            return bookingList.map((booking) => {
                return transformBookings(booking)
            });
        } catch (err) {
            console.log('Error while fetching bookings:', err);
            throw err;
        }

    },
    bookEvent:async(args,req)=>{
        if(!req.isAuth){
            throw new Error('Unauthenticated:(')
        }
        try{
           const fetchedEvent=await EventModel.findOne({_id:args.eventId})
           const booking =new BookingModel({
            user:req.userId,
            event:fetchedEvent,
           })
           const result=await booking.save()
           //instead of return result
           return transformBookings(result)
            

    }catch(e){
        throw e
    }

},
cancelBooking: async (args,req) => {
    if(!req.isAuth){
        throw new Error('Unauthenticated:(')
    }
    try {
        const booking = await BookingModel.findById(args.bookingId).populate('event');
        if (!booking) {
            throw new Error('Booking not found');
        }

        const event = transformEvents(booking.event)
        // console.log("booking.event is",booking.event)
        // console.log("booking.event._doc  is",booking.event._doc)


        //console for debugging
        console.log("booking is",booking)
        await BookingModel.deleteOne({ _id: args.bookingId });
        return event;
    } catch (err) {
        console.log('Error while canceling booking:', err);
        throw err;
    }
}

};

