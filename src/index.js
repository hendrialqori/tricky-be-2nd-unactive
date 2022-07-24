import express from 'express'
import multer from 'multer'
import { dbAuthenticate } from './configs/index.js'
import { route } from './routes/index.js'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from 'dotenv'


const app = express()
const PORT = process.env.PORT || 8080

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
    config()

    app.use(express.json())
    app.use(cookieParser())

    dbAuthenticate()
    
    app.use(cors({
        origin : process.env.EXPRESS_MAIN_ORIGIN,
        credentials : true
    }))
    console.log(process.env.EXPRESS_MAIN_ORIGIN)

    app.use(helmet({
        crossOriginResourcePolicy: false,
    }))
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

    app.get("/", (req, res) => {
        res.json({
            message : "Hello folks!"
        })
    })


    app.listen(PORT, ()=> {
        console.log(`Server is running in http://localhost:${PORT}`)
    })
    
})();

