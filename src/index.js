import express from 'express'
import multer from 'multer'
import { dbAuthenticate } from './configs/index.js'
import { route } from './routes/index.js'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from 'dotenv'
import fileSync from 'fs'


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

const imagesDir = () => {
    const existDir = fileSync.existsSync("images")
    if(!existDir) return fileSync.mkdirSync("images") 
    
    return
}
    

(()=> {
    config()
    imagesDir()
    
    app.use(express.json())
    app.use(cookieParser())

    dbAuthenticate()
    
    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", process.env.EXPRESS_MAIN_ORIGIN)
        res.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, PATCH, DELETE, OPTION")
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.setHeader("Access-Control-Allow-Credentials", true)
        next()
    })

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

    app.get("/", (req, res) => {
        res.json({
            message : "Hello Hendri, Its works!"
        })
    })

    app.listen(PORT, ()=> {
        console.log(`Server is running in http://localhost:${PORT}`)
    })
    
})();

