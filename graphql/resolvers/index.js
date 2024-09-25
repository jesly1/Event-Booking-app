const authResolver=require('./auth')
const eventresolver=require('./events')
const bookingResolver=require('./booking')
const rootResolver={
    ...authResolver,
    ...eventresolver,
    ...bookingResolver
}
module.exports=rootResolver