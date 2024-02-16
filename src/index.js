import dotenv from 'dotenv'

import express from 'express'
import connectDB from './db/index.js';
const app = express();

dotenv.config({
    path : './env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000 , () =>{
        console.log(`server create at ${process.env.PORT}`)
    })
})
.catch((error) =>{
    console.log("mongo bd connection failed" , error)
})
/*
;( async() => {
    try {
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error" , (error) =>{
            console.log(error)
            throw error;
        })

        app.listen(process.env.PORT , () =>{
            console.log(`app listening on port ${process.env.PORT}`)
        })

    } catch (error) {
        console.log("error" , error)
        throw error
    }
})()*/