import express from 'express'
import morgan from 'morgan'
import multer from 'multer'
import { dbAuthenticate } from './configs/index.js'
import { route } from './routes/index.js'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express()
const PORT = process.env.PORT || 8080
const Origin = ["https://tricky-app.vercel.app", "http://localhost:3000"]

const fileStorage = multer.diskStorage({
    destination : (req, file, cb)=> {
        cb(null, "images")
    },
    filename : (req, file, cb) => {
        cb(null, `123-${file.originalname}`)
    }
})

const filter = (req, file, cb) => {
    if(
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
     ){
        cb(null, true)
     }else{
        cb(null, false)
     }
}


(()=> {

    app.use(express.json())
    app.use(cookieParser())

    dbAuthenticate()
    
    app.use(cors({
        origin : Origin[0],
        credentials : true
    }))
    app.use(morgan("dev"))
    app.use(helmet())
    app.use(rateLimit({
        windowMs : 10000,
        max : 10,
        message : "429"
    }))
    app.use(multer({
        storage : fileStorage,
        fileFilter : filter
    }).single("avatar"))

    app.use(route)
    app.use('/images', express.static('images'))
    app.use((req, res, next) => {
        res.status(200).send("Api not found")
    })


    app.listen(PORT, ()=> {
        console.log(`Server is running in http://localhost:${PORT}`)
    })
    
})();

// config()
// const main = () => {
    
//     app.use(express.json())

//     app.use(cookieParser())
//     app.set('trust proxy', 1)

//     dbAuthenticate()
    
//     // Must in top level
    
//     app.use(morgan("dev"))
//     app.use(cors({
//         origin : Origin[1],
//         credentials : true
//     }))


//     // app.use(helmet({
//     //     crossOriginResourcePolicy: false,
//     // }))
//     app.use(helmet())

//     app.use(rateLimit({
//         windowMs : 10000,
//         max : 10,
//         message : "429"
//     }))
    
//     app.use(multer({
//         storage : fileStorage,
//         fileFilter : filter,
//         // request body name must avatar, example avatar : me.png
//     }).single("avatar"))

//     app.use(route)

//     app.use('/images', express.static('images'))

//     app.listen(PORT, ()=> {
//         console.log(`Server is running in http://localhost:${PORT}`)
//     })
// }

// main()

