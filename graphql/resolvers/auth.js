const bcryptjs = require('bcryptjs');
const Usermodel = require('../../models/user');
const jwt=require('jsonwebtoken')
module.exports = {
    // Create a new user
    createUser: async (args) => {
        try {
            const existingUser = await Usermodel.findOne({ email: args.userInput.email });
            if (existingUser) {
                throw new Error('Email already exists');
            }
            const hashedPassword = await bcryptjs.hash(args.userInput.password, 12);
            const userObj = new Usermodel({
                email: args.userInput.email,
                password: hashedPassword,
            });

            const res = await userObj.save();
            return { ...res._doc, password: null, _id: res.id }; // Hide password
        } catch (err) {
            console.log('Error while creating user:', err);
            throw err;
        }
    },
    login:async({email,password})=>{
        try{
            const user = await Usermodel.findOne({email});
            if(!user){
                throw new Error('User not found');
                }
                const isValid = await bcryptjs.compare(password,user.password);
                if(!isValid){
                    throw new Error('Invalid password');
                    }
                 const token=jwt.sign({userId:user.id,email:user.email},'secretkey',{
                    expiresIn:'1h'

                 })

                 //we return like this becoz our graphql query return type is like this
                 // type AuthData{
                // userId:ID!
                // token:String!
                // tokenExpiration:Int!
                // }
                 return {
                    userId:user.id,
                    token,
                    tokenExpiration:1
               }
                   
                    }catch(err){
                        console.log('Error while logging in:',err);
                        throw err;
                        }
    }
};

